async function getAllPlan() {
    const data = await fetchDynamicAPI("getAllPlan", {})

    const htmlData = data.map(x => {
        // console.log(x)
        const formatMoney = x.Amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        return `
             <div class="col-xl-4 col-lg-4 col-md-6 col-sm-10">
                    <div class="single-card text-center mb-30">
                        <div class="card-top">
                            <p>Single Package</p>
                            <h4>${x.ConnectionType.replace('Connection', '<br /> Connection')}</h4>
                        </div>
                        <div class="card-mid">
                            <h4>${formatMoney}</h4>
                        </div>
                        <div class="card-bottom">
                            <ul>
                                <li>Line Rental Included</li>
                                <li>12 Month Contract</li>
                                <li>No Activation Charges</li>
                                <li>Enjoy family on weekends</li>
                                <li>Up to 100% discount security deposit</li>
                            </ul>
                            <a href="plan.html" class="borders-btn">Order Now</a>
                        </div>
                    </div>
                </div>
        `
    }).join("")

    document.querySelector("#packagePlan").innerHTML = htmlData
}
getAllPlan();
document.querySelector("form").addEventListener("click", function (event) {
    event.preventDefault()
})
function checkAvailableZipCode() {
    console.log();
    if ($('#zipCodeInput').val().trim().length === 0) {
        alert('Input valid zipcode')
        return;
    }
    window.location.href = `plan.html?zipcode=${$('#zipCodeInput').val().trim()}`
}