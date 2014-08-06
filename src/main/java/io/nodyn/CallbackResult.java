package io.nodyn;

/**
 * @author Bob McWhirter
 */
public class CallbackResult {

    public static final CallbackResult EMPTY_SUCCESS = new CallbackResult( (Object) null );

    private final Throwable error;
    private final Object result;

    private CallbackResult(Throwable error) {
        this.result = null;
        this.error = error;
    }

    private CallbackResult(Object result) {
        this.result = result;
        this.error = null;
    }

    public boolean isError() {
        return this.error != null;
    }

    public Object getResult() {
        return this.result;
    }

    public Throwable getError() {
        return this.error;
    }

    public static CallbackResult createError(Throwable error) {
        return new CallbackResult( error );
    }

    public static CallbackResult createSuccess(Object result) {
        return new CallbackResult( result );
    }

    public static CallbackResult createSuccess(Object...results) {
        return new CallbackResult( results );

    }

    public static CallbackResult createSuccess() {
        return new CallbackResult( (Object) null );
    }

    public String toString() {
        return "[CallbackResult: result=" + this.result + "; error=" + this.error + "]";
    }

}
