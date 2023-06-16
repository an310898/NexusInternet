async function getBillList() {
    const data = await fetchDynamicAPI('getAllBill', {})

    const html = data.map(x => {
        let BillingDate = new Date(x.BillingDate)
        let formatBillingDate = BillingDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        let paymentDate;
        let formatpaymentDate = '';
        if (x.PaymentDate.length > 1) {
            paymentDate = new Date(x.PaymentDate)
            formatpaymentDate = paymentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        }


        return ` <tr>
                                            <td>${x.CustomerID}</td>
                                            <td>${x.FirstName + ' ' + x.LastName}</td>
                                            <td>${x.Phone}</td>
                                            <td>${x.Address}</td>
                                            <td>${x.BillAmount}</td>
                                            <td>${formatBillingDate}</td>
                                            <td>${formatpaymentDate}</td>
                                            <td>${x.IsPaid}</td>
                                            

                                            </td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)
    $('#dataTable').DataTable();
}

getBillList()