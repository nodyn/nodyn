package io.nodyn.fs;

import io.netty.channel.EventLoopGroup;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;
import io.nodyn.handle.HandleWrap;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

import static java.nio.file.StandardWatchEventKinds.*;

/**
 * @author Lance Ball
 */
public class NodeStatWatcher extends HandleWrap {
    private final EventLoopGroup eventLoop;
    private File watchedDir;
    private File watchedFile;
    private WatchService watcher;
    private Thread thread;


    public NodeStatWatcher(NodeProcess process) {
        super(process, false);
        this.eventLoop = process.getEventLoop().getEventLoopGroup();
    }

    public void start(String path, boolean persistent, int interval) {
        // TODO: Deal with persistent and interval flags
        if (persistent) {
            ref();
        }
        watchedDir = new File(path);

        if (!watchedDir.isDirectory()) {
            watchedFile = watchedDir;
            watchedDir = watchedFile.getParentFile();
        }
        thread = new Thread(new Worker());
        try {
            Path toWatch = Paths.get(watchedDir.getCanonicalPath());
            watcher = toWatch.getFileSystem().newWatchService();
            toWatch.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
            thread.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        try {
            unref();
            this.watcher.close();
            this.thread.join();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    class Worker implements Runnable {
        @Override
        public void run() {
            try {
                WatchKey key = watcher.take();
                while (key != null && key.isValid()) {
                    for (final WatchEvent event : key.pollEvents()) {
                        if (watchedFile == null || watchedFile.getName().equals(event.context().toString())) {
                            emit("change", CallbackResult.createSuccess(event.context().toString()));
                        }
                    }
                    key.reset();
                    key = watcher.take();
                }
            } catch (Throwable e) {
                // If a thread is currently blocked in the take or poll methods waiting for a key to be queued then it immediately receives a ClosedWatchServiceException.
                // Any valid keys associated with this watch service are invalidated.
            }
        }
    }

}
