async function getAvailableCity() {
    listAvaiableCity = await fetchDynamicAPI("getAvailableCity", {});

    const htmlCityOption = listAvaiableCity
        .map(x => {
            return `
            <option value="${x.Id}">${x.Name}</option>
        `;
        })
        .join("");

    $("#City").html(
        '<option value="0" selected="" disabled="" hidden="">Choose your city</option>' +
        htmlCityOption
    );
    $("#EditCity").html(
        '<option value="0" selected="" disabled="" hidden="">Choose your city</option>' +
        htmlCityOption
    );
}

async function getEmpList() {
    const data = await fetchApi('Employees')

    const html = data.map(x => {
        let joinDate = new Date(x.joiningDate)
        let formatDate = joinDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return ` <tr>
                                            <td>${x.id}</td>
                                            <td>${x.firstName + ' ' + x.lastName}</td>
                                            <td>${x.role.roleName}</td>
                                            <td>${x.phone}</td>
                                            <td>${formatDate}</td>
                                            <td>\$${x.salary}</td>
                                            <td>${x.state}</td>
                                            <td style="display:flex;justify-content: space-around"><i class="far fa-edit" data-toggle="modal" data-target="#editModal" style="cursor:pointer" onclick='editUserForm(${x.id})'></i></td>
                                        </tr>`
    }).join('')

    $('#table-body').html(html)
    $('#dataTable').DataTable();
}
let empRoleList;
async function getAllRole() {
    const data = await fetchApi('Roles')
    empRoleList = data;
    const html = empRoleList.map(x => {
        return `
            <option value=${x.id}>${x.roleName}</option>
        
        `
    }).join('')
    $('#Role').html(html)
    $('#EditRole').html(html)
}

$('document').ready(async function () {
    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    })
    await getEmpList()
    await getAllRole()
    await getAvailableCity()

})


async function createNewEmp() {
    const firstName = $('#FirstName').val().trim();
    const lastName = $('#LastName').val().trim();
    const email = $('#Email').val().trim();
    const phone = $('#Phone').val().trim();
    const birthDay = $('#BirthDay').val().trim();
    const userName = $('#UserName').val().trim();
    const password = $('#Password').val().trim();
    const salary = $('#Salary').val().trim();
    const cityId = $('#City').val();
    const role = $('#Role').val();


    // validate here

    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        salary: salary,
        roleId: role,
        dateOfBirth: birthDay,
        cityId: cityId,
        state: 'Active',
    }

    const result = await fetchApi('Employees', 'POST', formData)
    if (result.id) {
        alert('Create Success')
        getEmpList();
        $('#createNewModal').modal('hide')
    }
}


async function editUserForm(EmpId) {
    $('#editModal').hide()
    const data = await fetchApi(`Employees/${EmpId}`)

    console.log("🚀 ~ file: employee.js:109 ~ editUserForm ~ data:", data)
    const date = new Date(data.dateOfBirth)

    var dateFormat = date.getFullYear() + "-" + ((date.getMonth() + 1).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());



    console.log(dateFormat);
    $('#EditFirstName').val(`${data.firstName}`)
    $('#EditLastName').val(`${data.lastName}`)
    $('#EditEmail').val(`${data.email}`)
    $('#EditPhone').val(`${data.phone}`)
    $('#EditBirthDay').val(`${dateFormat}`)
    $('#EditUserName').val(`${data.username}`)
    $('#EditPassword').val(`${data.password}`)
    $('#EditSalary').val(`${data.salary}`)
    $('#EditRole').val(`${data.roleId}`)
    $('#EditCity').val(`${data.cityId}`)
    $('#EditState').val(`${data.state}`)
    $('#btn-edit').attr('onclick', `editEmp(${data.id})`)
    $('#editModal').show()

}


async function editEmp(empId) {
    const FirstName = $('#EditFirstName').val()
    const LastName = $('#EditLastName').val()
    const Email = $('#EditEmail').val()
    const Phone = $('#EditPhone').val()
    const birthday = $('#EditBirthDay').val()
    const UserName = $('#EditUserName').val()
    const Password = $('#EditPassword').val()
    const Salary = $('#EditSalary').val()
    const Role = $('#EditRole').val()
    const cityId = $('#EditCity').val()
    const State = $('#EditState').val()

    const formData = {
        id: empId,
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        phone: Phone,
        userName: UserName,
        password: Password,
        salary: Salary,
        roleId: parseInt(Role),
        dateOfBirth: birthday,
        cityId: cityId,
        state: State
    }

    const res = await fetchDynamicAPI('editEmp', formData)
    if (res[0].Result === 1) {
        alert('Update Success')
        getEmpList();
        $('#editModal').modal('hide')
    }
}