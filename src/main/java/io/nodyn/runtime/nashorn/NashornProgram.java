/*
 * Copyright 2015 lanceball.
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
package io.nodyn.runtime.nashorn;

import io.nodyn.runtime.Program;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.CompiledScript;
import javax.script.ScriptContext;
import javax.script.ScriptException;

/**
 *
 * @author lanceball
 */
public class NashornProgram implements Program {
    private final CompiledScript script;
    private final String fileName;
    
    public NashornProgram(CompiledScript script) {
        this(script, null);
    }

    NashornProgram(CompiledScript compile, String fileName) {
        this.script = compile;
        this.fileName = fileName;
    }

    @Override
    public Object execute(Object context) {
        System.out.println("Executing compiled script " + script + " (" + fileName + ") in context " + context);
        if (context instanceof ScriptContext) {
            try {
                return script.eval((ScriptContext) context);
            } catch (ScriptException ex) {
                Logger.getLogger(NashornRuntime.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

}
