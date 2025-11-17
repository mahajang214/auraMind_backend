require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Options are an object passed as the second argument to mongoose.connect for connection configs
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            connectTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000,  // 45 seconds
            // You may add other options here based on requirements
        });
        if (connection) {

            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

module.exports = connectDB;