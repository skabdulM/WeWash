function selectService(element) {
    document.querySelectorAll(".service").forEach(svc => svc.classList.remove("active"));
    element.classList.add("active");
}


function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const phone = params.get("phone") || "";
    const location = params.get("location") || "";
    const customer_name = params.get("name") || "";

    return { customer_name, phone, location }
}


function getSelectedService() {
    let selectedService = document.querySelector(".service.active");
    const { customer_name, phone, location } = populateFormFromQueryParams()
    if (selectedService && customer_name && phone && location) {
        let serviceName = selectedService.getAttribute("data-service");
        const queryParams = new URLSearchParams({ name: customer_name, phone, location, service: serviceName }).toString();
        window.location.href = `./schedule_step3.html?${queryParams}`;
    }
}
