# Hapi
### What is Hapi?
 - Hapi is is a JS framework that handles routing, and has a great plugin system that lets you make a modular application
 - It uses other frameworks and plugins like Joi, for validation, and Boom for error handling, and there are many more
- it has built in blackbox testing with server.inject
- Hapi core is so small and lightweight, since it uses other plugins that are only added when needed

--------------------------------------------------------------------------------------------------------------
# SECTION 1: THE BASICS
- [My github for this section](https://github.com/MostlyFocusedMike/hapi-notes-1)
- primary sources: 
    - [Future Studio's article](https://futurestud.io/tutorials/hapi-route-handling-and-drive-traffic-to-your-server)
    - [hapi docs](https://hapijs.com/api)




--------------------------------------------------------------------------------------------------------------
# Installation
- just use npm like any other project
- you no longer have to specify to get hapi v 17

```
yarn add hapi
// or 
npm install -S hapi 
```

## file structure
- until otherwise noted, this is the file structure:
    - hapi-practice-1
        - server.js




--------------------------------------------------------------------------------------------------------------
# Starting your server
### v17
- to run a server in Hapi, you need to initialize a new instance with       
  
```new Hapi.server()```

- server() takes an optional argument, a **server configuration object** which 
  sets things like the server's host and port

    - [server configuration object docs](https://hapijs.com/api#server.options)

- here is the code for just getting the server started, most simple servers only need host and port:

```
FILE: hapi-practice/server.js

const Hapi = require('hapi');

// create a server with a host and port
const server = new Hapi.Server({
  host: 'localhost',
  port: 3101
});

// define server start function
async function start () {
    try {
        await server.start(); // the builtin server.start method is async
    } catch (err) {
        console.error(err);
        process.exit(1);
    };

    console.log('Server running at: ', server.info.uri);
}

// start your server
start();
```

- to make sure that your server runs, do: 

```
npm start
```

- FYI don't forget to use [nodemon](https://www.npmjs.com/package/nodemon) for your server, your start command should look like this in your package.json file: 

```
  ...
  "scripts": {
    "start": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- all this does at this point is log the server uri to the console
- to get something to appear in the browser we need to set up some routes





------------------------------------------------------------------------------------------------------
# Basic routes
### v17 
- You have to add routes to your server using the **server.route([route config object])** method 
- This method takes an argument, the actual route object, which looks like this: 
    - [server.route() docs](https://hapijs.com/api#-serverrouteroute)

```
server.route({  
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'I am the home route'
  }
})
```
### here are the properties of the **route configuration object**, largely from the docs: 

- method (required)
    - the HTTP method, so 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', or 'OPTIONS' (use caps)
    - Any HTTP method is allowed, except for 'HEAD'. 
    - Use '*' to match against any HTTP method (only when an exact match was not found, and any match with a specific method will be given a higher priority over a wildcard match). 
    - Can be assigned an array of methods which has the same result as adding the same route with different methods manually.

- path (required)
    - the absolute path used to match incoming requests (must begin with '/').
    - Incoming requests are compared to the configured paths based on the server's router configuration. 
    - Use named parameters enclosed with {}, ie '/people/{id}' 

- handler (required if handler property is not set in options)
    - the route handler function called to generate the response after successful authentication and validation.

- options (optional) 
    - The options value is usually an object 
    - it can instead be a function that returns an object
        - the function's signature must be **function(server)**, 
        - where **server** is the server the route is being added to.
    - the options object is where you can define authentication, validations, tags, notes, descriptions, and even the handler
    - the handler goes in either **options** or the main *route config object**, not both

vhost (optional)
  - see docs for info





------------------------------------------------------------------------------------------------------------
# Add your routes to your server.js file
- add your routes before the server starts like so: 

```
const Hapi = require('hapi');

// create a server with a host and port
const server = new Hapi.Server({
    host: 'localhost',
    port: 3101
  });

server.route({  
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'I am the home route'
    },
});

server.route({  
    method: 'GET',
    path: '/example',
    handler: (request, h) => {
      return 'I am an example url'
    },
});

// define server start function
async function start () {
    try {
        await server.start(); // the builtin server.start method is async
    } catch (err) {
        console.error(err);
        process.exit(1);
    };

    console.log('Server running at: ', server.info.uri);
}

// start your server
start();
```

**Note**: while it is possible to pass an array of routes, like **server.route([routeConf1, routeConf2])**, it's not best practice, in the next section, we'll separate them out into their own files.





-----------------------------------------------------------------------------------------------------------
# SECTION 2: ROUTE HANDLING
- [My github for this section](https://github.com/MostlyFocusedMike/hapi-notes-2)
- primary sources: 
    - [Future Studio's main article](https://futurestud.io/tutorials/hapi-route-handling-and-drive-traffic-to-your-server)
    - [Route handler section from this Future Studio article](https://futurestud.io/tutorials/hapi-v17-upgrade-guide-your-move-to-async-await)
    - [Routing section in the hapi docs tutorial](https://hapijs.com/tutorials/routing)
    - [Route options](https://hapijs.com/api#route-options)
    - [Response Toolkit](https://hapijs.com/api#response-toolkits)
    - [Request object](https://hapijs.com/api#request)
    - [hapi docs](https://hapijs.com/api)





-----------------------------------------------------------------------------------------------------------
# Route handler methods 
- In the **route config object** you can pass either one or many HTTP methods to a route
- to pass several, just use an array. You will be fine as long as there are no HTTP verb collisions: 

```
server.route({  
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'It is I, the homepage'
    }
})

server.route({  
    method: [ 'POST', 'PUT' ],
    path: '/',
    handler: (request, h) => {
    // process the request’s payload …

    return 'Both POST and PUT will trigger this handler'
    }
})

```
- This isn't super common, but it's good to know about




-----------------------------------------------------------------------------------------------------------
# Path parameters
- Most modern applications will require dynamic routing, where one or more sections of a url will change
- Hapi uses {} to mark what sections of a path are the parameters, and you can access them from the handler's request object like so:

```
server.route({  
    method: 'GET',
    path: '/schools/{schoolName}/users/{username}',
    handler: (request, h) => {
        // these vars keep the line length short
        const user = request.params.username;
        const school = request.params.schoolName;

        return `${user} wishes ${school} wasn't so expensive.`;
    }
});
```

- so when we enter the url http://localhost:3101/schools/harvard/users/tom, our page outputs: 

```
tom wishes harvard wasn't so expensive.
```

- parameters must be valid JS variable names
    - schoolName works, school-name does not

## Optional parameters 
- sometimes, parameters are optional, if that is the case use a '?' at the end
- optional parameters must be the very last parameter 

```
server.route({
    method: 'GET',
    path: '/my-age/{age?}',
    handler: function (request, h) {

        const age = request.params.age ?
            encodeURIComponent(request.params.age) :
            'not telling you how old I am';

        return `I'm ${age}!`;
    }
});
```

## Partial and multiple parameters in a url segment 
- Sometimes only part of a parameter needs to be dynamic: 

```
server.route({
    method: 'GET',
    path: '/my-file/{fileName}.jpg',
    handler: function (request, h) {

        const file = encodeURIComponent(request.params.fileName)

        return `Loading up ${file}.jpg!`;
    }
});
```
- other times, you'll want more than one parameter in a segment
- the two parameters (or more) must have valid url charaters between them, you can't just do: 
    - /{param1} {param2}

```
server.route({
    method: 'GET',
    path: '/my-file/{fileName}.{ext}',
    handler: function (request, h) {

        const file = encodeURIComponent(request.params.fileName);
        const ext = encodeURIComponent(request.params.ext);
        return `Loading up ${file}.${ext}!`;
    }
});
```

## Multi-segment parameters 
- A single parameter can span multiple segments, you just have to say how many with '*'
- you just have to split the param with **split('/')**

```
server.route({
    method: 'GET',
    path: '/my-foods/{favFoods*2}',
    handler: function (request, h) {

        const foods = request.params.favFoods.split('/');
        const food1 = encodeURIComponent(foods[0]);
        const food2 = encodeURIComponent(foods[1]);
        return `${food1} and ${food2} are the best!`;
    }
});
```

- so when we visit http://localhost:3101/my-foods/pizza/ice-cream, we get: 

```
pizza and ice-cream are the best!
```
- here's a really crucial part about asterisks directly from the routing [docs](https://hapijs.com/tutorials/routing) in this section: 
    - The number after the asterisk represents how many path segments should be assigned to the parameter. You can also omit the number entirely, and the parameter will match any number of segments available. Like the optional parameters, a wildcard parameter (for example /{files*}) may only appear as the last parameter in your path.



------------------------------------------------------------------------------------------------------------
# Route handler
- the route handler is a function that can accept 2 parameters: the request object and the response toolkit
    - here's the signature:  **function (request, h)**
    - that 'h' is the response toolkit, which is an object that has several useful methods

## The Request Object 
- this contains all the info for request from the end user
- it has things like the payload, parameters, path, headers and much more 
- check out the [docs for the request](https://hapijs.com/api#request) for all its properties

## Response toolkit
- first off, it's called 'h' for Hapi, that's took me too long to figure out 
- Unlike Hapi 16, which needed a **reply()** callback to send anything back to the user, Hapi 17's handlers can send back simple data on their own 
- However, there are still cases where we need some extra methods, like for redirecting or rendering views
- for more info look at the [docs for the response toolkit](https://hapijs.com/api#response-toolkit)
- here are some common ones below, note that some of these methods require plugins, which we will cover in the next section: 

```
server.route({
    method: 'GET',
    path: '/response-toolkit',
    handler: function (request, h) {
        /* no need for h when returning a string */
        // return '<h1>html is just a string</h1>';

        /* no need for h when returning json */
        //return { hello: 'there' };

        /* redirects DO need to use h */
        // return h.redirect('/404');

        /* rendering views takes a plugin and h */
        // return h.view('index', { name: 'vision' });

        /* use h to create a custom response */
        return h
            .response('<h1>Hello hello</h1>')
            .type('text/html')
            .header('key-name', 'value')
            .code(201);
    }
});
```




------------------------------------------------------------------------------------------------------------
# Route options
- the route options object is where you configure things like auth, caches, and validation
- it's also where tags, notes, and documentation go. These are used for things like automated logging and documentation, and are quite helpful, so I recommend adding them.
- in hapi 16 this was called 'config', which is still backwards compatible in hapi 17, but you should really call it options moving forward 
- check the [docs for more on options](https://hapijs.com/api#route-options)

```
server.route({  
    method: 'GET',
    path: '/my-options',
    // handler: (request, h) => 'duplicate',
    options: {
        description: 'Just a page that shows all the options',
        notes: 'This page is really just for my notes',
        tags: ['api', 'tutorial'],
        // auth: auth strategies go here 
        // validation: validation checks go here
        handler: (request, h) => {
            return 'Check the code for all the options'
        }
    }
});
```




------------------------------------------------------------------------------------------------------------
# Basic file organization
- Route handlers can get rather large, so it is not advisable to define them in your server file 
- Let's talk about one way (there are MANY) to organize your files for a project 

## File configuration
**let's layout our project like so:**
- package.json
- README.md
- node_modules/
- server.js
- lib/ 
    - routes/ 
        - home.js
        - options.js
        - toolkit.js
        - ...etc.

- each of those routes files is just the **route configuration object** as the export: 

```
// FILE: home.js
 
module.exports = {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'It is I, the homepage'
    }
};
```

- to load them into our server, just place them into our **start()** function: 

```
// FILE: server.js 

async function start () {

    // load our routes 
    server.route(require('./lib/routes/home'));
    server.route(require('./lib/routes/options'));
    server.route(require('./lib/routes/toolkit'));
    // etc

    try {
        await server.start(); // the builtin server.start method is async
    } catch (err) {
        console.error(err);
        process.exit(1);
    };

    console.log('Server running at: ', server.info.uri);
}

```

- this is much better, now our handlers don't all get smushed into a single file, but all those requires aren't super dry
- This is where Hapi's [Haute Couture](https://github.com/hapipal/haute-couture) plugin comes in. We'll talk about it very briefly in the next mini section.
- Haute implements a system, much like rails, where if you configure your project in a certain way, Haute will do a lot of the grunt work for you. 
- In this case, if your routes are in **/lib/routes** and match that export shape I listed above, it will automatically load them all into you server for you, no requires() required. 




--------------------------------------------------------------------------------------------------------------
# MINI SECTION A: HAUTE COUTURE

## COMING SOON




--------------------------------------------------------------------------------------------------------------
# SECTION 3: USING PLUGINS
- [my github for this section](https://github.com/MostlyFocusedMike/hapi-notes-3)
- primary sources
    - https://hapijs.com/tutorials/plugins?lang=en_US
    - https://hapipal.com/best-practices/server-plugin-separation#the-joys-of-server--plugin-separation
    - https://hapijs.com/api#plugins



--------------------------------------------------------------------------------------------------------------
# Creating a plugin
- Hapi has a plugin system that allows devs to break their applications into smaller components that work together
- plugins can do all sorts of things, from generating documentation to creating routes
- kind of like a large site breaking down to micro services, a good application will be made up of many plugins, the main application itself might even be a plugin
- making a plugin is not hard, it basically is just an object with a **name, version,** and **register** property: 

```
const myPlugin = {
    name: 'myPlugin',
    version: '1.0.0',
    register: async function (server, options) {

        // Create a route for example
        server.route({
            method: 'GET',
            path: '/plugin-top',
            handler: function (request, h) {

                return '<h1>hello, world</h1>';
            }
        });
        // etc ...
        // await someAsyncMethods();
    }
};

// we define our plugin at the top level of exports
module.exports = myPlugin;
```

- instead of specifying a specific **name** and **version** you can also just use **pkg** property, which expects the package.json file: 

```
const myPlugin = {
    /* instead of name and version properties, you can just pull in the package */
    pkg: require('../../package.json'),
    ...
```

- plugins can either be at the top level of your export, or they can be in the **plugin** property of an export: 

```
module.exports = { register, name, version } 
// or if you want your module to export more than a Hapi plugin
exports.plugin = { register, name, version }.
```

- The plugin can also have three other *optional* properties: **multiple**, **once**, and **dependencies** 
- from the [docs on plugins](https://hapijs.com/api#plugins): 
    - multiple
        - if true, allows the plugin to be registered multiple times with the same server safely. Defaults to false.
    - dependencies
        - a string or an array of strings indicating a plugin dependency. Same as setting dependencies via server.dependency().
    - once 
        - if true, will only register the plugin once per server. If set, overrides the once option passed to server.register(). Defaults to no override.




--------------------------------------------------------------------------------------------------------------
# Register Method
- the **register()** method takes two arguments: **server** and **options**
    - we're talking about **plugin.register()**, not **server.register()**, we'll talk about the later in a second 
- **server** is just a reference to the server instance that your plugin will be loaded into
- **options** is more interesting. When registering a plugin on your server, you have the ability to pass in any data you want. Your plugin can access this info by going into the options object: 

- here is our plugin: 

```
// FILE: /lib/plugins/myPluginExternal.js 

const myPlugin = {
    pkg: require('../../package.json'),
    register: async function (server, options) {
        /* options comes from the options object passed into server.register() */
        server.route({
            method: 'GET',
            path: '/plugin-external',
            handler: function (request, h) {
                return { options }; 
            }
        });
        // etc ...
        // await someAsyncMethods();
    }
};

module.exports.plugin = myPlugin;

``` 

- now when we load in our plugin, we can pass things to it using the **options** property: 


```
// FILE: /server.js 
const start = async () => {

    await server.register({
         plugin: require('./lib/plugins/myPluginTop.js'),
         options: {
                msg: 'Anything here goes into the plugin',
                serverInfo: server.info
         }
    });

    await server.start();
}
```

- now when we visit http://localhost:3103/plugins/plugin-external, we'll get: 

```
{
  "options": {
    "msg": "Anything here goes into the plugin",
    "serverInfo": {
      "created": 1543605413313,
      "started": 1543605413322,
      "host": "localhost",
      "port": 3103,
      "protocol": "http",
      "id": "C02X31RCJHD4:41389:jp4et3nl",
      "uri": "http://localhost:3103",
      "address": "127.0.0.1"
    }
  }
}
```


- **NOTE:** that /plugins/ is a prefix, we explain it under the "Loading plugins" part about server.register() options in a second




--------------------------------------------------------------------------------------------------------------
# Loading plugins 
- As you can see, we load our plugins into our server with **server.register()**
    - [docs for **server.register()**](https://hapijs.com/api#-await-serverregisterplugins-options)
- **server.register()** accepts two things: your plugins, and a **registration options object** 
- lets look at all the ways to load plugins, then what that options object does

## Load a single external plugin
- you can load a plugin with a simple require statement: 

```
await server.register(require('./lib/plugins/myPluginTop.js'))
```


## Load a single plugin and its options
- if you want to give the plugin its options, you have to give server.register() an object with the keys **plugin** and **options**: 

```
await server.register({
   plugin: require('./lib/plugins/myPluginTop.js'),
   options: { msg: "I go to the plugin" } 
});
```

## Load multiple plugins 
- **server.register()** can also take an array of plugins, using either the require() or object format: 

```
await server.register([
    require('./lib/plugins/myPluginTop.js'),
    {
        plugin: require('./lib/plugins/myPluginExternal.js'),
        options: {
            msg: 'Anything here goes into the plugin',
        }
     }
]);
```

## Server.register's options object 
- Just like you can give each individual plugin an options object, you can give Hapi an options object
    - [docs for service.register, go to the options section](https://hapijs.com/api#-await-serverregisterplugins-options)
- the server.register's **registration options object** does *not* go to any of the plugins, Hapi is the one that uses it
- an easy example is the **routes.prefix** property
- by giving a prefix, all the routes in the registered plugins will be prefixed, but your server routes won't: 

```
// FILE: server.js 
const start = async () => {
    await server.register([
        require('./lib/plugins/myPluginTop.js'),
        {
            plugin: require('./lib/plugins/myPluginExternal.js'),
            options: {
                msg: 'Anything here goes into the plugin',
                serverInfo: server.info
            }
        }
    ],
    { /* this is the options object */
        routes: {
            prefix: '/plugins' 
        }
    });

    /* load routes regular routes */
    server.route(require('./lib/routes/home'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}


// FILE: /lib/routes/home.js
module.exports = {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
        return '<h1>I am the home page</h1>';
    }
};
```
- so thanks to the prefix, any plugin routes will now have to be prefixed with /plugins, but our home route does not. 
    - FYI, any prefix string must start with '/'
- the other property on the options.routes object is **vhost**, which sets each plugin's virtual host. 



---------------------------------------------------------------------------------------------------------------------
# SECTION 4: SERVING STATIC FILES
- [my github for this section](https://github.com/MostlyFocusedMike/hapi-notes-4)
- primary sources
    - https://hapijs.com/tutorials/serving-files?lang=en_US
    - https://futurestud.io/tutorials/hapi-how-to-serve-static-files-images-js-etc
    - https://github.com/hapijs/inert


---------------------------------------------------------------------------------------------------------------------
# Setting up the Inert plugin 
 - to serve static files and assets like HTML, JS, CSS, JPG files, hapi relies on the [inert](https://github.com/hapijs/inert) plugin
- Inert serves files individually per path, or it can register a directory structure
- Load using Yarn or NPM:  

```
npm install inert 
# or 
yarn add inert 
```
- it is updated and ready for use with hapi 17, for hapi 16 use inert 4.X.X
- once it is installed, simply register it as a plugin: 

```
FILE: server.js 


const Hapi = require('hapi')

const server = new Hapi.server({
    host: 'localhost',
    port: '3104',
});

const start = async () => {

    await server.register([
        /* RIGHT HERE */
        require('inert')
    ]);

    /* load routes */
    server.route(require('./lib/routes/home'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();
```



---------------------------------------------------------------------------------------------------------------------
# Serving a single static file 
### File Structure 
- lib 
    - public 
        - images 
            -  all our images
        - style.css
        - index.html
        - used-picture.html
        - app.js 
- server.js 

# serving a single file 
- the way inert works is that you will have routes that instead of just giving a response, will serve as a static file: 
- when you register Inert, it decorates the 'h' response toolkit with the .file() method, which takes the path to file you would like to serve
- lets show this by serving a single image: 

```
FILE: server.js 

...
    server.route({
        method: 'GET',
        path: '/picture',
        handler: function (request, h) {

            return h.file('lib/public/images/hapi-logo.png');
        }
    });
...
```
- so now when we go to http://localhost:3104/picture we will just see the Hapi logo image, even though the image file is stored in lib/public/images 
- If we want to access this file from within our site pages, you would go to the route path, not the actual file's path
- let's look at how a simple html page would use that image asset:  

```
FILE: lib/public/used-picture.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>I'm using the static asset of the photo!</h1>
    <!-- the source is just hitting the picture route -->
    <img src="/picture" alt="hapi Logo" style="height: 100px;" />
</body>
</html>
```
- it loads the file from '/picture', even though the file's actual location is /lib/public/images
- **when loading an asset use the route path, not the file's path**
- and now lets actually serve up this html page itself with a new route: 

```
FILE: server.js
...
    server.route({
        method: 'GET',
        path: '/picture',
        handler: function (request, h) {

            return h.file('lib/public/images/hapi-logo.png');
        }
    });

    server.route({
        method: 'GET',
        path: '/example-page',
        handler: function (request, h) {

            return h.file('lib/public/used-picture.html');
        }
    });
...

```

- if you go to http://localhost:3104/example-page, you will see the image inside the html document.

## file handler
- instead of using the response toolkit, you could also use the file handler:

```
FILE: server.js

...
    server.route({
        method: 'GET',
        path: '/picture',
        handler: {
            file: 'lib/public/images/hapi-logo.png'
        }
    });
...



FILE: copy from docs 
/* use a function instead of an object to get access 
   to the response object for things like parameters */
server.route({
    method: 'GET',
    path: '/files/{filename}',
    handler: {
        file: function (request) {
            return request.params.filename;
        }
    }
});
```

- check the docs [tutorial](https://hapijs.com/tutorials/serving-files?lang=en_US) for more on file handler
- check Inert's docs for info about the [options argument](https://github.com/hapijs/inert#hfilepath-options) as well

---------------------------------------------------------------------------------------------------------------------
# Using relative file paths
- putting 'lib/public/' in front of everything can get annoying, so you can tell files that there is a default relative path to start at
- in the server config object, just include the **routes** object (don't forget to add Node's path package): 

```
FILE: server.js 

const Hapi = require('hapi');
const Path = require ('path');

const server = new Hapi.server({
    host: 'localhost',
    port: '3104',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'lib/public')
        }
    }
});
...
```
- this makes it so that any paths for static files do not need to start with 'lib/public', which is nice 



---------------------------------------------------------------------------------------------------------------------
# Directory handler 
- Assigning every asset their own route isn't necessary, you can also turn a folder into a static asset directory for your project
- do this with the **directory handler**: 

```
FILE: server.js
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                /* if we weren't using a relative path */
                // path: 'lib/public',
                /* if you weren't using a standard index.html
                // index: 'default.html',
                /* if you wanted to see all your files instead of an index file */
                // listing: true,
                /* listing will now show hidden files */
                // showHidden: true,
                 /* param 'example' will also try example.html */
                // defaultExtension: 'html',
            }
        }
    });

```
- what this does is it looks for the param, like say 'style.css' and checks if that file is found in the given directory. If no file is found to match, it will then look for it on the other routes 
    - this is why '/example-page' doesn't throw and error when there is no file in our public directory called 'example-page', it doesn't find a file so it just moves on
    - what's interesting though is that /images/hapi-logo.png will also work thanks to the wildcard in the param (see the Multi-segment parameters section)

- lets look at the three most common properties: 
    - **path**: this is the path to the directory that we will use to store our assets, and it takes a string.
         - However, if you set the **routes.files.relativeTo** in the server object (as I have in these examples), then it assumes that is the starting directory, so it is perfectly fine to give a path of '.' as we have here
    - **index**: let's say the user just goes to http://localhost:3104, there will be no params given, so the directory will be default search for an index.html file. However, if you named your index something else, you can specify that here 
        - it takes either a string, or an array of strings to search in order: 
``` 
 index: ['default.hmlt', 'weird.html']
```
    - **listing**: if you don't want to use an index, and instead want a clickable directory of hyperlinks deplayed for http://localhost:3104, then be sure that you don't have an index.html file and you switch listing to true (default is false).
         - this can be useful when working on API's that don't actually have a home route
    - **showHidden**: if set to true, listing will show hidden dotfiles, the default is false 
    - **defaultExtension**: a string that will be used as a default file extentsion if the path isn't found. So a request for /thing will try the file /thing.html.
    - **lookupCompressed**: allows you to serve precompressed files when possible. 
   - **redirectToSlash**: requests without trailing slashes are treated as if they are, this is called “with slash pendant” BTW. You might need this for relative paths, so it's good to leave it on (it defaults to false)
--------------------------------------------------------------------------------------------------------------------
## Using assets from the directory
- so now that we saw what everything was set up to do, our static assets will now all work in our pages:

```
FILE: lib/public/index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/style.css">
    <script src="/app.js"></script>
    <title>Hapi Notes</title>
</head>
<body>
    <h1>I am the section 4 home page</h1>
    <h2>I am light blue thanks to the static css asset</h2>

    <p>Here is a picture loaded from our static directory: </p>
    <img src="/images/hapi-logo.png" alt="hapi Logo" style="height: 100px;" />

</body>
</html>
```
- look at the css, js, and image files all loading perfectly when you go to http://localhost:3104/, that directory does all the work of all the routes, and it is the preferred method of serving static assets in Hapi



---------------------------------------------------------------------------------------------------------------------
# SECTION 5: VIEWS







