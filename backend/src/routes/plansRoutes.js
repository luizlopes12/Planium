const express = require('express')
const plansController = require('../controllers/plansController')
const router = express.Router()


router
    .get('/plans', plansController.getAllPlans)
    .post('/view-prices', plansController.viewPrices)
    .post('/add-beneficiaries', plansController.addBeneficiaries)


    
module.exports = router