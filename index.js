const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const dotenv = require('dotenv')
// const bodyParser = require('body-parser');

dotenv.config();
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Middleware
app.use(express.json());
// app.use(bodyParser.json());
//Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

//Connect To DB
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser : true},
    () => console.log('Connected To DB')
)

app.listen(3000, () => console.log('Server Up and running'));

