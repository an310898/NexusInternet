
async function getRetailStoreList() {
    const data = await fetchDynamicAPI('getAllRetailStore', {})
    console.log("🚀 ~ file: product.js:3 ~ getProductList ~ data:", data)

    const html = data.map(x => {

        return ` <tr>
                                                <td>${x.StoreName}</td>
                                                <td>${x.Address}</td>
                                                <td>${x.Name}</td>
                                                <td>${x.Phone}</td>
                                                <td>${x.State}</td>
                                                <td>${x.FirstName} ${x.LastName}</td>
                                                <td><i class="far fa-edit" data-toggle="modal" data-target="#updateModal" style="cursor:pointer" onclick='showUpdateModel(${x.StoreID})'></i></td>


                                                </td>
                                            </tr>`
    }).join('')

    $('#table-body').html(html)

    $('#dataTable').DataTable();
}


$('document').ready(function () {
    getAvailableCity()
    getRetailStoreList()
    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    })
})

async function getAvailableCity() {
    const data = await fetchDynamicAPI("getAvailableCity", {});

    const htmlCityOption = data
        .map(x => {
            return `
            <option value="${x.Id}">${x.Name}</option>
        `;
        })
        .join("");

    $("#City").html(
        '<option value="0" selected="" disabled="" hidden="">Choose city</option>' +
        htmlCityOption
    ); $("#EditCity").html(

        htmlCityOption
    );
}

async function getManagerByCity() {
    const cityId = parseInt($('#City').val())
    const data = await fetchDynamicAPI('getManagerByCityId', { CityId: cityId })

    const html = data.map(x => {
        return `
            <option value="${x.Id}">${x.FullName}</option>
        `
    })
    $('#Manager').html(html)
}
async function getManagerByCityForEdit() {
    const cityId = parseInt($('#EditCity').val())

    const data = await fetchDynamicAPI('getManagerByCityId', { CityId: cityId })

    const html = data.map(x => {
        return `
            <option value="${x.Id}">${x.FullName}</option>
        `
    })
    $('#EditManager').html(html)
}

async function createNew() {
    const storeName = $('#StoreName').val().trim() || ''
    const address = $('#Address').val().trim() || ''
    const hotline = $('#Hotline').val().trim() || ''
    const cityId = $('#City').val()
    const managerId = $('#Manager').val()

    const formData = {
        StoreName: storeName,
        Address: address,
        Phone: hotline,
        CityId: cityId,
        ManagerId: managerId,
    }
    const res = await fetchDynamicAPI('addNewStore', formData)
    console.log("🚀 ~ file: retail-store.js:82 ~ createNew ~ res:", res)

    if (res[0].Result === 1) {
        alert('Create Success!')
        $('#createNewModal').modal('hide')
        getRetailStoreList()
    }
}

async function showUpdateModel(storeId) {

    const data = await fetchDynamicAPI('getStoreInfo', { StoreId: parseInt(storeId) })
    console.log("🚀 ~ file: retail-store.js:105 ~ showUpdateModel ~ data:", data)
    $('#EditStoreName').val(data[0].StoreName)
    $('#EditAddress').val(data[0].Address)
    $('#EditHotline').val(data[0].Phone)
    $('#EditCity').val(data[0].CityId)
    await getManagerByCityForEdit()
    $('#EditManager').val(data[0].ManagerId)
    $('#btn-edit').attr('onclick', `updateStore(${data[0].StoreID})`)
}

async function updateStore(storeId) {
    const storeName = $('#EditStoreName').val().trim() || ''
    const address = $('#EditAddress').val().trim() || ''
    const hotline = $('#EditHotline').val().trim() || ''
    const cityId = $('#EditCity').val()
    const managerId = $('#EditManager').val()

    const formData = {
        StoreID: storeId,
        StoreName: storeName,
        Address: address,
        Phone: hotline,
        CityId: cityId,
        ManagerId: managerId,
    }
    const res = await fetchDynamicAPI('updateStore', formData)
    console.log("🚀 ~ file: retail-store.js:82 ~ createNew ~ res:", res)

    if (res[0].Result === 1) {
        alert('Edit Success!')
        $('#updateModal').modal('hide')
        getRetailStoreList()
    }
}