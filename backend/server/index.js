const Hapi = require('hapi');
const Path = require('path');
const Routes = require('./routes')

const server = Hapi.server({
  port: 8100,
  host: 'localhost',
  routes: {
    files: {
        relativeTo: Path.join(__dirname, "/..")
    }
  }
});

const init = async () => {
  await server.register([require('inert')]);
  await server.start();

  server.route(Routes.home);
  server.route(Routes.createNote);  
  server.route(Routes.updateNote);  
  server.route(Routes.reload);  
};

module.exports = {
  init,
}