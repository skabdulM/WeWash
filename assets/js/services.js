function redirect_to_service(service_type) {
    const selectElement = document.getElementById('service_location');
    const selectedLocation = selectElement.value;

    window.location.href = `./services_and_pricing.html?service=${service_type}&location=${selectedLocation}`;
}
