const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        
        res.render('index', {
            tasks: tasks
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/tasks/update', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['_id','title','description', 'status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }

        res.redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/tasks/delete', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.body._id)

        if (!task) {
            res.status(404).send()
        }

        res.redirect('/tasks')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router