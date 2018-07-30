# Acamani

A minimal utility to describe & resolve paths within JSON objects.

[![npm version](https://img.shields.io/npm/v/acamani.svg)](https://www.npmjs.com/package/acamani)
[![npm downloads](https://img.shields.io/npm/dm/acamani.svg)](https://www.npmjs.com/package/acamani)
[![build status](https://travis-ci.org/tenatek/acamani.svg?branch=master)](https://travis-ci.org/tenatek/acamani)
[![coverage status](https://coveralls.io/repos/github/tenatek/acamani/badge.svg?branch=master)](https://coveralls.io/github/tenatek/acamani?branch=master)

This package provides a single class, `JSONPath`, which extends the JavaScript `Array` class.

A `JSONPath` is an array of the properties that you have to successively access, in order to resolve the path. 

To resolve the path within an object, call the asynchronous method `jsonPath.resolve(object[, callback])`. If an (asynchronous) `callback` is provided, it will receive the value matching the path and replace it, within the object, with its return value.

## Copyright & license

Copyright 2018 Ludovic Cyril Michel. Licensed under [MIT](https://github.com/tenatek/acamani/blob/master/LICENSE).