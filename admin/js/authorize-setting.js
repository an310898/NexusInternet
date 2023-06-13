async function getRoleList() {
    const res = await fetchApi('Roles')

    const html = res.map(x => {
        return `
        <tr>
            <td>${x.roleName}</td>
            <td class="text-center"><i class="far fa-edit" data-toggle="modal" data-target="#roleAuthModel" style="cursor:pointer" onclick='editRoleForm(${x.id})'></i></td>
        </tr>
        
    `
    }).join('')
    // console.log("🚀 ~ file: authorize-setting.js:9 ~ html ~ html:", html)

    $('#table-body').html(html)
}

function initfn() {
    $('#authorEditForm').submit(function (e) {
        e.preventDefault();
        return false;
    })
    getRoleList()
}

initfn();

async function editRoleForm(roleId) {
    $('#authorEditForm').html(` <div class="modal-body">

                        <div class="form-group" style="display: flex;">
                            <label for="Employee" style="width: 250px;">Employee</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="Employee" value="1">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="Customer" style="width: 250px;">Customer</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="Customer" value="2">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="Bill" style="width: 250px;">Bill</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="Bill" value="3">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="Order" style="width: 250px;">Order</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="Order" value="4">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="Product" style="width: 250px;">Product</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="Product" value="5">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="RetailStore" style="width: 250px;">Retail Store</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="RetailStore" value="6">
                        </div>
                        <div class="form-group" style="display: flex;">
                            <label for="AvaiableCity" style="width: 250px;">Avaiable City</label><input type="checkbox" class="form-control form-control-user" style="width: 30px;height: 30px;" id="AvaiableCity" value="7">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" id="btn-edit" type="submit" onclick="updateAuth(${roleId})">Update</button>
                    </div>`)

    const data = await fetchDynamicAPI('getRoleAuth', { RoleId: roleId })

    // console.log(data);

    document.querySelectorAll("input[type='checkbox']").forEach(x => {
        data.map(y => {
            if (parseInt(x.getAttribute('value')) === y.AuthorizationId) {
                x.setAttribute('checked', '')
                return;
            }
        })
    })
}


async function updateAuth(roleId) {
    let arrRole = []
    document.querySelectorAll("input[type='checkbox']:checked").forEach(x => {
        arrRole.push(x.value)
    })

    const formData = { RoleId: roleId, arrRole: arrRole.join(',') }

    const res = await fetchDynamicAPI('updateRoleAuth', formData)

    if (res[0].result === 1) {
        alert('Update success!')
        $('#roleAuthModel').modal('hide')
    }
}