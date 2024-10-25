const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/corliadb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    password: String,
    email: String,
    phone: String
});

const User = mongoose.model('User', userSchema);

// API Endpoint to get products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// API Endpoint to sign up
app.post('/api/signup', async (req, res) => {
    try {
        const { name, password, email, phone } = req.body;
        const userExists = await User.findOne({ name });
        if (userExists) {
            return res.status(400).send('User  already exists');
        }
        const user = new User({ name, password, email, phone });
        await user.save();
        res.send('User  created successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

// API Endpoint to login
app.post('/api/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).send('User  not found');
        }
        if (user.password !== password) {
            return res.status(401).send('Invalid password');
        }
        res.send('User  logged in successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Root route to serve the shop.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

// Listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
