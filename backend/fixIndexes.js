const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        try {
            // Drop the username index
            await User.collection.dropIndex('username_1');
            console.log('Successfully dropped username_1 index');
        } catch (error) {
            if (error.code === 27) {
                console.log('Index username_1 does not exist (already dropped)');
            } else {
                console.error('Error dropping index:', error.message);
            }
        }

        // List all indexes
        const indexes = await User.collection.indexes();
        console.log('\nCurrent indexes:');
        indexes.forEach(index => {
            console.log('-', JSON.stringify(index.key));
        });

        process.exit(0);
    })
    .catch(error => {
        console.error('Connection error:', error);
        process.exit(1);
    });
