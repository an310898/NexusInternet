
initFn()
function initFn() {
    if (getCookie('token').length === 0) {
        window.location.href = '/admin/login.html'

    } else {
        checkToken()
    }
}
async function checkToken() {
    const token = getCookie('token')

    const res = await fetchDynamicAPI('checkToken', { Token: token })
    if (res.length === 0) {
        window.location.href = '/admin/login.html'
    } else {
        authorization(res[0].RoleName, JSON.parse(res[0].Permission))
        // console.log(res[0])
    }
}

function authorization(role, listPermission) {
    let htmlManage = `<h6 class="collapse-header">${role} Manage:</h6>` + listPermission
        .map(x => {
            return `
        <a class="collapse-item" href="${x.PermissionName.replace(' ', '-')}.html">${x.PermissionName}</a>
        `
        }).join('')

    if (role === 'Admin') {

    }


    $('#manageTable').html(htmlManage)
}


function signOut() {
    deleteCookie("token");

}