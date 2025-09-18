# JWT_Auth

JWT authentication using Nodejs and Express.

This application creates tokens on the server side, sends tokens to users and authenticate tokens back on the server side.
Additionally, it makes use of refresh tokens to increase security and allows revocation of user privileges.

## Architecture Overview

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant JWT_Middleware
    participant Protected_Resource

    Note over Client,Protected_Resource: JWT Authentication Flow

    %% Login Flow
    Client->>Server: POST /login<br/>{username: "user"}
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

- **POST `/login`** - Authenticate user and receive JWT token
- **GET `/posts`** - Access protected resource (requires valid JWT token)

## Authentication Flow

1. **Login**: Client sends credentials to `/login` endpoint
2. **Token Generation**: Server creates JWT token with user information
3. **Token Storage**: Client stores the received JWT token
4. **Protected Requests**: Client includes token in `Authorization: Bearer <token>` header
5. **Token Validation**: Server middleware validates token before granting access
6. **Access Control**: Valid tokens grant access, invalid/missing tokens are rejected
