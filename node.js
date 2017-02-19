// Specs for Node.js web service
function Node(cfg) {
  if (typeof cfg.nWorker !== 'number') {
    throw new Error('`nWorker` is required');
  }
  if (typeof cfg.image !== 'string') {
    throw new Error('`image` is required');
  }

  this._port = cfg.port || 80;

  var env = cfg.env || {};
  var containers = new Container(cfg.image).withEnv(env).replicate(cfg.nWorker);
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
    this._app.connect(port, service);
  }.bind(this));
};

module.exports = Node;
