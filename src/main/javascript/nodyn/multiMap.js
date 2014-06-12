/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A <code>MultiMap</code> is a type of Map object that can store more
 * than one value for a given key. This is useful for storing and passing
 * around things like HTTP headers where a single header can have multiple
 * values.
 *
 * @constructor
 * @param {org.vertx.java.core.MultiMap} multiMap the underlying Java MultiMap instance
 */
var MultiMap = function(proxy) {
  this.proxy = proxy;
};

/**
 * Return the value for the given name
 *
 * @param {string} name The name to lookup in the map
 * @returns {string} value The value for the given name. If more than one value maps to
 *          <code>name</code>, the first value is returned.
 */
MultiMap.prototype.get = function(name) {
  if (!this.proxy) { return undefined; }
  var value = this.proxy.get(name);
  // Handles discrepancy between how rhino and dynjs deal with null return values
  // from Java objects. It seems as though Rhino changes the null to undefined, or
  // perhaps has some distinction where undefined is returned iff the key isn't there.
  if (value === null) {
    return undefined;
  }
  return value;
};

/**
 * Execute the given function for every name, value pair stored
 *
 * @param {function} func The function to execute
 */
MultiMap.prototype.forEach = function(func) {
  if (!this.proxy) { return; }
  var names = this.proxy.names().iterator();
  while (names.hasNext()) {
    var name = names.next();
    var values = this.proxy.getAll(name).iterator();
    while (values.hasNext()) {
      func(name, values.next());
    }
  }
};

/**
 * Return all values stored for the given name.
 *
 * @param {string} name The name to lookup values for
 * @returns {Array} The values for the given name
 */
MultiMap.prototype.getAll = function(name) {
  if (!this.proxy) { return []; }
  var n =  this.proxy.getAll(name);
  return _convertToArray(n);
};

/**
 * Returns if a value for the given name is stored
 *
 * @param {string} name The name to check for
 * @returns {boolean} <code>true</code> if <code>name</code> is stored in this map
 */
MultiMap.prototype.contains = function(name) {
  if (!this.proxy) { return false; }
  return this.proxy.contains(name);
};

/**
 * Returns if this map is empty
 *
 * @returns {boolean} <code>true</code> if empty
 */
MultiMap.prototype.isEmpty = function() {
  if (!this.proxy) { return true; }
  return this.proxy.isEmpty();
};

/**
 * Return all names for which values are stored
 *
 * @returns {Array} The names for which values are stored
 */
MultiMap.prototype.names = function() {
  if (!this.proxy) { return []; }
  var n =  this.proxy.names();
  return _convertToArray(n);
};

/**
 * Add a value for the given name
 *
 * @param {string} name The name under which the value should be stored
 * @param {string} value The value to store
 * @returns {module:vertx/multi_map~MultiMap}
 */
MultiMap.prototype.add = function(name, value) {
  if (this.proxy) {
    this.proxy.add(name, value);
  }
  return this;
};

/**
 * Set a value for the given name. All previous stored values under the name will get deleted.
 *
 * @param {string} name The name under which the value should be stored
 * @param {string} value The value to store
 * @returns {module:vertx/multi_map~MultiMap}
 */
MultiMap.prototype.set = function(name, value) {
  if (this.proxy) {
    this.proxy.set(name, value);
  }
  return this;
};

/**
 * Remove all values stored under the name
 *
 * @param {string} name The name for which all values should be removed
 * @returns {module:vertx/multi_map~MultiMap} self
 */
MultiMap.prototype.remove = function(name) {
  if (this.proxy) {
    this.proxy.remove(name);
  }
  return this;
};

/**
 * Clears the map
 *
 * @returns {module:vertx/multi_map~MultiMap} self
 */
MultiMap.prototype.clear = function() {
  if (this.proxy) {
    this.proxy.clear();
  }
  return this;
};

/**
 * Return the number of names stored.
 * @returns {number} the number of names stored
 */
MultiMap.prototype.size = function() {
  if (!this.proxy) { return 0; }
  return this.proxy.size();
};

function _convertToArray(j_col) {
  var n = j_col.iterator();
  var array = [];
  var i = 0;

  while (n.hasNext()) {
    array[i++] = n.next();
  }
  return array;
}


module.exports = MultiMap;
