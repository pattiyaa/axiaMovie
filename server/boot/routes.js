module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/movies', function(req, res) {
    response = 'movies';	
  });
  app.use(router);
}