const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrasi User Baru
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru ke database
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: newUser._id, email: newUser.email }
        });
    } catch (err) {
        res.status(400).json({
            error: 'Registration failed',
            details: err.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }

    try {
        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        // Cek kecocokan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid credentials',
            });
        }

        // Buat token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token
        });
    } catch (err) {
        res.status(500).json({
            error: 'Login failed',
            details: err.message
        });
    }
};
