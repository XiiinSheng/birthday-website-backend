const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 9000;
const url = 'mongodb+srv://public:public@cluster0.psure.mongodb.net/birthdayWebsite?retryWrites=true&w=majority';
// const frontEndURL = 'https://jasmine-2021-birthday.herokuapp.com'; // for deploy
const frontEndURL = "*";    // for dev
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

