import React, {useState, useEffect} from 'react'
import API from '../../configs/axios'


const Form = () => {
    
const [plansData, setPlansData] = useState()

useEffect(()=>{
    API.get('/plans')
    .then((response)=>{
        setPlansData(response.data)
    })
    .catch((err)=>{
        console.log(err);
    })
},[])
console.log(plansData);
  return (
    <form>
        <select>
            {plansData && plansData.map((plan)=>{
                return (<option value={plan.codigo}>{plan.nome}</option>)
            })}
        </select>
    </form>
  )
}

export default Form