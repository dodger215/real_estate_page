const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'ben.asante@bentalb.com';
        const password = 'BenAlb2026!';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log(`User found: ${user.email}`);
        console.log(`Stored hashed password: ${user.password}`);

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            console.log('SUCCESS: Password matches!');
        } else {
            console.log('FAILURE: Password does not match.');

            // Debugging: compare manually to be sure
            const manualCompare = await bcrypt.compare(password, user.password);
            console.log(`Manual bcrypt comparison: ${manualCompare}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

verifyLogin();
