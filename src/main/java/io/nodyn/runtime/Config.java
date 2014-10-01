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
package io.nodyn.runtime;

/**
 * Configuration interface for Nodyn runtimes
 * @author Lance Ball
 */
public interface Config {

    /**
     * Get the command line args
     * @return the command line args
     */
    Object[] getArgv();

    /**
     * Sets the command line args
     *
     * http://nodejs.org/api/process.html#process_process_argv
     *
     * @param argv an array of Objects
     */
    void setArgv(Object[] argv);

}
