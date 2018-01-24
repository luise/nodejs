const kelda = require('kelda');
const Mongo = require('@kelda/mongo');
const Node = require('./node');

// The GitHub repository containing the code for the Node.js and MongoDB app to
// deploy. Change this to deploy a different application.
const nodeRepository = 'https://github.com/kelda/node-todo.git';

// The port the app will be listening on. This should match the port number
// passed to app.listen(), assuming `app` is an Express application.
const port = 80;
// The number of web servers and database instances.
const count = 1;

const mongo = new Mongo(count);
const app = new Node({
  nWorker: count,
  repo: nodeRepository,
  env: {
    PORT: port.toString(),
    MONGO_URI: mongo.uri('node-example'),
  },
});

mongo.allowTrafficFrom(app.containers, mongo.port);
kelda.allowTraffic(kelda.publicInternet, app.containers, port);

const infra = kelda.baseInfrastructure();

app.deploy(infra);
mongo.deploy(infra);
