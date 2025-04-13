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
