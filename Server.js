const express = require('express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const serviceRoutes = require('./routes/service-routes');
const app = express();



// set view engine
app.set('view engine', 'ejs');

app.use('/assets', express.static('public'));



app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true });

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/service', serviceRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('index', { user: req.user});
});




app.listen(8080, () => {
    console.log('app now listening for requests on port 8080');
});