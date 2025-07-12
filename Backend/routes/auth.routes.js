import express from 'express'
import {login, createUser, logout, verifyEmail, verifyOTP} from '../controller/user.controller.js'
import userAuth from '../middlewares/userAuth.js';

const authRoutes =  express.Router();

authRoutes.post('/register', createUser)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.post('/sendOTP', userAuth, verifyOTP)
authRoutes.post('/verifyAccount', userAuth, verifyEmail)

export default authRoutes;