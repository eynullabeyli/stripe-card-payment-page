const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { publishableKey: process.env.STRIPE_PUBLISH_KEY });
});

app.post('/charge', async (req, res) => {
    try {
        let { token, amount } = req.body;
        let charge = await stripe.charges.create({
            amount: Math.round(parseFloat(amount) * 100), // convert amount in cents
            currency: 'usd',
            description: 'Example charge',
            source: token,
        });
        res.json({ message: 'Payment successful', charge });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});