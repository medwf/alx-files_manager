# Files Manager

A comprehensive back-end file management platform built with Node.js, Express, MongoDB, and Redis. This project demonstrates authentication, file storage, background processing, and API development.

## 📋 Project Overview

This platform allows users to:
- Authenticate via token-based authentication
- Upload and manage files
- List all files with pagination
- Change file permissions (public/private)
- View files and generate thumbnails for images
- Process background jobs for image thumbnails and welcome emails

## 🛠️ Technologies

- **Node.js** (v12.x.x) - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **Redis** - In-memory data store for caching and session management
- **Bull** - Queue system for background job processing
- **ES6** - Modern JavaScript features
- **ESLint** - Code linting and style enforcement

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/medwf/alx-files_manager.git
cd alx-files_manager
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file or export the following variables:
```bash
PORT=5000                    # Server port (default: 5000)
DB_HOST=localhost           # MongoDB host (default: localhost)
DB_PORT=27017              # MongoDB port (default: 27017)
DB_DATABASE=files_manager  # Database name (default: files_manager)
FOLDER_PATH=/tmp/files_manager  # Storage path for uploaded files
```

4. **Start MongoDB and Redis:**
```bash
# Start MongoDB
sudo service mongodb start

# Start Redis
redis-server
```

## 🚀 Usage

### Start the server:
```bash
npm run start-server
```

### Start the background worker:
```bash
npm run start-worker
```

### Development mode:
```bash
npm run dev [filename]
```

## 📡 API Endpoints

### Status & Stats
- `GET /status` - Check Redis and DB connection status
- `GET /stats` - Get number of users and files

### User Management
- `POST /users` - Create a new user
- `GET /users/me` - Get current user information

### Authentication
- `GET /connect` - Sign in and generate authentication token
- `GET /disconnect` - Sign out and invalidate token

### File Management
- `POST /files` - Upload a new file
- `GET /files/:id` - Get file information by ID
- `GET /files` - List all files (with pagination)
- `PUT /files/:id/publish` - Make a file public
- `PUT /files/:id/unpublish` - Make a file private
- `GET /files/:id/data` - Get file content (supports thumbnail sizes: 100, 250, 500)

## 💡 Key Features

### 1. User Authentication
- Token-based authentication using UUID
- Passwords hashed with SHA1
- 24-hour token expiration stored in Redis

### 2. File Storage
- Local file storage with UUID-based filenames
- Support for files, folders, and images
- Base64 encoding for file uploads
- Hierarchical folder structure

### 3. Background Processing
- Automatic thumbnail generation for images (100px, 250px, 500px)
- Welcome email queue for new users
- Bull queue system for job management

### 4. Pagination
- 20 items per page for file listings
- Query parameter support for parent folder navigation

## 📁 Project Structure

```
alx-files_manager/
│
├── controllers/
│   ├── AppController.js      # Status and stats endpoints
│   ├── AuthController.js     # Authentication logic
│   ├── UsersController.js    # User management
│   └── FilesController.js    # File operations
│
├── routes/
│   └── index.js              # API route definitions
│
├── utils/
│   ├── redis.js              # Redis client utilities
│   └── db.js                 # MongoDB client utilities
│
├── tests/                    # Test files
│
├── worker.js                 # Background job processor
├── server.js                 # Express server setup
├── package.json              # Dependencies and scripts
├── .eslintrc.js             # ESLint configuration
└── babel.config.js          # Babel configuration
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Redis and MongoDB client utilities
- All API endpoints
- Authentication flow
- File upload and retrieval
- Pagination
- Background job processing

## 📝 API Usage Examples

### Create a user:
```bash
curl -XPOST http://0.0.0.0:5000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Connect (login):
```bash
curl http://0.0.0.0:5000/connect \
  -H "Authorization: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw=="
```

### Upload a file:
```bash
curl -XPOST http://0.0.0.0:5000/files \
  -H "X-Token: your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"name": "example.txt", "type": "file", "data": "SGVsbG8gV29ybGQh"}'
```

### List files:
```bash
curl http://0.0.0.0:5000/files \
  -H "X-Token: your-token-here"
```

### Get file with thumbnail:
```bash
curl http://0.0.0.0:5000/files/:id/data?size=250 \
  -H "X-Token: your-token-here"
```

## 🔒 Security Features

- Password hashing with SHA1
- Token-based authentication
- User ownership validation for file operations
- Public/private file permissions
- Authorization checks on all protected endpoints

## 🤝 Team

- **WAFI MOHAMED**

## 📊 Project Stats

- **Manual QA Review:** 12.0/12 mandatory & 20.0/20 optional
- **Auto QA Review:** 100/100 mandatory
- **Overall Score:** 200%
- **Contribution:** 100.0%

## 📄 License

This project is part of the ALX Software Engineering program.

## 🙏 Acknowledgments

Built as part of the ALX back-end trimester, covering authentication, NodeJS, MongoDB, Redis, pagination, and background processing.

---

**Project Duration:** March 7, 2024 - March 14, 2024
