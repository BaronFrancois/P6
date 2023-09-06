const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utilisation de dotenv pour les variables d'environnement
require('dotenv').config();
const SECRET_TOKEN = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
    try {
      const { email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email: email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created!' });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Incorrect password!' });
      }
  
      // Création du token lors de la connexion (login)
      const token = jwt.sign(
        { userId: user._id },
        SECRET_TOKEN,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({ userId: user._id, token: token });
    } catch (error) {
      res.status(500).json({ error });
    }
  };