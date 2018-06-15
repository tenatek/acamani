# Acamani

A minimal utility to describe & resolve paths within JSON objects.

This package provides a utility class, `JSONPath`, to describe & resolve paths within JSON objects. 

`JSONPath`s contain `pathAsArray`, an array of the names of the properties on an object, that constitute a path.

Additionally, the following methods are available on `JSONPath`s:

* to obtain a JSON pointer as defined in RFC 6901, call `jsonPath.pathAsPointer()`.
* to resolve the path within an object, call the asynchronous method `jsonPath.resolve(object[, callback])`. If an (asynchronous) `callback` is provided, it will receive the value matching the path and replace it, within the object, with its return value.

## Copyright & license

Copyright 2018 Ludovic Cyril Michel. Licensed under [MIT](https://github.com/tenatek/acamani/blob/master/LICENSE).