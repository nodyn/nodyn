package io.nodyn.fs;

import io.netty.channel.EventLoopGroup;
import io.netty.util.concurrent.ScheduledFuture;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.concurrent.TimeUnit;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;

/**
 * @author Lance Ball
 */
public class FsEventWrap extends HandleWrap implements Runnable {

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

        try {
            Path toWatch = Paths.get(watchedDir.getCanonicalPath());
            myWatcher = toWatch.getFileSystem().newWatchService();
            toWatch.register(myWatcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
            this.future = this.eventLoop.schedule(this, 0, TimeUnit.MILLISECONDS);
        } catch (IOException e) {
            // TODO: Handle errors
            e.printStackTrace();
        }
    }

    @Override
    public void close() {
        this.future.cancel( false );
        try {
            myWatcher.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        try {
            WatchKey key = myWatcher.take();
            while(key != null) {
                for (WatchEvent event : key.pollEvents()) {
                    // TODO: Examine event and make callback
                    if (watchedFile == null) {
                        // user is watching a directory, execute the callback for all events
                        System.err.println(">>>>>> Event for matched dir: " + event.kind());
                        makeCallback(0);
                    } else if (watchedFile.getName().equals(event.context().toString())) {
                        // user is watching a file, execute the callback for only the requested file
                        System.err.println(">>>>>> Event for matched file: " + event.kind());
                        makeCallback(0);
                    }
                }
                key.reset();
                key = myWatcher.take();
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private final EventLoopGroup eventLoop;
    private ScheduledFuture<?> future;
    private WatchService myWatcher;
    private File watchedDir;
    private File watchedFile;

}
