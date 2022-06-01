const fs = require('fs')
const path = require('path')

let getData = () =>{
    let plans = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/plans.json"),'utf-8'))
    let prices = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/prices.json"),'utf-8'))
    let allData = []
    /* Merging jsons */
    for (var i in plans) {
        var obj = {codigo: plans[i].codigo, nome: plans[i].nome, registro: plans[i].registro};
        for (var j in prices) {
            if (plans[i].codigo == prices[j].codigo) {
                obj.minimo_vidas = prices[j].minimo_vidas;
                obj.faixa1 = prices[j].faixa1;
                obj.faixa2 = prices[j].faixa2;
                obj.faixa3 = prices[j].faixa3;
            }
        }
        allData.push(obj);
    }
    return allData
}
let plansData = getData()

class plansController {
    static getAllPlans = (req,res) =>{
    res.status(200).send(plansData)
    }
    static addBeneficiaries = (req,res) =>{ 
        if(req.body){
            var newBeneficiary = req.body
        }
        fs.readFile(path.resolve(__dirname, "../data/beneficiarios.json"), (err, data) => {
            var beneficiaries = JSON.parse(data)
            beneficiaries.push(newBeneficiary)
            fs.writeFileSync(path.resolve(__dirname, "../data/beneficiarios.json"), JSON.stringify(beneficiaries))
        })
        let selectedPlan = plansData.filter(plan => plan.codigo == newBeneficiary.planCode)
        let beneficiariesPrices = []
        for(var i in newBeneficiary.beneficiaries){
            if(newBeneficiary.beneficiaries[i].age >= 0 && newBeneficiary.beneficiaries[i].age <= 17 ){
                beneficiariesPrices.push(
                        {name: newBeneficiary.beneficiaries[i].name, price: selectedPlan[0].faixa1}
                    )
            }else if(newBeneficiary.beneficiaries[i].age >= 18 && newBeneficiary.beneficiaries[i].age <= 40 ){
                beneficiariesPrices.push(
                    {name: newBeneficiary.beneficiaries[i].name, price: selectedPlan[0].faixa2}
                )
            }else if(newBeneficiary.beneficiaries[i].age > 40){
                beneficiariesPrices.push(
                    {name: newBeneficiary.beneficiaries[i].name, price: selectedPlan[0].faixa3}
                )
            }
        }
        res.send(beneficiariesPrices)
    }
}

module.exports = plansController



