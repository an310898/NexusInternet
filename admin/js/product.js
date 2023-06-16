let plan;

async function getAllPlan() {
    plan = await fetchApi('Plans')
    const htmlPlan = plan.map(x => {
        return `<option value="${x.id}">${x.connectionType}</option>`
    }).join('')
    $('#EditConnectionType').html(htmlPlan)
    $('#ConnectionType').html(htmlPlan)


}


async function getProductList() {
    const data = await fetchDynamicAPI('getAllProduct', {})
    console.log("🚀 ~ file: product.js:3 ~ getProductList ~ data:", data)

    const html = data.map(x => {

        return ` <tr>
                                            <td>${x.ProductName}</td>
<td ><div style="width:100px;height:auto"><img style="width:100px;height:100px;object-fit:contain" src="${x.ProductImageUrl}"></div></td>
                                            <td><div  style="min-height:100px;max-height:150px;overflow-y: scroll;">${x.Description}</div></td>
                                            <td>$${x.Price}</td>
                                            <td>${x.Manufacturer}</td>
                                            <td>${x.QuantityInStock}</td>
                                            <td>${x.ConnectionType}</td>
                                            <td><i class="far fa-edit" data-toggle="modal" data-target="#updateProductModal" style="cursor:pointer" onclick='showUpdateProductModel("${x.Id}")'></i></td>


                                            </td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)

    $('#dataTable').DataTable();
}

$('document').ready(function () {
    getProductList()
    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    })
    getAllPlan()


})

async function showUpdateProductModel(productId) {
    const data = await fetchDynamicAPI('getProductInfo', { ProductId: productId })
    console.log("🚀 ~ file: product.js:36 ~ showUpdateProductModel ~ data:", data)

    $('#EditProductName').val(data[0].ProductName)
    $("#EditImageURL").val((data[0].ProductImageUrl))
    $('#EditDescription').val(data[0].Description)
    $('#EditPrice').val(data[0].Price)
    $('#EditManufacturer').val(data[0].Manufacturer)
    $('#EditQuantity').val(data[0].QuantityInStock)
    $('#EditConnectionType').val(data[0].ForPlan)

    $("#btn-edit-product").attr('onclick', `updateProduct(${productId})`)
}

async function updateProduct(productId) {
    const ProductName = $('#EditProductName').val()
    const imageURL = $("#EditImageURL").val();
    const Description = $('#EditDescription').val()
    const Price = $('#EditPrice').val()
    const Manufacturer = $('#EditManufacturer').val()
    const Quantity = $('#EditQuantity').val()
    const ConnectionType = $('#EditConnectionType').val()

    const formData = {
        ProductId: productId,
        ProductName: ProductName,
        ProductImageUrl: imageURL,
        Description: Description,
        Price: Price,
        Manufacturer: Manufacturer,
        QuantityInStock: Quantity,
        ForPlan: ConnectionType
    }
    console.log(formData);

    const res = await fetchDynamicAPI('updateProduct', formData)
    if (res[0].Result === 1) {
        getProductList()
        alert('Edit success!')
        $('#updateProductModal').modal('hide')
    }

}



async function createProduct() {
    const ProductName = $('#ProductName').val()
    const imageURL = $("#ImageURL").val();
    const Description = $('#Description').val()
    const Price = $('#Price').val()
    const Manufacturer = $('#Manufacturer').val()
    const Quantity = $('#Quantity').val()
    const ConnectionType = $('#ConnectionType').val()

    const formData = {
        ProductName: ProductName,
        ProductImageUrl: imageURL,
        Description: Description,
        Price: parseFloat(Price),
        Manufacturer: Manufacturer,
        QuantityInStock: parseInt(Quantity),
        ForPlan: parseInt(ConnectionType)
    }
    console.log("🚀 ~ file: product.js:111 ~ createProduct ~ formData:", formData)


    const res = await fetchDynamicAPI('CreateProduct', formData)
    console.log("🚀 ~ file: product.js:115 ~ createProduct ~ res:", res)
    if (res[0].Result === 1) {
        getProductList()
        alert('Create success!')
        $('#createNewModal').modal('hide')
    }
}
