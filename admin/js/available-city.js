
async function getAvailableCityList() {
    const data = await fetchDynamicAPI('getAvailableCityList', {})
    // console.log("🚀 ~ file: product.js:3 ~ getProductList ~ data:", data)

    const html = data.map(x => {

        return ` <tr>
                                                <td>${x.Id}</td>
                                                <td>${x.Name}</td>
                                                <td>${x.PostalCode}</td>
                                                <td><i class="far fa-edit" data-toggle="modal" data-target="#updateModal" style="cursor:pointer" onclick='showUpdateModel(${x.Id})'></i></td>

                                                </td>
                                            </tr>`
    }).join('')

    $('#table-body').html(html)

    $('#dataTable').DataTable();
}


$('document').ready(async function () {
    await getAvailableCityList()
    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    })
})



async function createNew() {
    const CityName = $('#CityName').val().trim() || ''
    const PostalCode = $('#PostalCode').val().trim() || ''

    const formData = {
        CityName: CityName,
        PostalCode: PostalCode
    }
    const res = await fetchDynamicAPI('addNewCity', formData)
    // console.log("🚀 ~ file: retail-store.js:82 ~ createNew ~ res:", res)

    if (res[0].Result === 1) {
        alert('Create Success!')
        $('#createNewModal').modal('hide')
        getAvailableCityList()
    }
}

async function showUpdateModel(cityId) {

    const data = await fetchDynamicAPI('getCityInfo', { cityId: parseInt(cityId) })
    // console.log("🚀 ~ file: avaiable-city.js:55 ~ showUpdateModel ~ data:", data)

    $('#EditCityName').val(data[0].Name)
    $('#EditPostalCode').val(data[0].PostalCode)
    $('#btn-edit').attr('onclick', `updateCity(${data[0].Id})`)
}

async function updateCity(cityId) {
    const CityName = $('#EditCityName').val().trim() || ''
    const PostalCode = $('#EditPostalCode').val().trim() || ''

    const formData = {
        Id: parseInt(cityId),
        CityName: CityName,
        PostalCode: PostalCode
    }
    const res = await fetchDynamicAPI('updateCity', formData)
    // console.log("🚀 ~ file: retail-store.js:82 ~ createNew ~ res:", res)

    if (res[0].Result === 1) {
        alert('Edit Success!')
        $('#updateModal').modal('hide')
        getAvailableCityList()
    }
}