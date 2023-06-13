async function getBillList() {
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
    $('#dataTable').DataTable();
}