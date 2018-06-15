const JSONPath = require('../lib/JSONPath');

test('path can be converted to pointer', () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(0)
    .addPathSegment('c');
  let pointer = path.pathAsPointer();
  expect(pointer).toBe('/a/b/0/c');
});

test('path resolution returns the right value in a simple object', async () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(0)
    .addPathSegment('c');
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
  expect(result).toEqual({ d: 1 });
});

test('path resolution returns various values in an array', async () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(null)
    .addPathSegment('c');
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
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(null)
    .addPathSegment('c');
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
  expect(result).toEqual({ d: 1 });
});

test('path resolution handles nested arrays correctly', async () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(null)
    .addPathSegment('c')
    .addPathSegment(null);
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
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(null)
    .addPathSegment('c')
    .addPathSegment(null);
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

test('path resolution returns null if no values match', async () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('f')
    .addPathSegment('g');
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
  expect(result).toBe(null);
});

test('path resolution callback replaces values on the object', async () => {
  expect.assertions(2);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(null)
    .addPathSegment('c')
    .addPathSegment(null)
    .addPathSegment('e');
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
  let result = await path.resolve(object, result => {
    return result + 1;
  });
  expect(result).toEqual([4, 5]);
  expect(object).toEqual({
    a: {
      b: [
        {
          c: {
            d: 1
          }
        },
        {
          c: [{ e: 4 }, { e: 5 }]
        }
      ]
    }
  });
});

test('path resolution callback replaces values in arrays', async () => {
  expect.assertions(2);
  let path = new JSONPath().addPathSegment(null);
  let object = [1, 2, 3];
  let result = await path.resolve(object, result => {
    return result + 1;
  });
  expect(result).toEqual([2, 3, 4]);
  expect(object).toEqual([2, 3, 4]);
});

test('path copy utility returns an exact copy', () => {
  expect.assertions(1);
  let path = new JSONPath()
    .addPathSegment('a')
    .addPathSegment('b')
    .addPathSegment(0)
    .addPathSegment('c');
  let copy = JSONPath.copy(path);
  expect(copy).toEqual(path);
});
