
function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    console.log(params.get("phone"));

    document.getElementById("phone").value = params.get("phone") || "";
    document.getElementById("location").value = params.get("location") || "";
}

// Call function when page loads
window.onload = populateFormFromQueryParams;
