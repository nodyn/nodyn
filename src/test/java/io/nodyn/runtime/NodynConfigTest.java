package io.nodyn.runtime;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import static org.junit.Assert.*;

/**
 * @author Bob McWhirter
 */
public class NodynConfigTest {

    @Test
    public void testHelp() {
        NodynConfig config = config("--help --foo -bar");

        assertTrue( config.isHelp() );
    }

    @Test
    public void testVersion() {
        NodynConfig config = config("--version --foo -bar -e" );
        assertTrue( config.isVersion() );
    }

    @Test
    public void testExecNoArg() {
        try {
            NodynConfig config = config("--eval");
            fail( "should have thrown" );
        } catch (IllegalArgumentException e) {
            // expected and correct
        }
    }

    @Test
    public void testExecWithArg() {
        NodynConfig config = config("--eval 4+4");
        assertEquals( "4+4", config.getEvalString() );
        assertFalse( config.getPrint() );
    }

    @Test
    public void testPrint() {
        NodynConfig config = config("--print 4+4");
        assertEquals( "4+4", config.getEvalString() );
        assertTrue( config.getPrint() );
    }

    private NodynConfig config(String args) {
        StringTokenizer tokens = new StringTokenizer(args);
        List<String> argv = new ArrayList<>();
        while (tokens.hasMoreTokens()) {
            argv.add(tokens.nextToken());
        }

        return new NodynConfig(argv.toArray(new String[argv.size()]));
    }
}
