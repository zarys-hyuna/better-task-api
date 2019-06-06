const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const authorization = require('../middleware/authorization')
const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).min(3),
    password: Joi.string().alphanum().min(6),
    email: Joi.string().email()
})


router.post('/users', async (req, res)=> {
    const {error, value} = Joi.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, schema)
    
    if(error !== null){
        return res.boom.badRequest('bad form information')
    }

    const user = new User(req.body)

    try{
    await user.save()
    const token = await user.generateAuthorizationToken()
    res.cookie('token', token)
    res.status(201).redirect('../tasks')
    } 
    catch (e){
        res.boom.badRequest('No account created')
    }
})


router.post('/users/login', async (req, res) => {

    const {error, value} = Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, schema)

    if(error !== null){
        return res.boom.badRequest('Incorrect email or password format')
    }
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthorizationToken()
        
        res.cookie('token', token)
        res.status(200).redirect('../../tasks')
        
    } catch (e) {
        res.boom.badRequest('User could not be logged in')
    }
})

router.get('/users/logout',  authorization , async (req, res) => {
    try {
        
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.clearCookie('token')
        res.status(200).redirect('../../')
    } catch (e) {
        res.boom.badImplementation('User could not be logged out')
    }
})

router.post('/users/logoutAll', authorization, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.clearCookie('token')
        res.send()
    } catch (e) {
        res.boom.badImplementation('User could not be logged out')
    }
})

router.get('/users/profile', authorization ,async (req, res) => {
        
    
        res.render('profile',{ user: req.user})
        
})



router.post('/users/profile/update', authorization, async (req, res) => {
    const updates = Object.keys(req.body)

    const {error, value} = Joi.validate({
        name: req.body.name,
    }, schema)
    
    if(error !== null){
        return res.boom.badRequest('Form data Invalid')
    }

    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValid = updates.every((update)=> {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.boom.badRequest('Attempting to update what is not allowed')
    }

    try {

     updates.forEach((update) => req.user[update] = req.body[update])
     await req.user.save()

     res.redirect('../../../users/profile')



    } 
    
    catch (e) {
        res.boom.badImplementation('Could not update')
    }

})

router.post('/users/profile/delete', authorization, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        return  res.res.boom.badImplementation('Could not delete')
    }
})


module.exports = router