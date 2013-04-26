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

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.annotation.Annotation;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.runner.manipulation.Filter;
import org.junit.runner.manipulation.NoTestsRemainException;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.InitializationError;
import org.vertx.testtools.JavaClassRunner;
import org.vertx.testtools.TestVerticleInfo;

public class OldScriptClassRunner extends JavaClassRunner {

    private static final String FILE_SEP = System.getProperty( "file.separator" );
    private static final String TEST_SCRIPTS_DIR = "src/test/resources".replace( "/", FILE_SEP );

    public OldScriptClassRunner(Class<?> klass) throws InitializationError {
        super( klass );
    }

    @Override
    public void filter(Filter filter) throws NoTestsRemainException {
        System.err.println( "FILTER: " + filter );
        super.filter( filter );
    }

    @Override
    protected List<FrameworkMethod> getTestMethods() {
        List<FrameworkMethod> meths = new ArrayList<>();
        Class<?> testClass = getTestClass().getJavaClass();
        TestVerticleInfo ann = getAnnotation();
        if (ann == null) {
            throw new IllegalArgumentException( "Please annotate your test classes with TestVerticleInfo" );
        }

        String funcRegex = ann.funcRegex();
        File scriptsDir = new File( TEST_SCRIPTS_DIR );
        if (!scriptsDir.exists()) {
            throw new IllegalArgumentException( "Scripts directory does not exist: " + scriptsDir );
        }

        FilenameFilter filter = new RegExFileNameFilter( ann.filenameFilter() );

        List<File> testScripts = findTestFiles( scriptsDir, filter );

        if (testScripts.isEmpty()) {
            throw new IllegalStateException( "There are no scripts in directory " + scriptsDir + " or child directories, matching filter " + filter );
        }

        Pattern funcPattern = Pattern.compile( funcRegex );
        Path scriptsDirPath = scriptsDir.toPath();
        for (File scriptFile : testScripts) {
            Path scriptFilePath = scriptFile.toPath();
            Path parent = scriptFilePath.getParent();
            Path filename = scriptFilePath.getFileName();
            try (InputStream is = new BufferedInputStream( new FileInputStream( scriptFile ) )) {
                StringBuilder sb = new StringBuilder();
                BufferedReader br = new BufferedReader( new InputStreamReader( is ) );
                for (String line = br.readLine(); line != null; line = br.readLine()) {
                    sb.append( line ).append( "\n" );
                }
                br.close();
                Matcher m = funcPattern.matcher( sb.toString() );
                while (m.find()) {
                    String methodName = m.group( 1 );

                    FrameworkMethod meth = new DummyFrameWorkMethod( parent + "|" + filename + "|" + methodName );
                    meths.add( meth );
                }
            } catch (IOException e) {
                throw new IllegalStateException( "Failed to read script " + scriptFile );
            }
        }
        if (meths.isEmpty()) {
            throw new IllegalStateException( "There are no test methods in the tests sctripts" );
        }
        return meths;
    }

    private List<File> findTestFiles(File dir, FilenameFilter filter) {
        List<File> list = new ArrayList<>();
        File[] files = dir.listFiles( filter );
        for (File file : files) {
            if (file.isDirectory()) {
                list.addAll( findTestFiles( file, filter ) );
            } else {
                list.add( file );
            }
        }
        return list;
    }

    @Override
    protected String getTestName(String methodName) {
        String[] parts = methodName.split( "\\|" );
        return parts[0] + FILE_SEP + parts[1] + "#" + parts[2];
    }

    @Override
    protected URL getClassPath(String methodName) {
        try {
            return new File( methodName.split( "\\|" )[0] ).toURI().toURL();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    protected String getMain(String methodName) {
        return methodName.split( "\\|" )[1];
    }

    @Override
    public String getActualMethodName(String methodName) {
        return methodName.split( "\\|" )[2];
    }

    @Override
    protected List<FrameworkMethod> computeTestMethods() {
        return getTestMethods();
    }

    private class DummyFrameWorkMethod extends FrameworkMethod {

        String methodName;

        DummyFrameWorkMethod(String methodName) {
            super( null );
            this.methodName = methodName;
        }

        @Override
        public Object invokeExplosively(Object target, Object... params) throws Throwable {
            return null;
        }

        public String getName() {
            return methodName;
        }

        @Override
        public void validatePublicVoidNoArg(boolean isStatic, List<Throwable> errors) {
        }

        @Override
        public void validatePublicVoid(boolean isStatic, List<Throwable> errors) {
        }

        /*
         * @Override
         * public void validateNoTypeParametersOnArgs(List<Throwable> errors) {
         * }
         */

        @Override
        public boolean isShadowedBy(FrameworkMethod other) {
            return false;
        }

        @Override
        public Annotation[] getAnnotations() {
            return null;
        }

        @Override
        public <T extends Annotation> T getAnnotation(Class<T> annotationType) {
            return null;
        }

    }

    private class RegExFileNameFilter implements FilenameFilter {

        final Pattern pattern;

        RegExFileNameFilter(String regex) {
            pattern = Pattern.compile( regex );
        }

        @Override
        public boolean accept(File dir, String name) {
            File f = new File( dir, name );
            return f.isDirectory() || pattern.matcher( name ).matches();
        }

        public String toString() {
            return pattern.toString();
        }
    }
}
