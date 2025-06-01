// Configuration and state management
const CONFIG = {
    hours: '9:00 AM to 9:00 PM',
    phone: '+91 98765-43210',
    email: 'info@wewash.com',
    locations: ['Bandra', 'JVPD', 'Khar', 'Santacruz', 'Versova', 'Mira-Bhayandar']
};

// Load pricing data
let PRICES_DATA = null;

async function loadPriceData() {
    try {
        const response = await fetch('./assets/json/default.json');
        PRICES_DATA = await response.json();
    } catch (error) {
        console.error('Error loading price data:', error);
    }
}

class Chatbot {
    constructor() {
        this.context = 'main';
        this.lastQuestion = null;
        this.selectedLocation = 'default';
        this.selectedCategory = null;
        loadPriceData(); // Load price data when chatbot is initialized
    }

    async handleUserInput(input, type = 'text') {
        const text = input.toLowerCase();

        // Handle main menu request
        if (text.includes('menu') || text.includes('start over')) {
            return this.showMainMenu();
        }

        // Handle based on current context
        switch (this.context) {
            case 'pricing':
                return this.handlePricingContext(text);
            case 'location':
                return this.handleLocationContext(text);
            case 'timing':
                return this.handleTimingContext(text);
            case 'contact':
                return this.handleContactContext(text);
            default:
                return this.handleMainContext(text);
        }
    }

    handleButtonClick(option) {
        switch (option) {
            case 'Shop Timings':
                this.context = 'timing';
                return {
                    message: `⏰ Our shops are open ${CONFIG.hours}, all days of the week!`,
                    options: ['Holiday Hours', 'Book a Pickup', 'Main Menu']
                }; case 'Check Prices':
                this.context = 'pricing';
                this.selectedCategory = null;
                return this.handlePricingContext('');

            case 'Check Other Prices':
                this.context = 'pricing';
                this.selectedCategory = null;
                return this.handlePricingContext('');

            case 'Select Different Category':
                this.selectedCategory = null;
                return this.handlePricingContext('');

            case 'Shop Address':
                this.context = 'location';
                return {
                    message: 'Please select your preferred location:',
                    options: [...CONFIG.locations, 'Main Menu']
                };

            case 'Contact Information':
                this.context = 'contact';
                return {
                    message: `📞 Phone: ${CONFIG.phone}\n📧 Email: ${CONFIG.email}`,
                    options: ['Book a Pickup', 'View Location', 'Main Menu']
                };

            case 'Book a Pickup':
            case 'Schedule Pickup':
                window.location.href = 'schedule_pickup.html';
                return null;

            case 'Main Menu':
                return this.showMainMenu(); default:
                if (CONFIG.locations.includes(option)) {
                    return this.showLocationDetails(option);
                }

                // Handle category selection
                if (this.context === 'pricing') {
                    // Check if it's a category name
                    const category = PRICES_DATA?.categories?.find(cat =>
                        cat.name === option
                    );

                    if (category) {
                        this.selectedCategory = category;
                        return {
                            message: `You selected ${category.name}. What item would you like to know the price for?`,
                            options: [...category.items.map(item => item.name), 'Select Different Category', 'Main Menu']
                        };
                    }

                    // Check if it's an item name from the selected category
                    if (this.selectedCategory) {
                        const item = this.selectedCategory.items.find(item =>
                            item.name === option
                        );

                        if (item) {
                            const priceMessage = this.formatItemPrice(item);
                            this.selectedCategory = null; // Reset for next query
                            return {
                                message: priceMessage,
                                options: ['Check Other Prices', 'Book a Pickup', 'Main Menu']
                            };
                        }
                    }
                }

                return this.showMainMenu();
        }
    }

    handlePricingContext(text) {
        // If no category is selected yet, handle category selection
        if (!this.selectedCategory) {
            // Check if the text matches any category name
            const category = PRICES_DATA?.categories?.find(cat =>
                cat.name?.toLowerCase() === text.toLowerCase()
            );

            if (category) {
                this.selectedCategory = category;
                return {
                    message: `You selected ${category.name}. What item would you like to know the price for?`,
                    options: [...category.items.map(item => item.name), 'Select Different Category', 'Main Menu']
                };
            }

            // If no category matched, show category list
            return {
                message: 'Please select a category:',
                options: [
                    ...(PRICES_DATA?.categories?.map(cat => cat.name) || []),
                    'Main Menu'
                ]
            };
        }

        // If category is selected, handle item selection
        if (text === 'select different category') {
            this.selectedCategory = null;
            return this.handlePricingContext('');
        }

        // Check if the text matches any item in the selected category
        const item = this.selectedCategory.items.find(item =>
            item.name?.toLowerCase() === text.toLowerCase()
        );

        if (item) {
            const priceMessage = this.formatItemPrice(item);
            this.selectedCategory = null; // Reset for next query
            return {
                message: priceMessage,
                options: ['Check Other Prices', 'Book a Pickup', 'Main Menu']
            };
        }

        return {
            message: 'Please select an item:',
            options: [...this.selectedCategory.items.map(item => item.name), 'Select Different Category', 'Main Menu']
        };
    }

    formatItemPrice(item) {
        let message = `Price for ${item.name}:\n`;
        if (item.cleaning && item.cleaning !== '***') {
            message += `Cleaning: ₹${item.cleaning}\n`;
        }
        if (item.ironing) {
            message += `Ironing: ₹${item.ironing}`;
        }
        if (item.cleaning === '***') {
            message += `\nPlease contact us for cleaning price.`;
        }
        if (!item.ironing && item.cleaning === '***') {
            message += `\nPlease contact us for pricing details.`;
        }
        return message;
    }

    handleLocationContext(text) {
        const location = CONFIG.locations.find(loc => text.includes(loc.toLowerCase()));

        if (location) {
            return this.showLocationDetails(location);
        }

        return {
            message: 'Select a location to know more details:',
            options: [...CONFIG.locations, 'Main Menu']
        };
    }

    handleTimingContext(text) {
        if (text.includes('holiday') || text.includes('sunday')) {
            return {
                message: `Yes, we're open on all holidays!\nTimings: ${CONFIG.hours}`,
                options: ['Book a Pickup', 'View Location', 'Main Menu']
            };
        }

        return {
            message: `⏰ Our timings:\nAll days: ${CONFIG.hours}\n(Including holidays!)`,
            options: ['Holiday Hours', 'Book a Pickup', 'Main Menu']
        };
    }

    handleContactContext(text) {
        if (text.includes('email')) {
            return {
                message: `📧 Email us at: ${CONFIG.email}`,
                options: ['Phone Number', 'Book Pickup', 'Main Menu']
            };
        }

        return {
            message: `📞 Call us at: ${CONFIG.phone}\n📧 Email: ${CONFIG.email}`,
            options: ['Book a Pickup', 'View Location', 'Main Menu']
        };
    }

    handleMainContext(text) {
        if (text.includes('price') || text.includes('cost')) {
            this.context = 'pricing';
            return this.handlePricingContext(text);
        }

        if (text.includes('location') || text.includes('address')) {
            this.context = 'location';
            return this.handleLocationContext(text);
        }

        if (text.includes('time') || text.includes('hour') || text.includes('open')) {
            this.context = 'timing';
            return this.handleTimingContext(text);
        }

        if (text.includes('contact') || text.includes('phone') || text.includes('email')) {
            this.context = 'contact';
            return this.handleContactContext(text);
        }

        return this.showMainMenu();
    }

    showMainMenu() {
        this.context = 'main';
        return {
            message: '👋 How can I help you today?',
            options: [
                'Shop Timings',
                'Check Prices',
                'Shop Address',
                'Contact Information'
            ]
        };
    }

    showLocationDetails(location) {
        return {
            message: `${location} Branch:\n📍 Address: 123 ${location} Road, Mumbai\n📞 Contact: ${CONFIG.phone}\n⏰ Timings: ${CONFIG.hours}`,
            options: ['Check Prices', 'Book a Pickup', 'Other Locations', 'Main Menu']
        };
    }
}

// UI Setup
function createChatbotUI() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div class="chatbot-header">
            <h3>💬 WeWash Assistant</h3>
            <button class="chatbot-toggle">×</button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input">
            <input type="text" placeholder="Type your message...">
            <button>Send</button>
        </div>
    `;

    document.body.appendChild(chatbotContainer);

    const chatbot = new Chatbot();
    const messagesDiv = chatbotContainer.querySelector('.chatbot-messages');
    const input = chatbotContainer.querySelector('input');
    const sendButton = chatbotContainer.querySelector('.chatbot-input button');
    const toggleButton = chatbotContainer.querySelector('.chatbot-toggle');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addOptions(options) {
        if (!options || options.length === 0) return;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chatbot-option-button';
            button.textContent = option;
            button.addEventListener('click', async () => {
                addMessage(option, 'user');
                const response = await chatbot.handleButtonClick(option);
                if (response) {
                    addMessage(response.message, 'bot');
                    addOptions(response.options);
                }
            });
            optionsDiv.appendChild(button);
        });
        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function handleInput() {
        const userText = input.value.trim();
        if (userText) {
            addMessage(userText, 'user');
            input.value = '';
            const response = await chatbot.handleUserInput(userText);
            addMessage(response.message, 'bot');
            addOptions(response.options);
        }
    }

    sendButton.addEventListener('click', handleInput);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInput();
        }
    });

    toggleButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('chatbot-minimized');
    });

    // Initialize with welcome message
    const initialResponse = chatbot.showMainMenu();
    addMessage("👋 Hello! I'm WeWash's virtual assistant.", 'bot');
    addOptions(initialResponse.options);
}

// Initialize chatbot when the page loads
document.addEventListener('DOMContentLoaded', createChatbotUI);
