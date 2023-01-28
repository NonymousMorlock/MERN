// first install the passport-google-oauth

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    // get these from google console
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    // config this also in your google api project
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // This function is called when the user has successfully authenticated
    // u can use this function to find or create a user in your database
    // and pass the user object to the `cb` function
    cb(null, profile);
  }
));

// then use this in your auth route to store their info

// config
passport.serializeUser(function(user, cb) {
    // This will get called when Passport needs to store the user information
    // in the session, u can use this to save the user ID or other
    // info in the session.
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    // This one gets called when Passport needs to retrieve the user info
    // from the session. u can use this to find the user in your
    // database and pass the user object to the `cb` function.
    cb(null, user);
});

// Initialize Passport and add it to the Express app
app.use(passport.initialize());
app.use(passport.session());

// Create the route handlers for the auth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // This function is called when the user has successfully authenticated
    // You can redirect the user to the homepage or another protected page here
    res.redirect('/');
  });

// and listen
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
