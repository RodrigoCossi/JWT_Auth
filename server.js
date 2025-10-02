// require('dotenv');
require('dotenv').config();
const express = require('express');
const expressApp = express();
const port = 3000;

// Middleware for parsing JSON bodies
expressApp.use(express.json());

// Serve static files from public directory
expressApp.use(express.static('public'));

const jwt = require('jsonwebtoken');

// Middleware to parse JSON bodies
expressApp.use(express.json());

const posts = [
    {
        username: "Rodrigo",
        title: 'Post 1',
        content: 'This is the first post by Rodrigo'
    },
    {
        username: 'Audrey',
        title: 'Post 2',
        content: 'This is the second post by Audrey'
    }
]

// Get all posts (protected route)
expressApp.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

// Get all posts (protected route)
expressApp.get('/posts/all', authenticateToken, (req, res) => {
    res.json({
        message: 'All posts (requires authentication)',
        posts: posts
    });
})

// Create a new post (public route)
expressApp.post('/posts', (req, res) => {
    const { title, content, username } = req.body;
    
    if (!title || !content || !username) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'Title, content, and username are required'
        });
    }
    
    const newPost = {
        username,
        title,
        content,
        timestamp: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
        message: 'Post created successfully',
        post: newPost
    });
})

// Health check endpoint
expressApp.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
})

// API info endpoint
expressApp.get('/api', (req, res) => {
    res.json({
        message: 'JWT Authentication API',
        version: '1.0.0',
        endpoints: {
            'POST /sign': 'Sign in to get JWT token',
            'GET /posts': 'Get user posts (requires authentication)',
            'GET /posts/all': 'Get all posts (requires authentication)',
            'POST /posts': 'Create new post (public - no auth required)',
            'GET /health': 'Health check',
            'GET /api': 'API information'
        },
        authentication: 'Bearer Token in Authorization header',
        documentation: 'See README.md for detailed usage'
    });
})

// Root endpoint - serve HTML interface or JSON based on Accept header
expressApp.get('/', (req, res) => {
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    
    if (acceptsJson) {
        res.json({
            message: 'JWT Authentication API',
            version: '1.0.0',
            endpoints: {
                'POST /sign': 'Sign in to get JWT token',
                'GET /posts': 'Get user posts (requires authentication)',
                'GET /posts/all': 'Get all posts (requires authentication)',
                'POST /posts': 'Create new post (public - no auth required)',
                'GET /health': 'Health check',
                'GET /api': 'API information'
            },
            authentication: 'Bearer Token in Authorization header',
            documentation: 'See README.md for detailed usage',
            webInterface: 'Visit http://localhost:3000 in your browser for interactive testing'
        });
    } else {
        // Serve the HTML file
        res.sendFile('index.html', { root: './public' });
    }
})

// Sign endpoint to get JWT token
expressApp.post('/sign', (req, res) => {
    // Basic validation
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ 
            error: 'Username is required',
            message: 'Please provide a username in the request body'
        });
    }

    // User object to serialize in token
    const user = { name: username };

    // Generate access token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    
    res.json({ 
        accessToken: accessToken,
        message: `Successfully signed in as ${username}`,
        user: user
    });
})

//authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (token == null) {
        return res.status(401).json({
            error: 'Access token required',
            message: 'Please provide a valid Bearer token in the Authorization header'
        });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid token',
                message: 'The provided token is invalid or expired'
            });
        }
        req.user = user;
        next();
    })
}

expressApp.listen(port, () => {
    console.log('🚀 JWT Authentication Server Started!');
    console.log(`📡 Server running on http://localhost:${port}`);
    console.log('🌐 Web Interface: http://localhost:3000');
    console.log('📚 Available endpoints:');
    console.log('   GET  /              - Web interface or API info (based on Accept header)');
    console.log('   GET  /api           - API information (JSON)');
    console.log('   POST /sign         - Get JWT token');
    console.log('   GET  /posts         - Get user posts (protected)');
    console.log('   GET  /posts/all     - Get all posts (protected)');
    console.log('   POST /posts         - Create new post (public)');
    console.log('   GET  /health        - Health check');
    console.log('🔑 Don\'t forget to set your environment variables!');
    console.log('📖 See README.md for detailed usage instructions');
    console.log('');
});