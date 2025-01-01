# byvite-todo-app
A REST API service for managing a simple to-do list application, built with Node.js and Express. Includes endpoints for CRUD operations, with data stored in MongoDB. Developed for the Byvite backend development task.It manage a simple to-do list application. The API supports user management, task management, and JWT-based authentication.
## Features

### User Management
- **Register**
- **Login**
- **Logout**
- **Refresh Token**
- **Fetch Current User**

### Task Management
- **Create a Task**
- **Fetch All Tasks**
- **Fetch Task by ID**
- **Update Task Status**
- **Delete a Task**

### Authentication
- JWT-based authentication for protected endpoints.
- Access token refresh mechanism.
- Secure cookie management for session tracking.

## API Endpoints

### User Endpoints

#### 1. Register a New User
**Endpoint:** `POST /register`

**Request Body:**
```json
{
    "username": "riya",
    "email": "riya@gmail.com",
    "password": "1234567",
    "confirmPassword": "1234567",
    "profilePicture": "[file_path]"
}
```

**Response Body:**
```json
{
    "statusCode": 201,
    "data": {
        "_id": "677577f78efdb33b362e9e58",
        "username": "riya",
        "email": "riya@gmail.com",
        "profilePicture": "https://res.cloudinary.com/dy2eyh4o0/image/upload/v1735751671/lgnzgxwgp8qwcb8ks3yk.png",
        "createdAt": "2025-01-01T17:14:31.868Z",
        "updatedAt": "2025-01-01T17:14:31.868Z",
        "__v": 0
    },
    "message": "User Registered Successfully!!",
    "success": true
}
```

#### 2. Login User
**Endpoint:** `POST /login`

**Request Body:**
```json
{
    "email": "joy@gmail.com",
    "password": "1234567"
}
```

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "6775200d90e220b10af6c206",
            "username": "john doe",
            "email": "joy@gmail.com",
            "profilePicture": "https://res.cloudinary.com/dy2eyh4o0/image/upload/v1735729164/dbfa06j8a4nofa5epebf.png",
            "createdAt": "2025-01-01T10:59:25.110Z",
            "updatedAt": "2025-01-01T19:04:13.080Z",
            "__v": 0
        },
        "accessToken": "[accessToken]",
        "refreshToken": "[refreshToken]"
    },
    "message": "User Logged In Successfully!!",
    "success": true
}
```

#### 3. Logout User
**Endpoint:** `POST /logout`

**Headers:**
- Authorization: Bearer `[accessToken]`

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {},
    "message": "User Logged Out",
    "success": true
}
```

#### 4. Refresh Token
**Endpoint:** `POST /refresh-token`

**Request Body:**
```json
{
    "refreshToken": "[refreshToken]"
}
```

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {
        "accessToken": "[newAccessToken]",
        "refreshToken": "[newRefreshToken]"
    },
    "message": "Access Token Refreshed Successfully!!",
    "success": true
}
```

#### 5. Get Current User
**Endpoint:** `GET /current-user`

**Headers:**
- Authorization: Bearer `[accessToken]`

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {
        "_id": "6775200d90e220b10af6c206",
        "username": "john doe",
        "email": "joy@gmail.com",
        "profilePicture": "https://res.cloudinary.com/dy2eyh4o0/image/upload/v1735729164/dbfa06j8a4nofa5epebf.png",
        "createdAt": "2025-01-01T10:59:25.110Z",
        "updatedAt": "2025-01-01T19:05:04.447Z",
        "__v": 0
    },
    "message": "Current User Fetched!!",
    "success": true
}
```

### Task Endpoints

#### 1. Create a New Task
**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
    "title": "Buy Groceries",
    "description": "Milk, Bread, and Eggs",
    "status": "pending"
}
```

**Response Body:**
```json
{
    "statusCode": 201,
    "data": {
        "_id": "[taskId]",
        "title": "Buy Groceries",
        "description": "Milk, Bread, and Eggs",
        "status": "pending",
        "createdAt": "[timestamp]",
        "updatedAt": "[timestamp]"
    },
    "message": "Task Created Successfully!!",
    "success": true
}
```

#### 2. Fetch All Tasks
**Endpoint:** `GET /tasks`

**Response Body:**
```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "[taskId]",
            "title": "Buy Groceries",
            "description": "Milk, Bread, and Eggs",
            "status": "pending",
            "createdAt": "[timestamp]",
            "updatedAt": "[timestamp]"
        }
    ],
    "message": "Tasks Fetched Successfully!!",
    "success": true
}
```

#### 3. Fetch a Task by ID
**Endpoint:** `GET /tasks/:id`

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {
        "_id": "[taskId]",
        "title": "Buy Groceries",
        "description": "Milk, Bread, and Eggs",
        "status": "pending",
        "createdAt": "[timestamp]",
        "updatedAt": "[timestamp]"
    },
    "message": "Task Fetched Successfully!!",
    "success": true
}
```

#### 4. Update Task Status
**Endpoint:** `PUT /tasks/:id`

**Request Body:**
```json
{
    "status": "completed"
}
```

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {
        "_id": "[taskId]",
        "title": "Buy Groceries",
        "description": "Milk, Bread, and Eggs",
        "status": "completed",
        "createdAt": "[timestamp]",
        "updatedAt": "[timestamp]"
    },
    "message": "Task Updated Successfully!!",
    "success": true
}
```

#### 5. Delete a Task
**Endpoint:** `DELETE /tasks/:id`

**Response Body:**
```json
{
    "statusCode": 200,
    "data": {},
    "message": "Task Deleted Successfully!!",
    "success": true
}
```

## Database
- MongoDB is used as the database for storing users and tasks.
- Each task and user is uniquely identified by an `_id`.

## Authentication
- JWT is used for authentication.
- Access tokens are short-lived, while refresh tokens are long-lived.
- Secure cookies are used to store tokens for enhanced security.

## How to Run Locally
1. Clone the repository.
3. Install dependencies: `npm install`
4. Set up a `.env` file with the following variables:
   - `MONGO_URI` (MongoDB connection string)
   - `ACCESS_TOKEN_SECRET` (Secret key for JWT)
   - `ACCESS_TOKEN_EXPIRE` (Access token expiry, e.g., `1d`)
   - `REFRESH_TOKEN_EXPIRE` (Refresh token expiry, e.g., `5d`)
   - `REFRESH_TOKEN_SECRET` (Secret key for JWT)
   - `CLOUDINARY_CLOUD_NAME` 
   - `CLOUDINARY_API_KEY` 
   - `CLOUDINARY_API_SECRET` 
5. Start the server: `npm run dev`
6. Use tools like Postman to interact with the API.

## Notes
- Ensure proper validation and error handling for all endpoints.
- Use HTTPS in production for secure communication.

## Future Enhancements
- Implement controller for profile change , password change.
- Add user roles.

