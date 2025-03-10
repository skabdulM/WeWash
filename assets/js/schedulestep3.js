function createPicker(elementId, values) {
    const picker = document.getElementById(elementId);
    let items = [...values, ...values, ...values]; // Duplicate items for seamless loop

    items.forEach((val, index) => {
        const div = document.createElement("div");
        div.textContent = val;
        if (index === values.length) div.classList.add("active"); // Center one as default
        picker.appendChild(div);
    });

    // Set default scroll position (middle)
    let itemHeight = picker.children[0].offsetHeight;
    picker.scrollTop = itemHeight * values.length;

    // Handle looping effect
    picker.addEventListener("scroll", function () {
        if (picker.scrollTop < itemHeight) {
            picker.scrollTop = itemHeight * values.length; // Reset to bottom
        } else if (picker.scrollTop > itemHeight * (items.length - values.length)) {
            picker.scrollTop = itemHeight * values.length; // Reset to top
        }

        // Highlight active item
        let closest = Math.round(picker.scrollTop / itemHeight);
        picker.querySelectorAll("div").forEach(div => div.classList.remove("active"));
        picker.children[closest].classList.add("active");
    });
}

createPicker("hours", ["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]);
createPicker("minutes", ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]);
createPicker("ampm", ["AM", "PM"]);

function getSelectedTime() {
    let hour = document.querySelector("#hours .active")?.textContent;
    let minute = document.querySelector("#minutes .active")?.textContent;
    let ampm = document.querySelector("#ampm .active")?.textContent;
    const { customer_name, phone, location, service } = populateFormFromQueryParams()

    if (hour && minute && ampm && customer_name && phone && location && service) {
        let selectedTime = `${hour}:${minute} ${ampm}`;
        const queryParams = new URLSearchParams({ name: customer_name, phone, location, service, time: selectedTime }).toString();
        window.location.href = `./schedule_step4.html?${queryParams}`;
    }
}

function populateFormFromQueryParams() {
    const params = new URLSearchParams(window.location.search);

    const phone = params.get("phone") || "";
    const location = params.get("location") || "";
    const customer_name = params.get("name") || "";
    const service = params.get("service") || "";

    return { customer_name, phone, location, service }
}
