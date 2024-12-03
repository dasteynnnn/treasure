const express = require('express');
const path = require('path');

require('dotenv').config()

const credit = require('./routes/credit');
const roman = require('./routes/roman');
const budget = require('./routes/budget');

const app = express();

//middleware
app.use(express.json());

//routes
app.use('/api/credit', credit)
app.use('/api/roman', roman)
app.use('/api/budget', budget)

app.use(express.static('client/build'));
    app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('listening to port : ' + PORT)
})