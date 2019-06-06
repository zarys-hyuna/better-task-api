const express = require('express')
const Task = require('../models/task')
const authorization = require('../middleware/authorization')
const router = new express.Router()
const Joi = require('@hapi/joi')

const schemaTasks = Joi.object().keys({
    title: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).required(),
    description: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).required(),
})

router.post('/tasks', authorization,async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
   
    const {error, value} = Joi.validate({
        title: req.body.title,
        description: req.body.description,
    }, schemaTasks)

    if(error !== null){
        return res.boom.badRequest('Data did not pass validation')
    }
    
    try {
        await task.save()
        res.status(201).redirect('/tasks')
    } catch (e) {
        res.badImplementation('Could not Add new task')
    }
})



router.get('/tasks', authorization, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        
        res.render('index', {
            tasks: tasks,
            user: req.user
        })
    } catch (e) {
        res.badImplementation('Could not fetch the tasks')
    }
})

router.get('/tasks/:id', authorization, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id})

        if (!task) {
            return res.notFound('Could not find a task matching the id')
        }

        res.send(task)
    } catch (e) {
        res.badImplementation('Could not fetch the task from the database')
    }
})

router.post('/tasks/update', authorization, async (req, res) => {

    const {error, value} = Joi.validate({
        title: req.body.title,
        description: req.body.description,
    }, schemaTasks)

    if(error !== null){
        return res.boom.badRequest('bad form information')
    }


    const updates = Object.keys(req.body)
    const allowedUpdates = ['_id','title','description', 'status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.badRequest('Attempting to update what is not allowed')
    }

    
    try {
        const task = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.notFound('Could not find a task matching the id')
        }
 
        res.redirect('/tasks')
    } catch (e) {
        return res.badImplementation('Could not update the task in the database')
    }
})

router.post('/tasks/delete', authorization, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.body._id)

        if (!task) {
            return res.notFound('Could not find a task matching the id')
        }

        res.redirect('/tasks')
    } catch (e) {
        return res.badImplementation('Could not update the task in the database')
    }
})

module.exports = router