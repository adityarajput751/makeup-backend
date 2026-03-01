# Makeup Backend

A Node.js and MongoDB backend API for the makeup application.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection URI and other configurations.

### Running the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

### API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

### Project Structure

```
makeup-backend/
├── config/          # Configuration files
├── models/          # MongoDB models
├── routes/          # API routes
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── server.js        # Entry point
├── package.json     # Dependencies
└── .env.example     # Environment variables template
```

### Technologies

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing
- **body-parser** - Request body parser

### License

ISC
