const {Container, Service, Image} = require("@quilt/quilt");

// Specs for Node.js web service
function Node(cfg) {
  if (typeof cfg.nWorker !== 'number') {
    throw new Error('`nWorker` is required');
  }
  if (typeof cfg.repo !== 'string') {
    throw new Error('`repo` is required');
  }

  this._port = cfg.port || 80;

  var env = cfg.env || {};
  var containers = buildContainer(cfg.repo).withEnv(env).replicate(cfg.nWorker);
  this._app = new Service("app", containers);
};

Node.prototype.deploy = function(deployment) {
  deployment.deploy(this.services());
};

Node.prototype.services = function() {
  return [this._app];
};

Node.prototype.port = function() {
  return this._port;
};

Node.prototype.connect = function(port, to) {
  to.services().forEach(function(service) {
    service.allowFrom(this._app, port);
  }.bind(this));
};

function buildContainer(repo) {
    return new Container(new Image(imageName(repo),
        "FROM quilt/nodejs\n" +
        "RUN git clone " + repo + " . && npm install"
    ))
}

// imageName transforms `repo` into a Docker image name. The name is always
// `node-app`, and the tag is the final path in the repository name. For example.
// "https://github.com/tejasmanohar/node-todo.git" becomes "node-app:node-todo.git".
function imageName(repo) {
    var imageName = "node-app";
    var repoIdx = repo.lastIndexOf("/");
    if (repoIdx != -1) {
        imageName += ":" + repo.slice(repoIdx+1);
    }
    return imageName;
}

module.exports = Node;
