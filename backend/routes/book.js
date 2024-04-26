const express = require('express')
const router = express.Router();
const auth = require('auth')

const bookCtrl = require ('../controllers/book')

router.get('/', auth, bookCtrl.)