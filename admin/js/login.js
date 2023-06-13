async function login() {
    $('#inputUserName').css('border', '')
    $('#inputPassword').css('border', '')

    const userName = $('#inputUserName').val().trim() || ''
    const password = $('#inputPassword').val().trim() || ''

    if (userName.length === 0 || password.length === 0) {
        if (userName.length === 0) {
            $('#inputUserName').css('border', '1px solid red')
        }
        if (password.length === 0) {
            $('#inputPassword').css('border', '1px solid red')
        }
        return false;
    }


    const formData = {
        UserName: userName,
        Password: password
    }

    // console.log(formData)

    const res = await fetchDynamicAPI('EmpLogin', formData)
    if (res[0].Result === 1) {
        setCookie('token', res[0].Token, 1)
        window.location.href = '/admin'
    } else {
        alert('Wrong user name or password!')
    }
}
async function stayLogin() {

}

$('document').ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        return false;
    })

    checkToken();
})

async function checkToken() {
    const token = getCookie('token')
    console.log("🚀 ~ file: login.js:49 ~ checkToken ~ token:", token)

    const res = await fetchDynamicAPI('checkToken', { Token: token })
    if (res.length === 1) {
        window.location.href = '/admin'
    }
}