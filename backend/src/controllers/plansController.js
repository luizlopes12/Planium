const fs = require("fs");
const path = require("path");
/* Helpers */
const getData = () => {
  let plans = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../data/plans.json"), "utf-8")
  );
  let prices = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../data/prices.json"), "utf-8")
  );
  let allData = [];
  /* Merging jsons */
  for (var i in plans) {
    var obj = {
      codigo: plans[i].codigo,
      nome: plans[i].nome,
      registro: plans[i].registro,
    };
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
  return allData;
};
const getPrices = (newBeneficiary, selectedPlan) =>{
    let beneficiariesPrices = [];
    for (var i in newBeneficiary.beneficiaries) {
      if (
        newBeneficiary.beneficiaries[i].age >= 0 &&
        newBeneficiary.beneficiaries[i].age <= 17
      ) {
        beneficiariesPrices.push({
          age: newBeneficiary.beneficiaries[i].age,
          price: selectedPlan[0].faixa1,
        });
      } else if (
        newBeneficiary.beneficiaries[i].age >= 18 &&
        newBeneficiary.beneficiaries[i].age <= 40
      ) {
        beneficiariesPrices.push({
          age: newBeneficiary.beneficiaries[i].age,
          price: selectedPlan[0].faixa2,
        });
      } else if (newBeneficiary.beneficiaries[i].age > 40) {
        beneficiariesPrices.push({
          age: newBeneficiary.beneficiaries[i].age,
          price: selectedPlan[0].faixa3,
        });
      }
    }
    beneficiariesPrices.push({
      total: beneficiariesPrices
        .map((item) => item.price)
        .reduce((partialSum, a) => partialSum + a, 0),
    });
    
    return beneficiariesPrices
}
let plansData = getData();



class plansController {
  static getAllPlans = (req, res) => {
    res.status(200).send(plansData);
  };

  static viewPrices = (req, res) => {
    let newBeneficiary = req.body;
    if(!newBeneficiary.beneficiaries){
        res.status(400).json({ message: "Dados incorretos, nenhum beneficiário encontrado" });
    }else{
    let selectedPlan = plansData.filter(
      (plan) => plan.codigo == newBeneficiary.planCode
    );
    let beneficiariesPrices = getPrices(newBeneficiary, selectedPlan)
    res.status(200).json(beneficiariesPrices);
    }
  };

  static addBeneficiaries = (req, res) => {
    let newBeneficiary = req.body;
    if(!newBeneficiary.beneficiaries){
        res.status(400).json({ message: "Dados incorretos" });
    }
    else if(!newBeneficiary.planCode){
        res.status(400).json({ message: "Plano inexistente" });
    }
    else{
        fs.readFile(
            path.resolve(__dirname, "../data/beneficiarios.json"),
            (err, data) => {
              var beneficiaries = JSON.parse(data);
              let selectedPlan = plansData.filter(
                (plan) => plan.codigo == newBeneficiary.planCode
              );
              let beneficiariesPrices = getPrices(newBeneficiary, selectedPlan)
              beneficiaries.push(newBeneficiary);
              let proposals = [{beneficiaries, beneficiariesPrices}]
              fs.writeFileSync(
                path.resolve(__dirname, "../data/beneficiarios.json"),
                JSON.stringify(beneficiaries)
              );
              fs.writeFileSync(
                path.resolve(__dirname, "../data/propostas.json"),
                JSON.stringify(proposals)
              );
              res.status(200).json({ message: "Beneficiarios adicionados" });
            }
          );
    }
  };
}

module.exports = plansController;
