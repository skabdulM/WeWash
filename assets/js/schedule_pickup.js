window.onload = populateFormFromQueryParams;

document.getElementById("scheduleForm").addEventListener("submit", function (event) {
    schedule_service(event);
});

function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("name").value = params.get("name") || "";
    document.getElementById("phone").value = params.get("phone") || "";
    document.getElementById("location").value = params.get("location") || "";
}

function schedule_service(event) {
    event.preventDefault();
    user = {
        name: event.target.name.value || "",
        phone: event.target.phone.value || "",
        location: event.target.location.value || "",
        address: event.target.address.value || "",
    }
    sendEmail(user);
}

(function () {
    emailjs.init("BziIbgu2tsfqyMdtp");
})();

function sendEmail(user) {
    let params = {
        to_email: "shannan96@gmail.com",
        // to_email: "abdulmannan8334@gmail.com",
        customer_name: user.name,
        phone: user.phone,
        location: user.location,
        address: user.address
    };

    if (params.customer_name && params.phone && params.location) {
        console.log("Sending email...", params);

        emailjs.send("service_f8wejru", "template_7s58pki", params)
            .then(function (response) {
                console.log("Email sent successfully!", response);
                window.location.href = "./schedule_submitted.html";

            }, function (error) {
                alert("Failed to send email:", error);
            });
    }
}
