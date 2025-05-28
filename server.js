const express = require('express');
const app = express();
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://todo-frontend-marajpatel123s-projects.vercel.app',
];

app.use(cors({
  origin: "https://todo-frontend-ten-orcin.vercel.app", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies/sessions
}));

app.use(express.json());

require('./model/taskSchema.js');
require('./model/userSchema.js');
const TaskRouter = require('./Router/taskApi.js');
const UserRouter = require('./Router/userApi.js');
const ConnectDB = require('./Connection/conn');

app.use(TaskRouter);
app.use(UserRouter);

ConnectDB();

app.get('/', (req, res) => {
  res.send('Hello I am Home Page..');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
