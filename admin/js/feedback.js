async function getAllFeedback() {
    const data = await fetchDynamicAPI('getAllFeedback', {})

    const html = data.map(x => {
        let createDate = new Date(x.CreatedDate)
        let formatCreateDate = createDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })



        return ` <tr>
                                            <td>${x.Id}</td>
                                            <td>${x.FirstName + ' ' + x.LastName}</td>
                                            <td>${x.Phone}</td>
                                            <td>${x.Address}</td>
                                            <td>${x.Subject}</td>
                                            <td>${x.Comments}</td>
                                            <td>${formatCreateDate}</td>
                                            

                                            </td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)
    $('#dataTable').DataTable();
}

$('document').ready(async function () {
    await getAvailableCityList()

})
