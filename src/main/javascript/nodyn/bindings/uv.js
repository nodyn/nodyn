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

"use strict";

var UV = {};

UV.errname = function(err) {
  if ( err == UV.EAI_NODATA ) {
    return "EAI_NODATA";
  }
}

UV.UV_EOF = -1;

UV.UV_EAI_ADDRFAMILY = -3000;
UV.UV_EAI_AGAIN      = -3001;
UV.UV_EAI_BADFLAGS   = -3002;
UV.UV_EAI_CANCELED   = -3003;
UV.UV_EAI_FAIL       = -3004;
UV.UV_EAI_FAMILY     = -3005;
UV.UV_EAI_MEMORY     = -3006;
UV.UV_EAI_NODATA     = -3007;
UV.UV_EAI_NONAME     = -3008;
UV.UV_EAI_OVERFLOW   = -3009;
UV.UV_EAI_SERVICE    = -3010;
UV.UV_EAI_SOCKTYPE   = -3011;
UV.UV_EAI_BADHINTS   = -3013;
UV.UV_EAI_PROTOCOL   = -3014;

UV.UV_EAGAIN = -4088;
UV.UV_EMFILE = -4066;
UV.UV_ENFILE = -4061;
UV.UV_ENOENT = -4058;

module.exports = UV;