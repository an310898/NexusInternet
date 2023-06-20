async function getCusList() {
    const data = await fetchApi('Customers')

    const html = data.map(x => {
        let joinDate = new Date(x.createdDate)
        let formatDate = joinDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return ` <tr>
                                            <td>${x.id}</td>
                                            <td>${x.firstName + ' ' + x.lastName}</td>
                                            <td>${x.email}</td>
                                            <td>${x.phone}</td>
                                            <td>${x.address}</td>
                                            <td>${x.city.name}</td>
                                            <td>${x.state}</td>
                                            <td>${formatDate}</td>
                                            <td style="display:flex;justify-content: space-around;width:50px">
                                            <i class="fas fa-info-circle" data-toggle="modal" data-target="#cusPlanModal" style="cursor:pointer"  onclick='cusPlanDetail("${x.id}")'></i>
                                            <i class="far fa-edit" data-toggle="modal" data-target="#editModal" style="cursor:pointer" onclick='editCustomer("${x.id}")'></i>
                                            
                                            </td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)
    $('#dataTable').DataTable({
        "ordering": false
    });
}

$('document').ready(async function () {
    await getCusList()
    $('#formPlan').submit(function (e) {
        e.preventDefault();
        return false
    })

})



async function editCustomer(cusId) {
    // $('#editModal').hide()
    const data = await fetchApi(`Customers/${cusId}`)


    $('#EditFirstName').val(`${data.firstName}`)
    $('#EditLastName').val(`${data.lastName}`)
    $('#EditEmail').val(`${data.email}`)
    $('#EditPhone').val(`${data.phone}`)
    $('#EditAddress').val(`${data.address}`)
    $('#EditState').val(`${data.state}`)
    $('#btn-edit').attr('onclick', `editCus("${data.id}")`)
    // $('#editModal').show()

}

async function editCus(cusId) {
    const firstName = $('#EditFirstName').val()
    const lastName = $('#EditLastName').val()
    const email = $('#EditEmail').val()
    const phone = $('#EditPhone').val()
    const address = $('#EditAddress').val()
    const state = $('#EditState').val()


    const formData = {
        id: cusId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
        state: state,
    }
    // console.log(formData);

    const res = await fetchDynamicAPI('updateCustomerInfo', formData)

    if (res[0].result === 1) {
        alert('Edit success')
        getCusList()
        $('#editModal').modal('hide')
    } else {
        alert('Update customer failed, try again!')
        $('#editModal').modal('hide')
    }


}




let plan, planOption, planDetail;

async function getAllPlan() {
    plan = await fetchApi('Plans')
    const htmlPlan = plan.map(x => {
        return `<option value="${x.id}">${x.connectionType}</option>`
    }).join('')
    $('#Plan').html(htmlPlan)


    planOption = await fetchApi('PlansOptions')
    // console.log("🚀 ~ file: customer.js:93 ~ getAllPlan ~ planOption:", planOption)
    planDetail = await fetchApi('PlansDetails')
    // console.log("🚀 ~ file: customer.js:95 ~ getAllPlan ~ planDetail:", planDetail)

}
getAllPlan()




async function cusPlanDetail(cusId) {
    const data = await fetchDynamicAPI(`getCustomerPlan`, { CustomerId: cusId })
    console.log("🚀 ~ file: customer.js:110 ~ cusPlanDetail ~ data:", data)

    $('#Plan').val(data[0].PlanId)

    const htmlOption = planOption.map(x => {
        if (x.planId === data[0].PlanId) {
            return `
                <option value="${x.id}">${x.optionName}</option>
            `
        }
    })
    console.log("🚀 ~ file: customer.js:132 ~ htmlDetail ~ planDetail:", planDetail)

    $('#planOption').html(htmlOption)
    $('#planOption').val(data[0].PlanOption)

    const htmlDetail = planDetail.map(x => {
        if (x.plansOptionId === data[0].PlanOption) {
            return `
                <option value="${x.id}">${x.description}</option>
            `
        }
    })

    $('#PlanDetail').html(htmlDetail)
    $('#PlanDetail').val(data[0].PlanDetailId)


    $('#btn-plan-edit').attr('onclick', `updateCusPlan("${data[0].CustomerId}")`)
}


async function updateCusPlan(cusId) {


    const formData = {
        customerId: cusId,
        planOptionId: $("#planOption").val(),
        planDetailId: $("#PlanDetail").val()
    }
    console.log("🚀 ~ file: customer.js:155 ~ updateCusPlan ~ formData:", formData)

    const res = await fetchDynamicAPI('updateCustomerPlan', formData)
    if (res[0].res === 1) {
        alert('Update customer plan success!')
        $('#cusPlanModal').modal('hide')
    } else {
        alert('Update fail, try again!')
        $('#cusPlanModal').modal('hide')

    }
}


function getPlanDetail() {


    const htmlDetail = planDetail.map(x => {
        if (x.plansOptionId === parseInt($('#planOption').val())) {
            return `
                <option value="${x.id}">${x.description}</option>
            `
        }
    })

    $('#PlanDetail').html(htmlDetail)
}