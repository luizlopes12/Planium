const plans = require('./plansRoutes')

const routes = (app) =>{
    app.use(plans)
}
module.exports = routes