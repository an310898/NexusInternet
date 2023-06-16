async function getOrderList() {
    const data = await fetchDynamicAPI('getCustomerOrderDetail', {})
    console.log("🚀 ~ file: order.js:3 ~ getOrderList ~ data:", data)

    const html = data.map(x => {
        let OrderDate = new Date(x.OrderDate)
        let formatDate = OrderDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return ` <tr>
                                            <td>${x.CustomerID}</td>
                                            <td>${x.FirstName + ' ' + x.LastName}</td>
                                            <td>${x.Address}</td>
                                            <td>${x.Phone}</td>
                                            <td>${x.ConnectionType}</td>
                                            <td>${x.OptionName}</td>
                                            <td>${x.Description}</td>
                                            <td>${x.ProductName}</td>
                                            <td>${x.PaymentMethod}</td>
                                            <td>${x.BillAmount}</td>
                                            <td>${formatDate}</td>
                                            <td>${x.OrderStatus}</td>
                                            <td style="display:flex;justify-content: space-around;width:50px">
                                            ${x.OrderStatus !== 'Completed' ? `<i class="far fa-edit" data-toggle="modal" data-target="#orderStatusModal" style="cursor:pointer" onclick='showUpdateOrderModel("${x.CustomerID}","${x.OrderStatus}")'></i>` : `<i class="far fa-edit disabled" data-toggle="modal"  style="cursor:not-allowed")'></i>`}
                                            

                                            </td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)
    $('#dataTable').DataTable();
}

$('document').ready(function () {
    getOrderList()
    $('#formUpdateStatus').submit(function (e) {
        e.preventDefault();
        return false;
    })

})

function showUpdateOrderModel(cusId, cusStatus) {
    $('#status').val(cusStatus)

    $('#btnUpdateStatus').attr('onclick', `updateOrderModel("${cusId}")`)
}

async function updateOrderModel(cusId) {

    const res = await fetchDynamicAPI('updateCustomerOrderStatus', { CusId: cusId, Status: $('#status').val() })

    if (res[0].res === 1) {
        alert('Update status success!')
        getOrderList()
        $('#orderStatusModal').modal('hide')
    } else {
        alert('Update status fail, try again!')
        getOrderList()
        $('#orderStatusModal').modal('hide')
    }
}