async function fetch_json_data(requested_location) {
    try {
        const response = await fetch(`./assets/json/${requested_location}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { data, location_used: requested_location };
    } catch (error) {
        if (requested_location === 'default') {
            throw error;
        }
        console.warn(`Failed to load ${requested_location}.json. Trying default...`);
        return fetch_json_data('default');
    }
}

function update_service_list(categories) {
    const service_lists_container = document.querySelector('.service-list-left');
    service_lists_container.innerHTML = ''; // Clear existing content

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
            item_price.textContent = `₹${item.cleaning}`;
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
    const displayTitle = service_mappings[serviceKey]
        || service_mappings["washing"];

    section_title.textContent = displayTitle;
}
(async () => {
    const search_params = new URLSearchParams(window.location.search);
    const requested_location = search_params.get('location') || 'default';
    const service_type = search_params.get('service');

    try {
        const { data, location_used } = await fetch_json_data(requested_location);

        if (requested_location !== location_used) {
            const new_search_params = new URLSearchParams(search_params);
            new_search_params.set('location', location_used);
            history.replaceState({}, '', `${window.location.pathname}?${new_search_params.toString()}`);
        }
        if (data && data.title && data.categories) {
            document.querySelector('.service-section-hero-title').textContent = data.title;
            update_service_list(data.categories);
            update_title(service_type);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
})();
document.addEventListener("DOMContentLoaded", () => {
    // Toggle active class on tag click
    document.querySelectorAll(".service-tags .tag").forEach(tag => {
        tag.addEventListener("click", function () {
            this.classList.toggle("active");
            filterServiceList();
        });
    });

    function filterServiceList() {
        // Get an array of all active tag texts in lowercase
        const activeTags = Array.from(document.querySelectorAll(".service-tags .tag.active"))
            .map(tag => tag.textContent.trim().toLowerCase());
        console.log(activeTags);

        // If no tags are selected, show everything
        if (activeTags.length === 0) {
            document.querySelectorAll(".service-category").forEach(category => {
                category.style.display = "block";
                category.querySelectorAll(".category-items li").forEach(item => {
                    item.style.display = "flex";
                });
            });
            return;
        }

        // Otherwise, filter categories and items
        document.querySelectorAll(".service-category").forEach(category => {
            const categoryTitle = category.querySelector(".category-title").textContent.toLowerCase();
            // Check if the category title matches any active tag
            const categoryMatches = activeTags.some(tag => categoryTitle.includes(tag));

            let anyItemMatches = false;
            // Iterate over each item in this category
            category.querySelectorAll(".category-items li").forEach(item => {
                const itemName = item.querySelector(".item-name").textContent.toLowerCase();
                // Check if the item name matches any active tag
                console.log(item);

                const itemMatches = activeTags.some(tag => itemName.includes(tag));

                // If the category title matches, show all items; else, only show matching items.
                if (categoryMatches) {
                    item.style.display = "flex";
                    anyItemMatches = true;
                } else {
                    item.style.display = itemMatches ? "flex" : "none";
                    if (itemMatches) anyItemMatches = true;
                }
            });

            // Show the category if the title or at least one item matches; otherwise, hide it.
            if (categoryMatches || anyItemMatches) {
                category.style.display = "block";
            } else {
                category.style.display = "none";
            }
        });
    }
});
