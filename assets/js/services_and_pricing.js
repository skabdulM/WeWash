async function fetch_json_data() {
    try {
        const response = await fetch('./assets/json/data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

function updateServiceList(categories) {
    const serviceListsContainer = document.querySelector('.service-list-left');
    serviceListsContainer.innerHTML = ''; // Clear existing content

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('service-category');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = category.name;
        categoryElement.appendChild(categoryTitle);

        const itemsList = document.createElement('ul');
        itemsList.classList.add('category-items');

        category.items.forEach(item => {
            const itemElement = document.createElement('li');

            const itemName = document.createElement('span');
            itemName.classList.add('item-name');
            itemName.textContent = item.name;
            itemElement.appendChild(itemName);

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('item-price');
            itemPrice.textContent = `₹${item.cleaning}`;
            itemElement.appendChild(itemPrice);

            itemsList.appendChild(itemElement);
        });

        categoryElement.appendChild(itemsList);
        serviceListsContainer.appendChild(categoryElement);
    });
}

(async () => {
    const data = await fetch_json_data();
    if (data && data.title && data.categories) {
        document.querySelector('.service-section-hero-title').textContent = data.title;
        updateServiceList(data.categories);
    }
})();
