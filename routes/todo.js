const express = require('express');
const auth = require('../middleware/user_jwt');


const Todo = require('../models/todoModel');

const router = express.Router();

//desc .. create new todo task
//method post

//Empty means, it will be default url like:"/"
//http://localhost:3000/api/todo

router.post("/",auth,async(req,res,next)=>{
    try{
        const toDo = await Todo.create({title:req.body.title, description: req.body.description,user:req.user.id});
        console.log('saurav suman is now understanding something');
        if(!toDo){
            return res.status(400).json({
                success:false,
                msg:"someting went wrong"
            })
        }

        res.status(200).json({
            success:true,
            todo:toDo,
            msg:'Successfull created'
        })



    }catch(error){
        next(error);
    }
});

//desc Fetch all todos 
//Reload get

router.get('/',auth,async(req,res,next)=>{
    try{

        const todo = await Todo.find({user:req.user.id,finished:false});


        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"something is not there"
            });
            
        }
        res.status(200).json({
            success:true,
            msg:"successfully fetched",
            count:todo.length,
            todo:todo
        })

    }catch(error){
        next(error);

    }
});


//desc .. update task
//update put

router.put('/:id',async (req,res,next)=>{
    try{
        let toDo =  await Todo.findById(req.params.id);
        if(!toDo){
            return res.status(400).json({
                success:false,
                msg:'Task not exist'
            });

        }

        toDo = await Todo.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });

        if(!toDo){
            return res.status(400).json({
                success:false,
                msg:'something went wrong'
            });
        }

        res.status(200).json({
            success:true,
            msg:'successfully update',
            todo:toDo
        });

    }catch(error){
        next(error);
    }
});


//desc Delete a task todo
//methos delete

router.delete('/:id',async (req,res,next)=>{

    try{
        let toDo =  await Todo.findById(req.params.id);
        if(!toDo){
            return res.status(400).json({
                success:false,
                msg:'Task not exist'
            });

        }

        toDo = await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success:true,
            msg:"successfully deleted"

        })

        

    }catch(error){
        next(error);
    }

});




router.get('/finished',auth,async(req,res,next)=>{
    try{

        const todo = await Todo.find({user:req.user.id,finished:true});


        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"something is not there"
            });
            
        }
        res.status(200).json({
            success:true,
            msg:"successfully fetched",
            count:todo.length,
            todo:todo
        })

    }catch(error){
        next(error);

    }
});



module.exports = router;