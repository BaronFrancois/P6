const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    console.log(req.body)
    // console.log('TERMINAL LOG')
    // res.send({message: req.body})
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.send('Registration successful!');
    } catch (error) {
      res.status(500).send('An error occurred.');
    }
  
  
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      // req.session.userId = user._id; // Store user session
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid email or password.');
    }
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
};
