const JSONPath = require('../lib/JSONPath');

test('path can be converted to pointer', () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', 0, 'c');
  let pointer = path.getPointer();
  expect(pointer).toBe('/a/b/0/c');
});

test('path resolution returns the right value in an array', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', 0, 'c');
  let object = {
    a: {
      b: [
        {
          c: {
            d: 1
          }
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([{ d: 1 }]);
});

test('path resolution returns various values in an array', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', '*', 'c');
  let object = {
    a: {
      b: [
        {
          c: {
            d: 1
          }
        },
        {
          c: {
            e: 2
          }
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([{ d: 1 }, { e: 2 }]);
});

test('path resolution handles dead ends correctly', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', '*', 'c');
  let object = {
    a: {
      b: [
        {
          c: {
            d: 1
          }
        },
        {
          e: 3
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([{ d: 1 }]);
});

test('path resolution handles nested arrays correctly', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', '*', 'c', '*');
  let object = {
    a: {
      b: [
        {
          c: [
            {
              d: 1
            }
          ]
        },
        {
          c: [
            {
              e: 2
            },
            {
              f: 3
            }
          ]
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([{ d: 1 }, { e: 2 }, { f: 3 }]);
});

test('path resolution handles illegal paths correctly', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'b', '*', 'c', '*');
  let object = {
    a: {
      b: [
        {
          c: {
            d: 1
          }
        },
        {
          c: [
            {
              e: 2
            },
            {
              f: 3
            }
          ]
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([{ e: 2 }, { f: 3 }]);
});

test('path resolution returns an empty array if no values match', async () => {
  expect.assertions(1);
  let path = new JSONPath();
  path.push('a', 'f', 'g');
  let object = {
    a: {
      b: [
        {
          c: {
            d: 1
          }
        },
        {
          c: [{ e: 3 }, { e: 4 }]
        }
      ]
    }
  };
  let result = await path.resolve(object);
  expect(result).toEqual([]);
});

test('path resolution callback replaces values on the object', async () => {
  expect.assertions(2);
  let path = new JSONPath();
  path.push('a', 'b', '*', 'c', '*', 'e', 'f');
  let object = {
    a: {
      b: [
        {
          c: [{ e: {} }]
        },
        {
          c: [
            {
              e: { f: 4 }
            },
            {
              e: { f: 5 }
            }
          ]
        }
      ]
    }
  };
  let result = await path.resolve(object, () => {
    return 1;
  });
  expect(result).toEqual([1, 1]);
  expect(object).toEqual({
    a: {
      b: [
        {
          c: [{ e: {} }]
        },
        {
          c: [
            {
              e: { f: 1 }
            },
            {
              e: { f: 1 }
            }
          ]
        }
      ]
    }
  });
});

test('path resolution callback replaces values in arrays', async () => {
  expect.assertions(2);
  let path = new JSONPath();
  path.push('*');
  let object = [1, 2, 3];
  let result = await path.resolve(object, number => {
    return number + 1;
  });
  expect(result).toEqual([2, 3, 4]);
  expect(object).toEqual([2, 3, 4]);
});

test('path can be copied using slice', () => {
  expect.assertions(2);
  let path = new JSONPath();
  path.push('a', 'b', 0, 'c');
  let copy = path.slice();
  expect(copy).toEqual(path);
  expect(copy instanceof JSONPath).toBe(true);
});
