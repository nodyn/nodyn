package io.nodyn;

/**
 * @author Bob McWhirter
 */
public class TestFailureException extends RuntimeException {

    public TestFailureException() {
        super("There were test failures");
    }

    public TestFailureException(Throwable cause) {
        super("There were test failures", cause);
    }
}
