const express = require('express')
const plansController = require('../controllers/plansController')
const router = express.Router()


router
    .get('/plans', plansController.getAllPlans)
    .post('/beneficiaries', plansController.addBeneficiaries)


    
module.exports = router