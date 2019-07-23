# stubz-server
 Stub your API dependencies for fast, robust and comprehensive development and testing.

[![Greenkeeper badge](https://badges.greenkeeper.io/hisco/stubz.svg)](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
 
# Stubz productivity
`stubz` enables you to stay productive when an API you depend on doesn't exist or isn't complete which enables your team to work in parallel to other teams.

`stubz` supports testing of edge cases and failure modes, to produce these edge cases in real API consume a lot of time or might not be possible.

`stubz` is simple to use, it’s very much similar to code using `express` it just adds another layer of variations and defaults of your tests in addition to some shortcuts that are relevant only when you stub.

# Stubz WIP
It's still at the very first stages, help is welcomed.

# Stubs examples
For full working example you can take a look at:
- Live SAS stubs server [Stubs server](https://glitch.com/edit/#!/stubs-server)
- Live SAS stubs server [Stubs/stubz gist](https://gist.github.com/hisco/6046a9b907d4f17a26782ab7932449c2)
- More to come...

# API
Create your server
```js
const {StubzExpress} = require('stubz');
const stubzServer = new StubzExpress({
    ports : [3001], // Stubz can listen to more than one port
    //adminPort: 3002 //If you want to control stubz via api
    fsControl:{} // To control stubz via file (Default: `./stubz.json`)
});
```

Create a simple router
```js
const {StubzExpressRouter} = require('stubz');
const dogNamesRouter = new StubzExpressRouter({
  /*
  You will need to provide a uniq name for that router,
  In the near future you will be able to control the router,
  And this will be the ID of the router control
  */
  name:'dogs',
  //The router path prefix
  route:'/names'
});
```

Add routes to it, very similar to express router / app
```js
//Stubz shortcuts
dogNamesRouter.get('/' ,{
    statusCode : 200,
    json : ['Charlie' , 'Max']
})
.setOption('twoDogs')
.defaultOn();

//Express route
dogNamesRouter.post('/' ,(res,res)=>{
  res.status(201);
  res.send('');
})
.defaultOn();
```
# Control via config stubz file
* It's highly recommended to add your stubz config file to git ingore (Default: `./stubz.json`.

Enable a specific stubs
```json
{
    "variations":{
        "twoDogs": true, 
      }
}
```
Disable a specific route
```json
{
    "variations":{
        "twoDogs": false, 
      }
}
```

# Soon HTTP and UI control
WIP...
## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/stubz.svg
[npm-url]: https://npmjs.org/package/fstubz
[travis-image]: https://img.shields.io/travis/hisco/stubz/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hisco/stubz
[coveralls-image]: https://coveralls.io/repos/github/hisco/stubz/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/hisco/stubz?branch=master
