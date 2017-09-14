const { Container, Image } = require('@quilt/quilt');

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

/**
 * Creates a new Node object, which encapsulates a set of containers to run
 * a Node.js application.
 * @constructor
 *
 * @param {Object} cfg - An object containing configuration information for
 *   Node.js.
 * @param {number} cfg.nWorker - The number of Node.js workers to create.
 * @param {string} cfg.string - The Github repository to install on each
 *   Node.js container.
 * @param {number} [cfg.port=80] - The port.
 * @param {Object} [cfg.env] - Map of environment variable names to values
 *   that should be set on each Node.js container.
 */
function Node(cfg) {
  if (typeof cfg.nWorker !== 'number') {
    throw new Error('`nWorker` is required');
  }
  if (typeof cfg.repo !== 'string') {
    throw new Error('`repo` is required');
  }

  this._port = cfg.port || 80;

  const env = cfg.env || {};
  const name = imageName(cfg.repo);
  const image = new Image(name, `FROM quilt/nodejs
RUN git clone ${cfg.repo} . && npm install`);

  this.cluster = [];
  for (let i = 0; i < cfg.nWorker; i += 1) {
    this.cluster.push(new Container('node-app', image).withEnv(env));
  }
}

Node.prototype.deploy = function deploy(deployment) {
  deployment.deploy(this.cluster);
};

Node.prototype.port = function port() {
  return this._port;
};

module.exports = Node;
