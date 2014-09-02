/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.nodyn.loop;

import io.netty.channel.EventLoopGroup;
import io.netty.util.concurrent.*;

import java.util.concurrent.*;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Bob McWhirter
 */
public class EventLoop implements RefCounted {

    private final ScheduledExecutorService userTaskExecutor;
    private final ExecutorService blockingTaskExecutor;
    private CountDownLatch latch = new CountDownLatch(1);
    private EventLoopGroup eventLoopGroup;
    private final boolean controlLifecycle;

    protected int counter;

    public EventLoop(EventLoopGroup eventLoopGroup) {
        this(eventLoopGroup, true);
    }

    public EventLoop(EventLoopGroup eventLoopGroup, boolean controlLifecycle) {
        this.eventLoopGroup = eventLoopGroup;
        this.controlLifecycle = controlLifecycle;

        final CountDownLatch latch = new CountDownLatch(1);

        this.eventLoopGroup.submit(new Runnable() {
            @Override
            public void run() {
                latch.countDown();
            }
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
            this.eventLoopGroup = null;
        }

        this.userTaskExecutor = Executors.newSingleThreadScheduledExecutor(new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "user-tasks");
                return t;
            }
        });

        this.blockingTaskExecutor = Executors.newCachedThreadPool(new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "blocking-task" );
                return t;
            }
        });
    }

    public EventLoopGroup getEventLoopGroup() {
        return this.eventLoopGroup;
    }

    public Future<?> submitUserTask(final Runnable task) {
        final RefHandle handle = newHandle();
        return this.userTaskExecutor.submit(new Runnable() {
            @Override
            public void run() {
                task.run();
                handle.unref();
            }
        });
    }

    public ScheduledFuture<?> scheduleUserTask(final Runnable task, int time, TimeUnit units) {
        return this.userTaskExecutor.schedule(task, time, units);
    }

    public Future<?> submitBlockingTask(final Runnable task) {
        return this.blockingTaskExecutor.submit( task );
    }

    public int refCount() {
        return this.counter;
    }

    public RefHandle newHandle() {
        return new RefHandle(this);
    }

    public RefHandle newHandle(boolean count) {
        return new RefHandle(this, count);
    }


    public synchronized void incrCount() {
        ++this.counter;
        //System.err.println(getClass().getSimpleName() + " ++ " + this.counter);
        //new Exception().printStackTrace();
    }

    public synchronized void decrCount() {
        --this.counter;
        //System.err.println(getClass().getSimpleName() + " -- " + this.counter);
        //new Exception().printStackTrace();
        if (this.counter == 0) {
            doShutdown();
        }
    }

    public void shutdown() {
        doShutdown();
    }

    protected void doShutdown() {
        if (this.eventLoopGroup != null) {
            if (this.controlLifecycle) {
                io.netty.util.concurrent.Future<?> future = this.eventLoopGroup.shutdownGracefully(0, 2, TimeUnit.SECONDS);
                future.addListener(new FutureListener<Object>() {
                    @Override
                    public void operationComplete(io.netty.util.concurrent.Future<Object> future) throws Exception {
                        EventLoop.this.userTaskExecutor.shutdown();
                        EventLoop.this.blockingTaskExecutor.shutdown();
                        EventLoop.this.latch.countDown();
                    }
                });
                this.eventLoopGroup = null;
            } else {
                this.userTaskExecutor.shutdown();
                this.blockingTaskExecutor.shutdown();
                this.latch.countDown();
            }

        }
    }

    public void await() throws InterruptedException {
        this.latch.await();
    }

}
