
const token = getCookie('token')

const href = window.location.href
const paramWebPageUrl = href.substring(href.indexOf('admin/') + 6, href.indexOf('.html')).trim().replace('-', ' ')
// console.log("🚀 ~ file: authenticate.js:6 ~ paramWebPageUrl:", paramWebPageUrl)

const initListPermission = ["Employee", "Customer", "Bill", "Order", "Product", "Retail Store", "Available City", "Feedback"];


initFn()
async function initFn() {
    if (getCookie('token').length === 0) {
        window.location.href = '/admin/login.html'

    } else {
        await checkToken()
        await checkPermisson()
    }
}
async function checkToken() {

    const res = await fetchDynamicAPI('checkToken', { Token: token })

    if (res.length === 0) {
        window.location.href = '/admin/login.html'
    } else {
        $('#empName').text(`Hello ${res[0].FirstName} ${res[0].LastName}`)

        if (res[0].RoleName === 'Admin') {
            const html = `
            <hr class="sidebar-divider">
            <div class="sidebar-heading">
                Setting
            </div>
            <li class="nav-item">
                <a class="nav-link" href="authorize.html">
                    <i class="fas fa-users-cog"></i>
                    <span>Authorization Setting</span></a>
            </li>`

            $('#authorizeSetting').html(html)

        }


        if (paramWebPageUrl === 'authorize') {
            if (res[0].RoleName !== 'Admin') {
                alert(`You don't have Permisson to access ${paramWebPageUrl}`)
                window.location.href = '/admin'
            }
        }
        if (JSON.parse(res[0].Permission) === null) {
            $('#manageTable').html(`<div style="text-align:center">You don't have any permisson <br> Contact admin for permisson</div>`)
            return
        }
        authorization(res[0].RoleName, JSON.parse(res[0].Permission))


    }
}

function authorization(role, listPermission) {

    let htmlManage = `<h6 class="collapse-header">${role} Manage:</h6>` + listPermission
        .map(x => {
            return `
        <a class="collapse-item" href="${x.PermissionName.replace(' ', '-')}.html">${x.PermissionName}</a>
        `
        }).join('')



    $('#manageTable').html(htmlManage)
}

async function checkPermisson() {

    for (let i = 0; i < initListPermission.length; i++) {
        if (initListPermission[i].toLowerCase() === paramWebPageUrl.toLowerCase()) {
            const formData = {
                Token: token,
                Permisson: paramWebPageUrl
            }
            const res = await fetchDynamicAPI('CheckPermission', formData)
            if (res[0].Result === 0) {
                window.location.href = '/admin'
                alert(`You don't have Permisson to access ${paramWebPageUrl}`)
            }
        }
    }
}

function signOut() {
    deleteCookie("token");
    window.location.href = '/admin/login.html'

}