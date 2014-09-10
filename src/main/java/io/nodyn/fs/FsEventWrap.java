package io.nodyn.fs;

import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;
import io.nodyn.loop.EventLoop;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

import static java.nio.file.StandardWatchEventKinds.*;

/**
 * @author Lance Ball
 */
public class FsEventWrap extends HandleWrap {

    private final EventLoop eventLoop;
    private boolean persistent;

    public FsEventWrap(NodeProcess process) {
        super(process, true);
        eventLoop = process.getEventLoop();
    }

    public void start(String path, boolean persistent, boolean recursive) {
        File dir =  new File(path);
        this.persistent = persistent;
        if (!dir.isDirectory()) {
            watched = dir;
            dir = watched.getParentFile();
        }
        try {
            if (persistent) ref();
            Path toWatch = Paths.get(dir.getCanonicalPath());
            watcher = toWatch.getFileSystem().newWatchService();
            toWatch.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
            this.eventLoop.submitBlockingTask(new Runnable() {
                @Override
                public void run() {
                    try {
                        WatchKey key = watcher.take();
                        while(key != null && key.isValid()) {
                            for (final WatchEvent event : key.pollEvents()) {
                                if (watched == null || watched.getName().equals(event.context().toString())) {
                                    emit("change", CallbackResult.createSuccess(event.kind().toString(), event.context().toString()));
                                }
                            }
                            key.reset();
                            key = watcher.take();
                        }
                    } catch (Exception e) {
                        // If a thread is currently blocked in the take or poll methods waiting for
                        // a key to be queued then it immediately receives a ClosedWatchServiceException.
                        // Any valid keys associated with this watch service are invalidated.
                    }
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void close() {
        try {
            if (persistent) unref();
            this.watcher.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private WatchService watcher;
    private File watched;

}
