helpermonkey
============

Writing boilerplate code sucks.  helpermonkey let's you write a generic API specification in JSON and generate a REST server along with the clients to communicate with it in every language supported.

![image](http://25.media.tumblr.com/tumblr_kpwg1kT1ao1qzvqipo1_500.jpg)

## How does it work

You create a generic API Specification in JSON and helpermonkey will generate REST servers and clients in any language you choose.

## API Specification

Here's an example:

```
var apiSpec = {
	api_name: 'HelperMonkeyGeneratedApi', // other examples: GitHubApi, TwitterApi
	api_endpoint: 'http://localhost:8081',
	api_version: '1.0.0', // not implemented
	api_auth: { // Include if api requires authentication (delete api_auth if api is publicly open)
		basic: true, // Include support for Basic Authentication
		oauth: true // Include support for OAuth
		// To remove support, either set to false or delete entry
	},
	objects: [ // this is an array of objects your api manipulates
		{
			object: 'test', // other examples: posts, tweets, users
			description: 'This is a test',
			properties: [], // not implemented, will be for ORM-style management of objects.  may be removed
			methods: [ // array of methods that can be performed on object
				{ 
					rest: 'GET', // POST, GET, PUT, DELETE (CRUD)
					method: 'echo', // object name + method translates to relative URI: test/echo in this example (unless mask is specified, see next line)
					mask: 'test/echo/:repeat' // can be any valid URI string. :variable syntax replaced by url encoded parameters
					description: 'Echo test',
					parameters: [ // array of parameters accepted by this method
						{ 
							parameter: 'repeat', // test/echo?repeat=value 
							type: 'string', // helpermonkey datatype.  do helpermonkey.primitives to see which are supported.  these get converted into the target language
							required: true, // partially implemented
							default: 'null', // the default value to assign.  change to a literal null to disable (or remove) or 'null' to make the default value be null as it has been here.
							description: 'The data to send to the server' 
						}
					],
					returns: {
						description: 'Returns the data specified in repeat',
						type: 'string'
					},
					errors: [] // not implemented
				}
			]
		}
	]
};
```

## Server Response Protocol

HelperMonkey generated/compatible servers must respond in a specific format.

**Requirements**

+ Response body must be JSON
+ Body must be a JSON-encoded object
+ Must contain a "data" key
+ Data being sent to client stored in data key

### Example

```
{
	"whatever": 1,
	"can": "go",
	"here": { 
		"foo": 
		"bar" 
	},
	// must contain data key.  data stored here doesn't have to be object.  could be string, int, bool, null or anything JSON supportrs
	"data": { 
		"some": "data"
	}
}
```

## Example 

```
var fs = require('fs')
	, HelperMonkey = require('helpermonkey');

var helpermonkey = new HelperMonkey(apiSpec); // from the example above

// Creates skeleton PHP REST Client files
helpermonkey.build('client', 'php', function(suggestedFilename, code, type, name) {
	fs.writeFile(suggestedFilename, code, function(err) {
		if (err) throw err;
	});
});

// Creates a functioning PHP Guzzle [ http://guzzlephp.org/ ] REST Client 
helpermonkey.build('client', 'php', 'guzzle', function(suggestedFilename, code, type, name) {
	fs.writeFile(suggestedFilename, code, function(err) {
		if (err) throw err;
	});
});
```

The skeleton version requires customization before using, but the guzzle version can be used as-is to communicate with your compatible API:

```
require 'guzzle.phar';
require 'HelperMonkeyGeneratedApi.php';

$endpoint = 'http://localhost:8081';

$data = HelperMonkeyGeneratedApi::factory('test')
					->endpoint($endpoint)
					->setBasicAuth('dummy.user@example.com', 'abcd1234')
					->action_echo('Oh hai!'); // all API methods prefixed by "action_" due to a PHP limitation with reserved keywords
echo $data;
>Oh hai!
```

## Build

Many individual files will be generated.  This is what's created for the PHP client build:

+ `HelperMonkeyGeneratedApi.php` Entrypoint for making an API call
+ `HelperMonkeyGeneratedApi_BaseObject.php` Inherited by all objects.  You can edit this file to implement your custom REST client or whatever you wish.
+ `HelperMonkeyGeneratedApi_InternalTestObject.php` Do not edit.
+ `HelperMonkeyGeneratedApi_TestObject.php` Edit this one instead.

All languages will create files in a similar structure with a separation between the files that you can edit and the files that will be overwritten.  Care should be taken in your helpermonkey.build callback to make exclusions for the files that you don't want to overwrite.  

By maintaining this separation, you will be able to entirely regenerate the API and isolate your code from the generated code.  As mentioned above, be sure to not overwrite these manually changed files in your helpermonkey.build callback.

## Language Targets

I hope to expand this list to include all the biggies in both client and server.  Initially, this will be PHP, Javascript, C#, Python, Ruby, Java, command line (curl) and maybe C++ (in that order).  Check back soon.

### Clients

+ PHP

### Servers

+ None

## Language Processors

Calling helpermonkey.build pass the majority of the work on to a language processor.  The language processor does the job of prepping the API Specification for use with the templates (see below), localizing the helpermonkey datatypes and doing anything else that needs to be done to get the API Spec to work with a particular language.

In addition, the processor will also determine which files to generate.

## Code Generation Templates

Code is generated via mustache templates parsed compiled by hogan.js.  All templates are stored in lib/templates/clients | servers/[language]

There is no standard set of templates with the exception of base templates.  It is left up to each processor which templates to read and create.

### Base Templates

Base templates are designed to support existing REST clients in the respective language.  PHP currently supports a guzzle base template.  

By leveraging existing REST clients, helpermonkey can generate a client for your defined API in its entirety.

## Versioning

For transparency and insight into our release cycle, releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.

## Authors

**Cory Mawhorter**

+ https://github.com/cmawhorter


## MIT License

```
Copyright (C) 2013 Cory Mawhorter

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```