package org.projectodd.nodyn.integration.javascript;

/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://lanceball.com">Lance Ball</a>
 */

import org.junit.runner.RunWith;
import org.projectodd.nodyn.test.ScriptClassRunner;

@RunWith(ScriptClassRunner.class)
public abstract class AbstractJavascriptIntegrationTest {
    
    private String filename;

    public AbstractJavascriptIntegrationTest(String filename) {
        this.filename = filename;
    }
    
    public String getFilename() {
        return this.filename;
    }
}
