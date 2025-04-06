const express=require('express');

const router1=new express.Router();
const TODOuserTask=require('../model/taskSchema');
const router = require('./userApi');


//Code for Post Data at server
// router1.post('/todo-data', (req,res)=>{
//     // console.log(req.body)
//     const Todotask= new TODOuserTask(req.body)
//     Todotask.save().then(()=>{
//         res.status(201).send(Todotask);
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })

// Get tasks for specific user
router1.get('/tasks', async (req, res) => {
  try {
    const { userId } = req.query;
    const tasks = await TODOuserTask.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:userId
router.get('/tasks/:userId', async (req, res) => {
  try {
    const tasks = await TODOuserTask.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create task with userId
// Backend - routes/todo.js or wherever your routes are defined
router1.post('/tasks', async (req, res) => {
  try {
    const { task, userId } = req.body;

    console.log("Received task:", task, "from user:", userId); // DEBUG

    const newTask = new TODOuserTask({
      task,
      userId,
    });

    await newTask.save();

    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Failed to add task" });
  }
});




router1.get("/tasks/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const tasks = await TODOuserTask.find({ userId });
      res.json(tasks);
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  

//Code for update task From server

router1.patch('/tasks/:id', async(req,res)=>{
    try{
        const _id= req.params.id;
        const updateData= await TODOuserTask.findByIdAndUpdate(_id , req.body,{
            new: true
        });
        console.log(updateData)
        res.status(201).send(updateData)
    }catch(e){
        res.status(400).send(e);
    }
})


//Code for Delete Task From server

router1.delete('/tasks/:id', async(req,res)=>{
    try{
        const _id=req.params.id;
        const deletedTask= await TODOuserTask.findByIdAndDelete(_id, req.body,{
            new:true
        })
        console.log(deletedTask);
        res.status(201).send(deletedTask)
    }catch(e){
        res.status(400).send(e);
    }
})




module.exports=router1;