// require('dotenv');
require('dotenv').config();
const express = require('express');
const expressApp = express();
const port = 3000;

const jwt = require('jsonwebtoken');

// Middleware to parse JSON bodies
expressApp.use(express.json());

const posts = [
    {
        username: "Rodrigo",
        title: 'Post 1'
    },
    {
        username: 'Audrey',
        title: 'Post 2'
    }
]

expressApp.get('/posts', authenticateToken, (req, res) => {
    res.json(posts)
})

expressApp.post('/login', (req, res) => {
    //Authenticate user pending

    const username = req.body.username;

    //user obj to serialize
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    // res.json(accessToken)
    res.json({ accessToken: accessToken });
})

//authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

expressApp.listen(port);