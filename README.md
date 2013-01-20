helpermonkey
============

Writing boilerplate code sucks.  helpermonkey was built to make writing REST APIs (and the clients that contact them) a little easier.  [ This project is very alpha right now. ]

![image](http://25.media.tumblr.com/tumblr_kpwg1kT1ao1qzvqipo1_500.jpg)

## How does it work

You create your API by building a standardized JSON structure and passing that to helpermonkey, which generates a starting point for both REST API clients and servers in a variety of languages.

## Available Target Languages

I hope to expand this list to include all the biggies in both client and server.  Initially, this will be Java, C#, PHP, Python, Ruby, Javascript, command line (curl) and maybe C++.  Check back soon.

### Clients

+ PHP

### Servers

+ None

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