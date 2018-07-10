class JSONPath extends Array {

  /**
   * Converts the path to a JSON pointer, as defined in RFC 6901.
   * @return {string} The path as a JSON pointer.
   */
  getPointer() {
    return `/${this.join('/')}`;
  }

  /**
   * Resolves the path within an object, and, optionally, modifies the matching value(s) in place.
   * @param {*} object The object in which to resolve the path.
   * @param {function} [callback] A callback that receives a matching value, and replaces it with its return value.
   * @return {*} The matching value, the array of matching values, or null.
   */
  async resolve(object, callback) {
    let nodes = [object];
    for (let i = 0; i < this.length; i++) {
      // for each segment of the path, process the node stack
      let segment = this[i];
      let n = nodes.length;
      for (let j = 0; j < n; j++) {
        // for each node in the stack, check if it contains the path segment
        let node = nodes.pop();
        if (segment === '*' && node instanceof Array) {
          // if the path segment is null and the node is an array, add all
          // array items to the stack
          if (callback && this.length === i + 1) {
            // if we have reached the end of the path, apply the callback to
            // all array items
            for (let k = 0; k < node.length; k++) {
              node[k] = await callback(node[k]);
            }
          }
          nodes.unshift(...node);
        } else if (node instanceof Object && node[segment] !== undefined) {
          // if the path segment is not null and the node contains the path
          // segment, add the child node to the stack
          if (callback && this.length === i + 1) {
            // if we have reached the end of the path, apply the callback to
            // the child node
            node[segment] = await callback(node[segment]);
          }
          nodes.unshift(node[segment]);
        }
      }
    }
    return nodes;
  }

}

module.exports = JSONPath;
