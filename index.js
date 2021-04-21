const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 9000;
const url = "USE YOUR OWN DATABASE URL HERE. OTHERWISE THE CODE WON'T WORK";       // Change this URL to your database! 
const frontEndURL = 'https://birthday-website-xin-sheng.herokuapp.com'; // for deploy
// const frontEndURL = "*";    // for dev
const postRouter = require('./routes/posts');

let allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', frontEndURL);
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

//connect to database
mongoose.connect(url, {useNewUrlParser: true});
const con = mongoose.connection;
con.on('open', ()=>{
    console.log('Database connected...');
})

//middleware
app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/posts', postRouter);

//listen on port
app.listen(PORT, ()=>{console.log(`App running on port ${PORT}`)});

