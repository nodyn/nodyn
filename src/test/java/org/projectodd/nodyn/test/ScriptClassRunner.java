/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://tfox.org">Tim Fox</a>
 */
package org.projectodd.nodyn.test;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.ArrayList;
import java.util.ListIterator;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.runner.Description;
import org.junit.runner.Runner;
import org.junit.runner.manipulation.Filter;
import org.junit.runner.manipulation.Filterable;
import org.junit.runner.manipulation.NoTestsRemainException;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.model.InitializationError;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.PlatformLocator;
import org.vertx.java.platform.PlatformManager;

public class ScriptClassRunner extends Runner implements Filterable {

    public static final String TESTRUNNER_HANDLER_ADDRESS = "vertx.testframework.handler";
    private static final Pattern FUNCTION_PATTERN = Pattern.compile( "function[\\s]+(test[^\\s(]+)" );

    private static final long DEFAULT_TIMEOUT = 300;
    protected static final long TIMEOUT;
    static {
        String timeout = System.getProperty( "vertx.test.timeout" );
        TIMEOUT = timeout == null ? DEFAULT_TIMEOUT : Long.valueOf( timeout );
    }

    private Class<?> testClass;
    private String filename;
    private Description description;

    public ScriptClassRunner(Class<?> testClass) throws InitializationError {
        this.testClass = testClass;
        init();
    }

    private void init() {
        try {
            Constructor<?> constructor = testClass.getConstructor( null );
            Object fileRunner = constructor.newInstance();
            Method getFilename = testClass.getMethod( "getFilename", null );
            this.filename = (String) getFilename.invoke( fileRunner, null );
            initDescription();
        } catch (Exception e) {
            throw new RuntimeException( e );
        }
    }

    @Override
    public void filter(Filter filter) throws NoTestsRemainException {
        ArrayList<Description> children = this.description.getChildren();
        ListIterator<Description> childIter = children.listIterator();

        while (childIter.hasNext()) {

            if (!filter.shouldRun( childIter.next() )) {
                childIter.remove();
            }
        }

    }

    @Override
    public Description getDescription() {
        return this.description;
    }

    protected void initDescription() {
        this.description = Description.createSuiteDescription( testClass );

        InputStream stream = getClass().getClassLoader().getResourceAsStream( this.filename );

        try {
            BufferedReader in = new BufferedReader( new InputStreamReader( stream ) );
            String line = null;
            while ((line = in.readLine()) != null) {
                Matcher matcher = FUNCTION_PATTERN.matcher( line );
                if (matcher.find()) {
                    Description child = Description.createTestDescription( testClass, matcher.group( 1 ) );
                    this.description.addChild( child );

                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void run(RunNotifier notifier) {

        for (Description desc : this.description.getChildren()) {
            String methodName = desc.getMethodName();
            notifier.fireTestStarted( desc );

            PlatformManager mgr = PlatformLocator.factory.createPlatformManager();
            try {
                final AtomicReference<Throwable> failure = new AtomicReference<>();
                JsonObject conf = new JsonObject().putString( "methodName", methodName );
                final CountDownLatch testLatch = new CountDownLatch( 1 );
                Handler<Message<JsonObject>> handler = new Handler<Message<JsonObject>>() {
                    @Override
                    public void handle(Message<JsonObject> msg) {
                        JsonObject jmsg = msg.body();
                        String type = jmsg.getString( "type" );
                        switch (type) {
                        case "done":
                            break;
                        case "failure":
                            byte[] bytes = jmsg.getBinary( "failure" );
                            // Deserialize
                            try {
                                ObjectInputStream ois = new ObjectInputStream( new ByteArrayInputStream( bytes ) );
                                Throwable t = (Throwable) ois.readObject();
                                // We display this since otherwise Gradle
                                // doesn't
                                // display it to stdout/stderr
                                t.printStackTrace();
                                failure.set( t );
                            } catch (ClassNotFoundException | IOException e) {
                                throw new IllegalArgumentException( "Failed to deserialise error" );
                            }
                            break;
                        }
                        testLatch.countDown();
                    }
                };
                EventBus eb = mgr.vertx().eventBus();
                eb.registerHandler( TESTRUNNER_HANDLER_ADDRESS, handler );
                final CountDownLatch deployLatch = new CountDownLatch( 1 );
                final AtomicReference<String> deploymentIDRef = new AtomicReference<>();
                mgr.deployVerticle( this.filename, conf, new URL[0], 1, null, new Handler<AsyncResult<String>>() {
                    @Override
                    public void handle(AsyncResult<String> deploymentId) {
                        deploymentIDRef.set( deploymentId.result() );
                        deployLatch.countDown();
                    }
                } );
                waitForLatch( deployLatch );
                waitForLatch( testLatch );
                eb.unregisterHandler( TESTRUNNER_HANDLER_ADDRESS, handler );
                final CountDownLatch undeployLatch = new CountDownLatch( 1 );
                mgr.undeploy( deploymentIDRef.get(), new Handler<AsyncResult<Void>>() {
                    @Override
                    public void handle(AsyncResult<Void> v) {
                        undeployLatch.countDown();
                    }
                } );
                waitForLatch( undeployLatch );
                if (failure.get() != null) {
                    notifier.fireTestFailure( new Failure( desc, failure.get() ) );
                    /*
                    if (failure.get() instanceof Error) {
                        throw (Error) failure.get();
                    }
                    */
                }
                notifier.fireTestFinished( desc );
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    private void waitForLatch(CountDownLatch latch) {
        while (true) {
            try {
                if (!latch.await( TIMEOUT, TimeUnit.SECONDS )) {
                    throw new AssertionError( "Timed out waiting for test to complete" );
                }
                break;
            } catch (InterruptedException e) {
                // Ignore
            }
        }
    }

}
