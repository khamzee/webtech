const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const User = require('./userModel'); 
const travelRoutes = require('./travelRoutes');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/WebTech');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({ secret: 'Khamze', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// Configure Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve()));


app.post('/register', async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and Confirm Password do not match' });
  }

  try {

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        console.error('Error during login after registration:', err);
        return res.status(500).json({ message: 'Internal server error during user login after registration' });
      }
      console.log('Sigh Up successfuly');
      return res.redirect('/travelAgency.html');
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during user registration' });
  }
});


app.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('Entered:', username, password);

  passport.authenticate('local', (err, user, info) => {
    console.log('Passport Authentication:', err, user, info);

    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      console.log('Login failed: Invalid username or password');
      return res.status(401).send('Invalid username or password');
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return next(loginErr);
      }
      console.log('Login successful');
      return res.redirect('/travelagency.html');
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.user = null; 
  res.redirect('/');
});



app.use('/travelagency', travelRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
