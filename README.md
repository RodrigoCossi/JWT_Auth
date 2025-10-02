# JWT Authentication API

A modern JWT authentication system built with Node.js and Express.js that provides secure token-based authentication with interactive API endpoints.

<!-- ![Interactive Web Interface](https://github.com/user-attachments/assets/46b6a681-16cd-4047-84c5-0642bfecc4f9) -->
<img alt="screencapture-localhost-3000-2025-10-02-20_01_15" src="https://github.com/user-attachments/assets/a4146d9d-f304-4ab5-823b-a62d7fbc4d62" />


## Architecture Overview

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant JWT_Middleware
    participant Protected_Resource

    Note over Client,Protected_Resource: JWT Authentication Flow

    %% Sign in Flow
    Client->>Server: POST /sign<br/>{username: "user"}
    Server->>Server: Generate JWT Token<br/>jwt.sign(user, secret)
    Server-->>Client: {accessToken: "jwt_token"}

    %% Accessing Protected Resource
    Client->>Protected_Resource: GET /posts<br/>Authorization: Bearer jwt_token
    Protected_Resource->>JWT_Middleware: authenticateToken()
    JWT_Middleware->>JWT_Middleware: Extract token from<br/>Authorization header
    
    alt Valid Token
        JWT_Middleware->>JWT_Middleware: jwt.verify(token, secret)
        JWT_Middleware->>Protected_Resource: Token valid, proceed
        Protected_Resource-->>Client: 200 - Posts data
    else Invalid Token
        JWT_Middleware-->>Client: 403 - Forbidden
    else No Token
        JWT_Middleware-->>Client: 401 - Unauthorized
    end
```

## API Endpoints

- **POST `/sign`** - Authenticate user and receive JWT token
- **GET `/posts`** - Get user-specific posts (requires authentication)
- **GET `/posts/all`** - Get all posts (requires authentication)
- **POST `/posts`** - Create new post (public, no authentication required)

## Authentication Flow

1. **Sign In**: Client sends credentials to `/sign` endpoint
2. **Token Generation**: Server creates JWT token with user information
3. **Token Storage**: Client stores the received JWT token
4. **Protected Requests**: Client includes token in `Authorization: Bearer <token>` header for viewing posts
5. **Token Validation**: Server middleware validates token before granting access to protected routes
6. **Public Actions**: Post creation is public and only requires username in request body
6. **Access Control**: Valid tokens grant access, invalid/missing tokens are rejected

## 🚀 Features

- **JWT Token Generation**: Secure JSON Web Token creation for user authentication
- **Protected Routes**: Middleware-based route protection using Bearer tokens
- **User-specific Content**: Filter content based on authenticated user
- **Interactive API**: Multiple endpoints for comprehensive testing
- **Error Handling**: Detailed error messages and proper HTTP status codes
- **Real-time Feedback**: Informative server logs and API responses

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Environment Setup](#environment-setup)
- [Usage Examples](#usage-examples)
- [Testing with cURL](#testing-with-curl)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RodrigoCossi/JWT_Auth.git
   cd JWT_Auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   ACCESS_TOKEN_SECRET=your_super_secret_key_here
   ```
   
   Or use the provided sample keys (for development only):
   ```bash
   cp .env.example .env  # if you have a sample
   ```

4. **Start the server**
   ```bash
   npm run devStart
   # or
   node server.js
   ```

5. **Verify installation**
   
   Open your browser or use curl:
   ```bash
   curl http://localhost:3000
   ```

## 🛠 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information and available endpoints |
| `GET` | `/health` | Health check and server status |
| `POST` | `/sign` | Sign in and receive JWT token |
| `POST` | `/posts` | Create a new post (requires username) |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts` | Get posts for authenticated user |
| `GET` | `/posts/all` | Get all posts |

## 🔐 Authentication Flow

### 1. Sign In to Get Token
```bash
POST /sign
Content-Type: application/json

{
  "username": "your_username"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Successfully generated token for your_username",
  "user": {
    "name": "your_username"
  }
}
```

### 2. Use Token in Requests
Include the token in the Authorization header:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🌍 Environment Setup

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# JWT Secret Key (KEEP THIS SECURE!)
ACCESS_TOKEN_SECRET=your_very_long_random_string_here

# Optional: Port configuration
PORT=3000
```

### Generating Secure Keys

For production, generate cryptographically secure keys:

```bash
# Using Node.js crypto
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## 📖 Usage Examples

### Complete Workflow Example

1. **Start the server and check status:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Sign in to get a token:**
   ```bash
   curl -X POST http://localhost:3000/sign \
     -H "Content-Type: application/json" \
     -d '{"username": "Rodrigo"}'
   ```

3. **Create a post (no authentication required):**
   ```bash
   curl -X POST http://localhost:3000/posts \
     -H "Content-Type: application/json" \
     -d '{"title": "My Post", "content": "Great content!", "username": "Rodrigo"}'
   ```

4. **Get posts (requires authentication):**
   ```bash
   # Store token in variable
   TOKEN=$(curl -s -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"username": "Rodrigo"}' | jq -r '.accessToken')
   
   # Get user's posts
   curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts
   
   # Get all posts
   curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts/all
   ```

## 🧪 Testing with cURL

### Test Authentication Flow
```bash
# 1. Get API information
curl http://localhost:3000/

# 2. Login as different users
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Rodrigo"}'

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Audrey"}'

# 3. Test protected routes
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts

# 4. Test error handling
curl -H "Authorization: Bearer invalid_token" http://localhost:3000/posts
curl http://localhost:3000/posts  # No token
```

### Test Post Creation
```bash
# Create a post without authentication (public endpoint)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Public Post", 
    "content": "Anyone can create this!",
    "username": "TestUser"
  }'

# Get posts (requires authentication)
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "TestUser"}' | jq -r '.accessToken')

curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts/all
```

## 🔒 Security Features

- **JWT Token-based Authentication**: Stateless authentication using JSON Web Tokens
- **Bearer Token Authorization**: Industry-standard authorization header format
- **Route Protection**: Middleware-based protection for sensitive endpoints
- **Input Validation**: Server-side validation for required fields
- **Error Handling**: Secure error messages that don't leak sensitive information
- **Environment Variables**: Sensitive configuration stored in environment variables

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 3000 is already in use: `lsof -i :3000`
- Verify Node.js version: `node --version`
- Check for missing dependencies: `npm install`

**Authentication errors:**
- Verify `.env` file exists and contains `ACCESS_TOKEN_SECRET`
- Check token format: `Authorization: Bearer <token>`
- Ensure token hasn't expired (tokens don't expire in this demo)

**Cannot POST /login:**
- Make sure you're using POST method, not GET
- Include `Content-Type: application/json` header
- Verify request body contains valid JSON

**403 Forbidden errors:**
- Check if token is valid and not corrupted
- Verify the token was generated with the same secret
- Ensure proper Bearer token format

### Debug Mode

Run the server with additional logging:
```bash
DEBUG=* node server.js
```

### Validate Environment Setup
```bash
# Check if environment variables are loaded
node -e "require('dotenv').config(); console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'Set' : 'Missing');"
```

## 📝 API Response Examples

### Successful Sign In Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9kcmlnbyIsImlhdCI6MTcwMDAwMDAwMH0.signature",
  "message": "Successfully generated token for Rodrigo",
  "user": {
    "name": "Rodrigo"
  }
}
```

### Error Response Examples
```json
// Missing username
{
  "error": "Username is required",
  "message": "Please provide a username in the request body"
}

// Invalid token
{
  "error": "Invalid token", 
  "message": "The provided token is invalid or expired"
}

// Missing token
{
  "error": "Access token required",
  "message": "Please provide a valid Bearer token in the Authorization header"
}
```

## 🚀 Development Commands

```bash
# Start development server with auto-reload
npm run devStart

# Start production server
npm start

# Run in production mode
NODE_ENV=production node server.js
```

## 📋 Next Steps & Extensions

- Add refresh token functionality
- Implement user registration endpoint
- Add password hashing with bcrypt
- Add rate limiting
- Implement token expiration
- Add user roles and permissions
- Create API documentation with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by RodrigoCossi**

For more information or questions, please open an issue in the repository.
