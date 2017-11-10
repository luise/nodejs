# Node.js and MongoDB for Kelda

This repository contains a blueprint for deploying a Node.js and MongoDB
application to the cloud. Kelda's [Quick Start](http://docs.kelda.io/#quick-start)
guide explains how to use this blueprint to deploy Kelda's Node.js/MongoDB [sample application](https://github.com/kelda/node-todo).

## Deploying Your Own Node.js and MongoDB Application
This section explains how to deploy another app than the sample TODO app.

1. **Set the database URI**. In your Node.js application code, use the `MONGO_URI`
environment variable to connect to the MongoDB. Using mongoose that would be:

    ```javascript
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_URI);
    ```

    For an example, see how [config/database.js](https://github.com/kelda/node-todo/blob/master/config/database.js#L3)
    in the sample app sets to `localUrl` to be the `MONGO_URI`. The [server.js](https://github.com/kelda/node-todo/blob/master/server.js#L12)
    file then uses this URL to connect to MongoDB.

2. **Point the blueprint to your git repository**. The `nodeRepository` variable
in the [nodeExample.js](https://github.com/kelda/node-todo/blob/master/nodeExample.js)
blueprint specifies the git repository containing the Node.js/MongoDB application that
should be deployed. Change the variable to point to your git repository.

    ```javascript
    const nodeRepository = 'https://github.com/<githubUser>/<nodeMongoApp>.git';
    ```

3. **Deploy the Application**. Follow the [Quick Start](http://docs.kelda.io/#quick-start)
guide in the Kelda docs, but make sure to modify the `nodeExample` blueprint as
described above before executing `kelda run ./nodeExample.js`.

## More Info
Check out [our website](http://kelda.io) and [docs](http://docs.kelda.io) for
more information and tutorials.
