async function fetchDynamicAPI(procedureName,formData){
const url = `https://localhost:44315/DynamicAPI/${procedureName}`
    const res =  await fetch(url,{method: "POST",headers:{"Content-Type": "application/json"},body : JSON.stringify(formData)})
    
    const data = await res.json();

    return data
}



