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
