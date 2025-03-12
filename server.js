const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Store reviews in a JSON file
const REVIEWS_FILE = 'reviews.json';

// 🔹 Get Reviews
app.get('/reviews/:productId', (req, res) => {
    fs.readFile(REVIEWS_FILE, (err, data) => {
        if (err) return res.json([]);
        const reviews = JSON.parse(data);
        res.json(reviews[req.params.productId] || []);
    });
});

// 🔹 Submit Review
app.post('/submit-review', (req, res) => {
    const { productId, username, rating, comment } = req.body;
    const newReview = { username, rating, comment };

    fs.readFile(REVIEWS_FILE, (err, data) => {
        let reviews = {};
        if (!err) reviews = JSON.parse(data);
        if (!reviews[productId]) reviews[productId] = [];
        reviews[productId].push(newReview);

        fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews), () => {
            res.json({ message: '✅ Review submitted!' });
        });
    });
});

// 🔹 Show All Reviews Page
app.get('/all-reviews', (req, res) => {
    fs.readFile(REVIEWS_FILE, (err, data) => {
        if (err) return res.status(500).send("Error loading reviews.");

        const reviews = JSON.parse(data);
        res.render('all-reviews', { reviews: reviews.product || [] }); // Send reviews to the all-reviews page
    });
});

// 🔹 Handle 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
