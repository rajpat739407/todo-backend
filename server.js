const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ConnectDB = require('./Connection/conn');

require('./model/taskSchema.js');
require('./model/userSchema.js');

const TaskRouter = require('./Router/taskApi.js');
const UserRouter = require('./Router/userApi.js');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Use CORS with custom config
const allowedOrigins = ['http://localhost:3000', 'https://todo-frontend.vercel.app'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routers
app.use(TaskRouter);
app.use(UserRouter);

// ✅ DB Connection
ConnectDB();

// ✅ Home route
app.get('/', (req, res) => {
  res.send('Hello I am Home Page..');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
