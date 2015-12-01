# notation-to-obj

[![Build Status](https://travis-ci.org/windperson/notation-to-obj.svg?branch=master)](https://travis-ci.org/windperson/notation-to-obj) 
[![npm version](https://badge.fury.io/js/notation-to-obj.svg)](https://badge.fury.io/js/notation-to-obj)

Js utility function to get javascript object from a string notation,
useful in fetching objects  such as `process.stdout` that being notated as pure string in config files.

Utililty Function
---
```TypeScript
GetObjectFromName(name: string, modulePath?: string): any
```
* `name` is the string notation of the object, such as `process.stdout`, `bunyan.stdSerializers.err`.
* Optional parameter `modulePath` is for specify the loading module path that the same as `require()` of CommonJS, if `modulePath` is not given, it will search **global** object's properties.
