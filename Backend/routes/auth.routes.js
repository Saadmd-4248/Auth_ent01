import express from 'express'
import {login, createUser, logout} from '../controller/user.controller.js'

const authRoutes =  express.Router();

authRoutes.post('/register', createUser)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

export default authRoutes;