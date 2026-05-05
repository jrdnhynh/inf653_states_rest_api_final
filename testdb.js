require('dotenv').config();
const mongoose = require('mongoose');

console.log('trying to connect to:', process.env.DATABASE_URI);

mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('connected!');
        process.exit(0);
    })
    .catch(err => {
        console.log('failed:', err.message);
        process.exit(1);
    });