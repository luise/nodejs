const { Container, Service, Image } = require('@quilt/quilt');

// imageName transforms `repo` into a Docker image name. The name is always
// `node-app`, and the tag is the final path in the repository name. For example.
// "https://github.com/tejasmanohar/node-todo.git" becomes "node-app:node-todo.git".
function imageName(repo) {
  let name = 'node-app';
  const repoIdx = repo.lastIndexOf('/');
  if (repoIdx !== -1) {
    name += `:${repo.slice(repoIdx + 1)}`;
  }
  return name;
}

function buildContainer(repo) {
  return new Container(new Image(imageName(repo),
    `FROM quilt/nodejs
RUN git clone ${repo} . && npm install`));
}

// Specs for Node.js web service
function Node(cfg) {
  if (typeof cfg.nWorker !== 'number') {
    throw new Error('`nWorker` is required');
  }
  if (typeof cfg.repo !== 'string') {
    throw new Error('`repo` is required');
  }

  this._port = cfg.port || 80;

  const env = cfg.env || {};
  const containers = buildContainer(cfg.repo).withEnv(env).replicate(cfg.nWorker);
  this._app = new Service('app', containers);
}

Node.prototype.deploy = function deploy(deployment) {
  deployment.deploy(this.services());
};

Node.prototype.services = function services() {
  return [this._app];
};

Node.prototype.port = function port() {
  return this._port;
};

Node.prototype.allowFrom = function allowFrom(from, port) {
  from.services().forEach((service) => {
    this._app.allowFrom(service, port);
  });
};

module.exports = Node;
