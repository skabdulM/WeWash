let user;

window.onload = function () {
    user = populateFormFromQueryParams();
    setFormValues(user);
};

function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        name: params.get("name") || "",
        phone: params.get("phone") || "",
        location: params.get("location") || "",
        service: params.get("service") || "",
        time: params.get("time") || ""
    };
}

function setFormValues(user) {
    document.getElementById("name").textContent = user.name;
    document.getElementById("phone").textContent = user.phone;
    document.getElementById("location").textContent = user.location;
    document.getElementById("service").textContent = user.service;
    document.getElementById("time").textContent = user.time;
}
function schedule_service() {
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
        service: user.service,
        time: user.time
    };
    console.log("Sending email...", params);

    if (params.customer_name && params.phone && params.location && params.service && params.time) {
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
