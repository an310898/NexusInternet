var connectType = 0, connectOption = 0, connectDetail = 0, productId = 0;
var planDetailData, productForPlan;

document.querySelector("#formCheckZip").addEventListener("click", function (event) {
    event.preventDefault()
})

async function checkAvailableZipCode() {
    $("#callCharge").hide()
    $("#callChargeDetail").html('')
    const zipCode = $("#zipCode").val().trim()

    if (zipCode.length === 0) {
        $("#alertAvailable").show()
        $("#choosePlanBlock").hide()
        $("#choosePlanOption").hide()
        $("#textAvailableArea").html(`<h2 style='font-size: 24px;'>Please fill your city zipcode</h2>`)

        return
    }

    const data = await fetchDynamicAPI("checkAvailableZipCode", { ZipCode: zipCode })
    if (parseInt(data[0].result) === 1) {
        $("#alertAvailable").show()
        $("#choosePlanBlock").show()
        $("#planDetail").attr('disabled', "true")
        $("#choosePlanOption").hide()
        $("#planDetail").html(`<option value="1" selected disabled hidden>Choose here</option>`)
        $("#textAvailableArea").html(`<p>Our pricing plan for you</p> <h2 style='font-size: 24px;' >Great! Our service is available in your area.</h2>`)
    } else {
        $("#alertAvailable").show()
        $("#choosePlanBlock").hide()
        $("#choosePlanOption").hide()
        $("#textAvailableArea").html("<h2 style='font-size: 24px;'>Your area is not available now</h2>")
    }

}

// async function choosePlan() {
//     const data = await fetchDynamicAPI("getAllPlan", {})

//     const htmlData = data.map(x => {
//         return `
//             <option value="${x.Id}">
//                 ${x.ConnectionType}
//             </option>
//         `
//     }).join("")
//     $("#connectionType").html(htmlData)
// }



async function getAllPlan() {
    const data = await fetchDynamicAPI("getAllPlan", {})
    const htmlData = data.map(x => {

        // console.log(x.Amount)
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
                            <h4>\$<span style="color: #ff3e3f; font-size: 30px; font-weight: 800; padding-right: 3px;" data-plan-id-${x.Id}>${x.Amount.toFixed(2)}</span></h4>
                        </div>
                        <div class="card-bottom">
                            <ul>
                                <li>Line Rental Included</li>
                                <li>12 Month Contract</li>
                                <li>No Activation Charges</li>
                                <li>Enjoy family on weekends</li>
                                <li>Up to 100% discount security deposit</li>
                            </ul>
                            <a style="cursor:pointer" onclick="selectPlan(${x.Id})" class="borders-btn">Choose this plan</a>
                        </div>
                    </div>
                </div>
        `
    }).join("")

    $("#packagePlan").html(htmlData)
}
getAllPlan();

async function selectPlan(PlanId) {
    const connectionTypeCharge = $(`[data-plan-id-${PlanId}]`).text()
    const taxStandard = connectionTypeCharge * 12.5 / 100
    $('#productChoosePlan').html('')
    $("#choosePlanBlock").hide()
    $("#choosePlanOption").show()
    connectType = PlanId
    $("#standardInstall").text(connectionTypeCharge)
    $("#standardInstallTax").text(taxStandard)
    $("#oneTimeTotal").text(parseFloat(connectionTypeCharge) + parseFloat(taxStandard))

    const dataSelect = await fetchDynamicAPI("getPlanOptionByPlanId", { PlanId: PlanId })
    productForPlan = await fetchDynamicAPI("getProductForPlan", { PlanId: PlanId })

    // console.log(productForPlan);

    const htmlOptionProduct = productForPlan.map(x => {
        return `
            <option value="${x.Id}">${x.ProductName}</option>
        `
    })

    const html = dataSelect.map(x => {
        return `
            <option value="${x.Id}">${x.OptionName}</option>
        `
    }).join("")

    // console.log(html)


    $("#planOption").html(`<option value="1" selected disabled hidden>Choose here</option>` + html)
    $("#ProductPlan").html(`<option value="0" selected>I have for my own</option>` + htmlOptionProduct)
}
async function getPlanDetail(elem) {
    $("#callCharge").hide()
    $("#callChargeDetail").html('')


    connectOption = parseInt(elem.value)

    const data = await fetchDynamicAPI("getPlanDetailByPlanOptionId", { PlanOptionId: parseInt(elem.value) })

    const html = data.map(x => {
        return ` <option value="${x.Id}">${x.Description}</option>`

    }).join("")
    // console.log(html);
    planDetailData = data

    $("#planDetail").removeAttr("disabled")
    $("#planDetail").html(`<option value="1" selected disabled hidden>Choose here</option>` + html)

}


function onSelectPlanDetail(elem) {

    const html = planDetailData.map(x => {
        if (x.Id == elem.value) {
            connectDetail = x.Id
            if (x.CallCharges !== null) {
                $("#callCharge").show()
                $("#callChargeDetail").html(x.CallCharges)
            }
            const priceMonthly = x.Price
            const taxPriceMonthly = x.Price * 12.5 / 100
            $("#priceMonthly").text(priceMonthly.toFixed(2))
            $("#taxPriceMonthly").text(taxPriceMonthly.toFixed(2))
            $("#monthlyTotal").text(priceMonthly + taxPriceMonthly)
        }
    })

    $("#monthlyCharge").html(html)
}

function onSelectProduct(elem) {

    let oneTimeTotal = $("#oneTimeTotal").text();
    productId = parseInt(elem.value)

    if (productId === 0) {
        $("#productPrice").text('0.00')
        console.log();
        $("#oneTimeTotal").text(parseFloat($('#standardInstall').text()) + parseFloat($("#standardInstallTax").text()))
        $('#productChoosePlan').html('')
        return;
    }

    for (let i = 0; i < productForPlan.length; i++) {
        if (parseInt(elem.value) === productForPlan[i].Id) {
            $('#productChoosePlan').html(`<div class="col-lg-4 text-center">
                                                    <img style="object-fit: cover;max-width:200px;max-height: 200px;" src="${productForPlan[i].ProductImageUrl}" alt="">
                                                </div>
                                                <div class="col-lg-8">
                                                    <p>${productForPlan[i].Description}</p>
                                                </div>`)
            $("#productPrice").text(productForPlan[i].Price)

            $("#oneTimeTotal").text(parseFloat(oneTimeTotal) + productForPlan[i].Price)



            break;
        }
    }

}


function goTocheckOut() {
    console.log(`connectType: ${connectType}, connectOption: ${connectOption}, connectDetail: ${connectDetail}, productId: ${productId}`)

}