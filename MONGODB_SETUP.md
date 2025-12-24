# MongoDB Setup Instructions

## Quick Start with MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Create a Cluster
1. Click "Create a Deployment"
2. Select "M0 Free" tier
3. Choose your cloud provider and region
4. Click "Create Deployment"
5. Wait for the cluster to be created (takes a few minutes)

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Select "Drivers"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `book_management`

Example connection string:
```
mongodb+srv://username:password@cluster0.mongodb.net/book_management?retryWrites=true&w=majority
```

### Step 4: Update .env File
In `server/.env`, update:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/book_management?retryWrites=true&w=majority
```

### Step 5: Seed Database
Run the seed script to populate demo data:
```bash
cd server
npm run seed
```

## Local MongoDB Setup (Alternative)

### Windows
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically
5. Default connection: `mongodb://localhost:27017/book_management`

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Verify MongoDB Connection

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass from: https://www.mongodb.com/products/compass
2. Click "New Connection"
3. Paste your connection string
4. Click "Connect"

### Using Command Line
```bash
mongosh "mongodb+srv://username:password@cluster0.mongodb.net/book_management"
```

## Seed Demo Data

After setting up MongoDB, run:
```bash
cd server
npm run seed
```

This will create:
- 1 Admin user (admin@example.com / password123)
- 2 Student users (student@example.com / password123)
- 6 Book categories
- 8 Sample books

## Troubleshooting

### Connection Refused Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Authentication Failed
- Verify username and password
- Check that database user has correct permissions
- For Atlas, ensure user is in the correct project

### Database Not Found
- The database will be created automatically on first connection
- Ensure you have write permissions

## Next Steps

1. Update `.env` with your MongoDB connection string
2. Run `npm run seed` to populate demo data
3. Start the backend: `npm run dev`
4. Start the frontend: `npm run dev` (in client directory)
5. Open http://localhost:5173 in your browser

---

For more help, visit: https://docs.mongodb.com/
