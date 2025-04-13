async function fetch_json_data(requested_location) {
    try {
        const response = await fetch(`./assets/json/${requested_location}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { data, location_used: requested_location };
    } catch (error) {
        // If the request was not for the default json, try fetching the default
        if (requested_location === 'default') {
            throw error;
        }
        console.warn(`Failed to load ${requested_location}.json. Trying default...`);
        return fetch_json_data('default');
    }
}
function update_service_list(categories) {
    const service_lists_container = document.querySelector('.service-list-left');
    service_lists_container.innerHTML = ''; // Clear existing services

    const pdfDownloadHTML = `
      <a
        href="https://drive.google.com/uc?export=download&id=1UAuUL3ww8LFoFYVyXSgCWGncdJ4dPMEV"
        class="d-flex justify-content-start mt-4 "
        style="color:var(--color-secondary);"
        title="Download PDF"
      >
        <!-- Option 1: Use an SVG icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#00449d"
          class="bi bi-filetype-pdf"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"
          />
        </svg>
      <p>  Download complete rate sheet
      </p></a>`;

    categories.forEach(category => {
        const category_element = document.createElement('div');
        category_element.classList.add('service-category');

        const category_title = document.createElement('h3');
        category_title.classList.add('category-title');
        category_title.textContent = category.name;
        category_element.appendChild(category_title);

        const items_list = document.createElement('ul');
        items_list.classList.add('category-items');

        category.items.forEach(item => {
            const item_element = document.createElement('li');

            const item_name = document.createElement('span');
            item_name.classList.add('item-name');
            item_name.textContent = item.name;
            item_element.appendChild(item_name);

            const item_price = document.createElement('span');
            item_price.classList.add('item-price');
            item_price.textContent = (item.cleaning === null)
                ? '-'
                : (item.cleaning !== "***" ? `₹${item.cleaning}` : item.cleaning);

            item_element.appendChild(item_price);
            items_list.appendChild(item_element);
        });

        category_element.appendChild(items_list);
        service_lists_container.appendChild(category_element);
    });

    document.querySelector('.service-lists').insertAdjacentHTML('afterend', pdfDownloadHTML);
}


function update_title(serviceKey) {
    const service_mappings = {
        "washing": "Washing / Dry Cleaning",
        "shoe": "Shoe / Bag Cleaning",
        "steam": "Steam Pressing",
        "home": "Home Deep Cleaning",
        "sofa": "Sofa Cleaning",
        "carpet": "Carpet Cleaning",
        "leather": "Leather Service",
        "whitening": "Whitening / Starching",
        "moth": "Moth / Mite Treatment"
    };

    const section_title = document.querySelector('.service-section-hero-title');
    const displayTitle = service_mappings[serviceKey] || service_mappings["washing"];

    section_title.textContent = displayTitle;
}

async function loadData(requested_location) {
    try {
        const { data } = await fetch_json_data(requested_location);
        if (data.categories) {
            update_service_list(data.categories);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const service_type = urlParams.get('service') || 'washing';

    loadData('default');
    update_title(service_type);

    const locationSelect = document.getElementById('location');
    locationSelect.addEventListener('change', () => {
        const selectedLocation = locationSelect.value;
        loadData(selectedLocation);
    });
});
function adjustWidth() {
    const otherElement = document.querySelector('.service-list-left');

    const elementToAdjust = document.getElementById('location');

    elementToAdjust.style.width = otherElement.offsetWidth + 'px';
}
// Call the function on page load and on window resize
window.addEventListener('resize', adjustWidth);
window.onload = adjustWidth;
