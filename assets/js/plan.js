var connectType = 0, connectOption = 0, connectDetail = 0, productId = 0;
var planDetailData, productForPlan;

let listAvaiableCity;


const urlParams = new URLSearchParams(window.location.search);
console.log();

initFn()
function initFn() {
    $('#zipCode').val(urlParams.get('zipcode'))
    if (urlParams.get('zipcode').trim().length > 0) {
        checkAvailableZipCode(urlParams.get('zipcode'))
    }
    getAllPlan();
    getAvailableCity()

}


async function getAvailableCity() {
    listAvaiableCity = await fetchDynamicAPI("getAvailableCity", {})

    const htmlCityOption = listAvaiableCity.map(x => {
        return `
            <option value="${x.Id}">${x.Name}</option>
        `
    }).join('')

    $('#customerCity').html('<option value="0" selected="" disabled="" hidden="">Choose your city</option>' + htmlCityOption)

}

document.querySelector("#formCheckZip").addEventListener("click", function (event) {
    event.preventDefault()
})

async function checkAvailableZipCode(zipParam) {
    returnChoosePlanDetail()
    resetPlanAndCharge()
    const zipCode = zipParam || $("#zipCode").val().trim()

    if (zipCode.length === 0) {
        $("#alertAvailable").show()
        $("#choosePlanBlock").hide()
        $("#choosePlanOption").hide()
        $("#textAvailableArea").html(`<h2 style='font-size: 24px;'>Please fill your city zipcode</h2>`)

        return
    }

    const data = await fetchDynamicAPI("checkAvailableZipCode", { ZipOrCityName: zipCode })
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

async function selectPlan(PlanId) {
    const connectionTypeCharge = $(`[data-plan-id-${PlanId}]`).text()
    const taxStandard = connectionTypeCharge * 12.5 / 100
    $('#productChoosePlan').html('')
    $("#choosePlanBlock").hide()
    $("#choosePlanOption").show()
    $("#standardInstall").text(connectionTypeCharge)
    $("#standardInstallTax").text(taxStandard)
    $("#oneTimeTotal").text(parseFloat(connectionTypeCharge) + parseFloat(taxStandard))

    connectType = PlanId



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


    $("#planOption").html(`<option value="0" selected disabled hidden>Choose here</option>` + html)
    $("#ProductPlan").html(`<option value="0" selected>I have for my own</option>` + htmlOptionProduct)
}
async function getPlanDetail(elem) {
    $("#callCharge").hide()
    $("#callChargeDetail").html('')
    $("#priceMonthly").text('0.00')
    $("#taxPriceMonthly").text('0.00')
    $("#monthlyTotal").text('0.00')

    connectOption = parseInt(elem.value)
    connectDetail = 0
    const data = await fetchDynamicAPI("getPlanDetailByPlanOptionId", { PlanOptionId: parseInt(elem.value) })

    const html = data.map(x => {
        return ` <option value="${x.Id}">${x.Description}</option>`

    }).join("")
    // console.log(html);
    planDetailData = data

    $("#planDetail").removeAttr("disabled")
    $("#planDetail").html(`<option value="0" selected disabled hidden>Choose here</option>` + html)
    validatePlan()

}


function onSelectPlanDetail(elem) {
    for (let i in planDetailData) {
        if (planDetailData[i].Id == elem.value) {
            connectDetail = planDetailData[i].Id
            if (planDetailData[i].CallCharges !== null) {
                $("#callCharge").show()
                $("#callChargeDetail").html(planDetailData[i].CallCharges)
            }
            const priceMonthly = planDetailData[i].Price
            const taxPriceMonthly = planDetailData[i].Price * 12.5 / 100
            $("#priceMonthly").text(parseFloat(priceMonthly))
            $("#taxPriceMonthly").text(parseFloat(taxPriceMonthly))
            $("#monthlyTotal").text(parseFloat(priceMonthly + taxPriceMonthly))
            break;
        }
    }
    validatePlan()
}

function onSelectProduct(elem) {

    let oneTimeTotal = $("#oneTimeTotal").text();
    productId = parseInt(elem.value)

    if (productId === 0) {
        $("#productPrice").text('0.00')
        // console.log();
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
    $('#planOption').css('border', '')
    $('#planDetail').css('border', '')

    console.log(`connectType: ${connectType}, connectOption: ${connectOption}, connectDetail: ${connectDetail}, productId: ${productId}`)
    if (parseInt(connectOption) === 0 || parseInt(connectDetail) === 0) {
        if (parseInt(connectOption) === 0) {
            $('#planOption').css('border', '1px solid red')
        }
        if (parseInt(connectDetail) === 0) {
            $('#planDetail').css('border', '1px solid red')
        }
        return
    }

    $('#choosePlan').hide()
    $('#fillInfo').show()
    $('#btnGoCheckOut').addClass('d-none')
    $('#btnPlaceOrder').removeClass('d-none')

}

function validatePlan() {
    // console.log($("#planDetail").val() > 1);
    if ($("#planDetail").val() > 1) {
        $("#btnGoCheckOut").removeClass('disable')
        return;
    }
    $("#btnGoCheckOut").addClass('disable')

}
function resetPlanAndCharge() {

    $("#callCharge").hide()
    $("#callChargeDetail").html('')
    $('#productPrice').text('0.00')
    $('#priceMonthly').text('0.00')
    $('#taxPriceMonthly').text('0.00')
    $('#monthlyTotal').text('0.00')
    connectOption = 0
    connectDetail = 0
    productId = 0
}

function returnChoosePlan() {
    $('#choosePlanOption').hide()
    $('#choosePlanBlock').show()
    $('#planDetail').html(`<option value="0" selected disabled hidden>Choose here</option>`)
    $('#planDetail').attr('disabled', 'true')
    resetPlanAndCharge()
}

function returnChoosePlanDetail() {
    $('#choosePlan').show()
    $('#fillInfo').hide()
    $('#btnGoCheckOut').removeClass('d-none')
    $('#btnPlaceOrder').addClass('d-none')
}

async function placeOrder() {
    const firstName = $('#firstName').val().trim() || ''
    const lastName = $('#lastName').val().trim() || ''
    const email = $('#email').val().trim() || ''
    const phone = $('#phone').val().trim() || ''
    const address = $('#address').val().trim() || ''
    const customerCity = $('#customerCity').val() || ''


    console.log(firstName, lastName, email, phone, address, customerCity, connectType, connectOption, connectDetail, productId);

    if (firstName.length === 0 || lastName.length === 0 || !(isValidEmail(email)) || phone.length < 10 || address.length === 0 || customerCity.length === 0) {
        if (firstName.length === 0) {
            $('#firstName').addClass('single-input-alert')
        }
        if (lastName.length === 0) {
            $('#lastName').addClass('single-input-alert')
        }
        if (!isValidEmail(email)) {
            $('#email').addClass('single-input-alert')
        }
        if (phone.length < 10) {
            $('#phone').addClass('single-input-alert')
        }
        if (address.length === 0) {
            $('#address').addClass('single-input-alert')
        }
        if (customerCity.length === 0) {
            $('#customerCity').css('border', '1px solid red')
        }
        return
    }

    const data = await fetchDynamicAPI('addNewCustomer', { FirstName: firstName, LastName: lastName, Email: email, Phone: phone, Address: address, CityId: customerCity, PlanId: connectType, PlanOptionId: connectOption, PlanDetailId: connectDetail, ProductId: productId, })


    if (data[0].CustomerId.length === 10) {
        $('#choosePlanOption').hide();
        $('#textAvailableArea').html(`<h2 style="font-size: 24px;">Order successful, your customer code is: ${data[0].CustomerId}.</h2>`)
    }
}

function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
