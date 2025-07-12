import express from 'express'
import {login, createUser, logout, sendOTP, verifyEmail} from '../controller/user.controller.js'
import userAuth from '../middlewares/userAuth.js';

const authRoutes =  express.Router();

authRoutes.post('/register', createUser)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.post('/sendOTP', userAuth, sendOTP)
authRoutes.post('/verifyAccount', userAuth, verifyEmail)

export default authRoutes;