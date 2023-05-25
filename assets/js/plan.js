
document.querySelector("#formCheckZip").addEventListener("click", function (event) {
    event.preventDefault()
})

async function checkAvailableZipCode() {
    const zipCode = $("#zipCode").val().trim()

    if (zipCode.length === 0) {
        $("#alertAvailable").show()
        $("#choosePlanBlock").hide()
        $("#textAvailableArea").text("Please fill your city zipcode")

        return
    }

    const data = await fetchDynamicAPI("checkAvailableZipCode", { ZipCode: zipCode })
    if (data[0].result === 1) {
        $("#alertAvailable").show()
        $("#choosePlanBlock").show()
        $("#textAvailableArea").html("Great! Our service is available in your area <br /> <span>Choose your plan</span>")
    } else {
        $("#alertAvailable").show()
        $("#choosePlanBlock").hide()
        $("#textAvailableArea").text("Your area is not available now")
    }

}

async function choosePlan() {
    const data = await fetchDynamicAPI("getAllPlan", {})

    const htmlData = data.map(x => {
        return `
            <option value="${x.Id}">
                ${x.ConnectionType}
            </option>
        `
    }).join("")
    $("#connectionType").html(htmlData)
}



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
                            <a onclick="goToCheckZipCode()" class="borders-btn">Order Now</a>
                        </div>
                    </div>
                </div>
        `
    }).join("")

    $("#packagePlan").html(htmlData)
}
getAllPlan();


function goToCheckZipCode() {
    const element = document.getElementById("checkZipCode")
    $(window).scrollTop(element.getBoundingClientRect().top + document.documentElement.scrollTop - 250)
}