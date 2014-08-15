package io.nodyn.fs;

import io.netty.channel.EventLoopGroup;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

import static java.nio.file.StandardWatchEventKinds.*;

/**
 * @author Lance Ball
 */
public class FsEventWrap extends HandleWrap {

    private Thread thread;

    public FsEventWrap(NodeProcess process) {
        super(process, true);
        this.eventLoop = process.getEventLoop().getEventLoopGroup();
    }

    public void start(String path, boolean persistent, boolean recursive) {
        watchedDir =  new File(path);

        if (!watchedDir.isDirectory()) {
            watchedFile = watchedDir;
            watchedDir = watchedFile.getParentFile();
        }
        thread = new Thread(new Worker());
        Path toWatch = null;
        try {
            toWatch = Paths.get(watchedDir.getCanonicalPath());
            watcher = toWatch.getFileSystem().newWatchService();
            toWatch.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
            thread.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void close() {
        try {
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
                while(key != null && key.isValid()) {
                    for (final WatchEvent event : key.pollEvents()) {
                        if (watchedFile == null || watchedFile.getName().equals(event.context().toString())) {
                            eventLoop.submit(new Runnable() {
                                @Override
                                public void run() {
                                    emit("change", CallbackResult.createSuccess(event.kind().toString(), event.context().toString()));
                                }
                            });
                        }
                    }
                    key.reset();
                    key = watcher.take();
                }
            } catch (Exception e) {
                // If a thread is currently blocked in the take or poll methods waiting for a key to be queued then it immediately receives a ClosedWatchServiceException.
                // Any valid keys associated with this watch service are invalidated.
            }
        }
    }

    private final EventLoopGroup eventLoop;
    private WatchService watcher;
    private File watchedDir;
    private File watchedFile;

}
