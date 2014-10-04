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
package io.nodyn.runtime.dynjs;

import io.nodyn.runtime.Program;
import org.dynjs.runtime.*;
import org.dynjs.runtime.Compiler;
import org.dynjs.runtime.builtins.DynJSBuiltin;

/**
 * @author Lance Ball
 */
public class DynJSProgram implements Program {

    private final JSProgram script;

    public DynJSProgram(DynJSRuntime runtime, String source, String fileName) throws Throwable {
        Compiler compiler = runtime.newCompiler();
        compiler.withSource(source);
        compiler.withFileName( fileName );
        this.script = compiler.compile();
    }

    @Override
    public Object execute(Object context) {
        DynJSBuiltin dynjsBuiltin = (DynJSBuiltin) ((JSObject)context).get(null, "dynjs");
        DynJS runtime = dynjsBuiltin.getRuntime();
        return runtime.newRunner().withSource( this.script ).execute();
    }
}
