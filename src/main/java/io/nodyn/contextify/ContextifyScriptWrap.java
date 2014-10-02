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

package io.nodyn.contextify;

import io.nodyn.Nodyn;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;
import org.dynjs.runtime.builtins.DynJSBuiltin;

/**
 * @author Bob McWhirter
 */
public class ContextifyScriptWrap {

    private final JSProgram script;

    public ContextifyScriptWrap(Nodyn runtime, String source, String fileName, boolean displayErrors) {
        Compiler compiler = runtime.newCompiler();
        compiler.withSource(source);
        compiler.withFileName( fileName );
        try {
            this.script = compiler.compile();
        } catch (Throwable t) {
            if ( displayErrors ) {
                t.printStackTrace();
            }
            throw t;
        }
    }

    public Object runInContext(JSObject context) {
        DynJSBuiltin dynjsBuiltin = (DynJSBuiltin) context.get(null, "dynjs");
        DynJS runtime = dynjsBuiltin.getRuntime();
        return runtime.newRunner().withSource( this.script ).execute();
    }
}
