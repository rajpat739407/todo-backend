const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000;
const cors= require('cors')
const ConnectDB= require('./Connection/conn')
require('./model/taskSchema.js')
require('./model/userSchema.js')
const TaskRouter= require('./Router/taskApi.js')
require('./Router/taskApi.js');
require('./Router/userApi.js');
const app = express()
const UserRouter= require('./Router/userApi.js')

app.use(express.json())
app.use(cors())
app.use(TaskRouter)
app.use(UserRouter)
ConnectDB()
app.get('/', (req,res)=>{
    res.send('Hello i am Home Page..')
})

app.listen(port,()=>{
    console.log(`App is running on the port ${port}`)
})
