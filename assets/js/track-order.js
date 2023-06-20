$('document').ready(function () {
    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    })
})


async function trackOrder() {
    $('#alert-input').text('')

    const input = $('#inputTrack').val().trim()

    if (input.length === 0) {
        $('#alert-input').text('Please input your customer id or phone number')
        return
    }
    let data
    if (input[0] === 'B' || input[0] === 'L' || input[0] === 'D') {

        const formData = {
            Customer: input,
            IsPhoneNumber: 0
        }

        data = await fetchDynamicAPI('getOrderDetailByCustomer', formData)

    } else {

        const formData = {
            Customer: input,
            IsPhoneNumber: 1
        }
        data = await fetchDynamicAPI('getOrderDetailByCustomer', formData)
        if (data.length === 0) {
            $('#alert-input').text('Wrong customer id or phone number')
            return
        }

    }
    if (data.length === 0) {
        $('#alert-input').text('Wrong customer id or phone number')
        return
    }
    // console.log("🚀 ~ file: track-order.js:27 ~ trackOrder ~ data:", data)
    const html = data.map(x => {
        const formatDate = new Date(x.OrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return `
            <div class="card">
                                <div class="card-header d-flex card-header-content" data-toggle="collapse" data-target="#Order${x.OrderId}" aria-expanded="true" aria-controls="collapseOne" >
                                    <h2 class="mb-0">
                                        <button class="btn btn-link" type="button" >
                                            ${x.CustomerID}
                                        </button>
                                    </h2>
                                    <div>
                                        Status:Pending
                                    </div>
                                </div>
                                <div id="Order${x.OrderId}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div class="card-body" id="order-info">
                                        <div class="form-group row">
                                            <div class="col-sm-6 mb-3 mb-sm-0">
                                                <div class="d-flex">
                                                    <label>First Name:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.FirstName}</div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="d-flex">
                                                    <label>Last Name:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.LastName}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="d-flex">
                                                <label>Phone:</label>
                                                <div class="flex-grow-1 text-center info-border-bottom">${x.Phone}</div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex"><label>Address:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.Address}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex"><label>Connection Type:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.ConnectionType}</div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex"><label>Connection Option:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.OptionName}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex"><label>Connection Detail:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.Description}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex">
                                                    <label>Product :</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${x.ProductName}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div>
                                                <div class="d-flex"><label>Order Date:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">${formatDate}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-sm-6 mb-3 mb-sm-0">
                                                <div class="d-flex"><label>One Time Charge:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom">$${x.BillAmount}</div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="d-flex"><label>Motnhly Charge:</label>
                                                    <div class="flex-grow-1 text-center info-border-bottom"> $${(x.Price + (x.Price * 12.5 / 100)).toFixed(3)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="w-100 d-flex mt-10" style="justify-content: flex-end;">
                                            <button class="btn" style="padding:10px 24px" onclick="showUpdateForm(${x.OrderId})"  data-toggle="modal" data-target="#feedbackModal">Feed Back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
        `
    }).join('')

    $('#accordionExample').html(html)
}

function showUpdateForm(orderId) {
    $('#sendFeedbackBtn').attr('onclick', `sendFeedback(${orderId})`)
}

async function sendFeedback(orderId) {
    const subject = $('#subject').val().trim();
    const message = $('#message').val().trim();

    if (message.length > 1000 || message.length === 0 || subject.length === 0) {
        return
    }

    const formData = { OrderId: orderId, Subject: subject, Comments: message }
    // console.log(formData);

    const res = await fetchDynamicAPI('CustomerFeedbackByOrderId', formData)
    if (res[0].Result === 1) {
        $("#feedbackModal").modal('hide')
        $('#alertMessage').text('Feedback Complete!')
        $("#modalAlert").modal('show')
    } else {
        $("#feedbackModal").modal('hide')
        $('#alertMessage').html('Feedback Failed!<br>Try again later')
        $("#modalAlert").modal('show')

    }

}