package org.projectodd.nodyn.netty;

import io.netty.channel.*;
import io.netty.util.concurrent.EventExecutor;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.ScheduledFuture;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * @author Bob McWhirter
 */
public class RefCountedEventLoopGroup implements EventLoopGroup {

    private final ManagedEventLoopGroup group;
    private final RefHandle refHandle;

    public RefCountedEventLoopGroup(ManagedEventLoopGroup group) {
        this.group = group;
        this.refHandle = new RefHandle( group );
    }

    protected EventLoopGroup getEventLoopGroup() {
        return this.group.getDelegate();
    }

    public RefHandle refHandle() {
        return this.refHandle;
    }

    @Override
    public EventLoop next() {
        return getEventLoopGroup().next();
    }

    @Override
    public ChannelFuture register(Channel channel) {
        return getEventLoopGroup().register(channel);
    }

    @Override
    public ChannelFuture register(Channel channel, ChannelPromise promise) {
        return getEventLoopGroup().register(channel, promise);
    }

    @Override
    public boolean isShuttingDown() {
        return getEventLoopGroup().isShuttingDown();
    }

    @Override
    public Future<?> shutdownGracefully() {
        return getEventLoopGroup().shutdownGracefully();
    }

    @Override
    public Future<?> shutdownGracefully(long quietPeriod, long timeout, TimeUnit unit) {
        return getEventLoopGroup().shutdownGracefully(quietPeriod, timeout, unit);
    }

    @Override
    public Future<?> terminationFuture() {
        return getEventLoopGroup().terminationFuture();
    }

    @Override
    @Deprecated
    public void shutdown() {
        getEventLoopGroup().shutdown();
    }

    @Override
    @Deprecated
    public List<Runnable> shutdownNow() {
        return getEventLoopGroup().shutdownNow();
    }

    @Override
    public Iterator<EventExecutor> iterator() {
        return getEventLoopGroup().iterator();
    }

    @Override
    public Future<?> submit(Runnable task) {
        return getEventLoopGroup().submit(task);
    }

    @Override
    public <T> Future<T> submit(Runnable task, T result) {
        return getEventLoopGroup().submit(task, result);
    }

    @Override
    public <T> Future<T> submit(Callable<T> task) {
        return getEventLoopGroup().submit(task);
    }

    @Override
    public ScheduledFuture<?> schedule(Runnable command, long delay, TimeUnit unit) {
        return getEventLoopGroup().schedule(command, delay, unit);
    }

    @Override
    public <V> ScheduledFuture<V> schedule(Callable<V> callable, long delay, TimeUnit unit) {
        return getEventLoopGroup().schedule(callable, delay, unit);
    }

    @Override
    public ScheduledFuture<?> scheduleAtFixedRate(Runnable command, long initialDelay, long period, TimeUnit unit) {
        return getEventLoopGroup().scheduleAtFixedRate(command, initialDelay, period, unit);
    }

    @Override
    public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command, long initialDelay, long delay, TimeUnit unit) {
        return getEventLoopGroup().scheduleWithFixedDelay(command, initialDelay, delay, unit);
    }

    @Override
    public boolean isShutdown() {
        return getEventLoopGroup().isShutdown();
    }

    @Override
    public boolean isTerminated() {
        return getEventLoopGroup().isTerminated();
    }

    @Override
    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        return getEventLoopGroup().awaitTermination(timeout, unit);
    }

    @Override
    public <T> List<java.util.concurrent.Future<T>> invokeAll(Collection<? extends Callable<T>> tasks) throws InterruptedException {
        return getEventLoopGroup().invokeAll(tasks);
    }

    @Override
    public <T> List<java.util.concurrent.Future<T>> invokeAll(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit) throws InterruptedException {
        return getEventLoopGroup().invokeAll(tasks, timeout, unit);
    }

    @Override
    public <T> T invokeAny(Collection<? extends Callable<T>> tasks) throws InterruptedException, ExecutionException {
        return getEventLoopGroup().invokeAny(tasks);
    }

    @Override
    public <T> T invokeAny(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
        return getEventLoopGroup().invokeAny(tasks, timeout, unit);
    }

    @Override
    public void execute(Runnable command) {
        getEventLoopGroup().execute(command);
    }

    //@Override
    //public void forEach(Consumer<? super EventExecutor> action) {
        //getEventLoopGroup().forEach(action);
    //}

    //@Override
    //public Spliterator<EventExecutor> spliterator() {
        //return getEventLoopGroup().spliterator();
    //}
}
