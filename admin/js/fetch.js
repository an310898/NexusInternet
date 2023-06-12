async function fetchDynamicAPI(procedureName, formData) {
    const url = `https://localhost:44315/DynamicAPI/${procedureName}`
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })

    const data = await res.json();

    return data
}



async function fetchApi(controller) {
    const url = `https://localhost:44315/api/${controller}`
    const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })

    const data = await res.json();

    return data
}
async function fetchApi(controller, method, formData) {
    const url = `https://localhost:44315/api/${controller}`
    const res = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
        .then(res => res.json())
        .then(x => x)
        .catch(err => err)

    // const data = await res.json();

    return res
}