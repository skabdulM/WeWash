
const detailsList = document.querySelectorAll("details");

function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

function handleDetailToggle(event) {
    if (!event.target.open) return;

    for (let details of detailsList) {
        if (details !== event.target) {
            details.open = false;
        }
    }
}

function updateDetailsBehavior() {
    if (isMobile()) {
        detailsList.forEach(details => details.removeAttribute("open"));
        detailsList.forEach(details => {
            details.addEventListener("toggle", handleDetailToggle);
        });
    } else {
        detailsList.forEach(details => {
            details.removeEventListener("toggle", handleDetailToggle);
        });
    }
}

updateDetailsBehavior();

window.addEventListener("resize", updateDetailsBehavior);
