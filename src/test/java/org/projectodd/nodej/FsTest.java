package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.File;
import java.io.IOException;


import org.dynjs.runtime.wrapper.JavascriptFunction;
import org.junit.Before;
import org.junit.Test;

public class FsTest extends NodejTestSupport {
    File tmpFile;
    
    @Before
    public void setUp() {
        super.setUp();
        eval("var fs = require('fs')");        
        eval("var done = false");
        eval("var thrown = false");
        eval("var check = function(e) { done = true; thrown = e ? true : false; }");
        try {
            tmpFile = File.createTempFile("pork-recipes", ".txt");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testRename() {
        assertThat(eval("fs.rename")).isInstanceOf(JavascriptFunction.class);
        String basedir = tmpFile.getParent();
        eval("fs.rename('" +tmpFile.getAbsolutePath()+ "', '"+basedir+"/granola.txt', check)");
        waitTilDone();
        File expected = new File(basedir + "/granola.txt");
        assertThat(expected.exists()).isEqualTo(true);
        expected.delete();
    }

    @Test
    public void testRenameSync() {
        assertThat(eval("fs.renameSync")).isInstanceOf(JavascriptFunction.class);
        String basedir = tmpFile.getParent();
        eval("fs.renameSync('" +tmpFile.getAbsolutePath()+ "', '"+basedir+"/granola.txt')");
        File expected = new File(basedir + "/granola.txt");
        assertThat(expected.exists()).isEqualTo(true);
        expected.delete();
    }
    
    @Test
    public void testRenameException() {
        eval("fs.rename('blarg', 'granola.txt', check)");
        waitTilDone();
        assertThat(eval("thrown")).isEqualTo(true);
    }
    
    private void waitTilDone() {
        while(!(boolean) eval("done")) { try { Thread.sleep(10); } catch (InterruptedException e) { } }
    }
    
}
