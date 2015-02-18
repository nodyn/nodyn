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
import io.nodyn.NodeProcess;

import java.util.HashSet;
import java.util.Set;
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
    private final AtomicInteger taskCounter = new AtomicInteger();

    private Set<RefHandle> handles = new HashSet<>();

    protected int counter;
    private NodeProcess process;

    public EventLoop(EventLoopGroup eventLoopGroup) {
        this(eventLoopGroup, true);
    }

    public EventLoop(EventLoopGroup eventLoopGroup, boolean controlLifecycle) {
        this.eventLoopGroup = eventLoopGroup;
        this.controlLifecycle = controlLifecycle;

        CountDownLatch latch = new CountDownLatch(1);
        this.eventLoopGroup.submit(() -> {
            latch.countDown();
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            EventLoop.this.process.getNodyn().handleThrowable(e);
            this.eventLoopGroup = null;
        }

        this.userTaskExecutor = Executors.newSingleThreadScheduledExecutor((Runnable r) -> {
            Thread t = new Thread(r, "user-tasks");
            return t;
        });

        this.blockingTaskExecutor = Executors.newCachedThreadPool((Runnable r) -> {
            Thread t = new Thread(r, "blocking-task");
            return t;
        });
    }

    public void setProcess(NodeProcess process) {
        this.process = process;
    }

    public EventLoopGroup getEventLoopGroup() {
        return this.eventLoopGroup;
    }

    public Future<?> submitUserTask(final Runnable task, String name) {
        final RefHandle handle = newHandle("user-task#" + name );
        this.taskCounter.incrementAndGet();
        return this.userTaskExecutor.submit(() -> {
            try {
                task.run();
            } finally {
                try {
                    taskComplete();
                } catch (Throwable t) {
                    EventLoop.this.process.getNodyn().handleThrowable(t);
                }
            }
            handle.unref();
        });
    }

    private void taskComplete() {
        int val = this.taskCounter.decrementAndGet();
        if (val == 0) {
            this.process.doNextTick();
        }
    }

    public ScheduledFuture<?> scheduleUserTask(final Runnable task, int time, TimeUnit units) {
        return this.userTaskExecutor.schedule(task, time, units);
    }

    public Future<?> submitBlockingTask(final Runnable task) {
        return this.blockingTaskExecutor.submit(() -> {
            try {
                task.run();
            } catch (Throwable t) {
                EventLoop.this.process.getNodyn().handleThrowable(t);
            }
        });
    }

    public int refCount() {
        return this.counter;
    }

    @Override
    public RefHandle newHandle(String name) {
        return newHandle(true, name);
    }

    public RefHandle newHandle(boolean count, String name) {
        return new RefHandle(this, count, name);
    }

    public void dump() {
        System.err.println(" ---- ");
        System.err.println(this.handles);
        System.err.println(" ---- ");

    }

    @Override
    public synchronized void incrCount(RefHandle handle) {
        ++this.counter;
        this.handles.add(handle);
    }

    @Override
    public synchronized void decrCount(RefHandle handle) {
        --this.counter;
        this.handles.remove(handle);
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
                future.addListener((FutureListener<Object>) (io.netty.util.concurrent.Future<Object> future1) -> {
                    EventLoop.this.userTaskExecutor.shutdown();
                    EventLoop.this.blockingTaskExecutor.shutdown();
                    EventLoop.this.latch.countDown();
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

    public NodeProcess getProcess() {
        return process;
    }
}
