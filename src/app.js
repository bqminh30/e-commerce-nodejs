const express = require('express');
const morgan = require('morgan');
const app = express();


//init middleware 
app.use(morgan("dev")) 
// morgan("compile")
// morgan("common")
// morgan("short")
// morgan("tiny")

// init db


// init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome Fantipsjs'
    })
})

// handling errors


module.exports = app;