import { AuthService } from '../services/authService.js';

export const authController = {
  login: (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      const result = AuthService.login(usernameOrEmail, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },

  register: (req, res) => {
    try {
      const result = AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
