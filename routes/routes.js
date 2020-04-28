module.exports = function (app) {
    
    const redirectLogin = (req, res, next) => {
        console.log("authentication");
        if(!req.session.userID) {
          res.redirect('/login');
        } else {
          next();
        }
    }
    
    app.get('/', function (req, res, next) {
        res.send("this is the main page");
    });

    app.use('/login', require('./auth/login'));
    app.use('/register', require('./auth/register'));
    app.use('/logout', require('./auth/logout'));
    app.use('/tables', require('./basic/table'));
    app.use('/blank', require('./basic/blank'));
    app.use('/try', require('./basic/try'));
    app.use('/home', require('./basic/home'));

    // handle error 404 - page not found
    app.use('*', redirectLogin, function(req, res, next) {
        console.log("404 handler");
        res.render('404.html');
    });

    // handle any server error
    app.use(function(err, req, res, next) {
        console.log("Error handler");
        console.error(err);
        res.status(500).send({ error: err.message });
      });
};