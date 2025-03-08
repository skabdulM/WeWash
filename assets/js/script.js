// Configuration
const imagePairs = [
    { before: "./assets/img/before1.png", after: "./assets/img/after1.png" },
    { before: "./assets/img/before2.png", after: "./assets/img/after2.png" }
];

// State management
let currentIndex = 0;

// DOM Elements
const beforeImage = document.querySelector(".before-card .comparison-image");
const afterImage = document.querySelector(".after-card .comparison-image");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

// Functions
function updateImages() {
    beforeImage.src = imagePairs[currentIndex].before;
    afterImage.src = imagePairs[currentIndex].after;
}

function navigateImages(direction) {
    currentIndex = (currentIndex + direction + imagePairs.length) % imagePairs.length;
    updateImages();
}

// Event Listeners
leftButton.addEventListener("click", () => navigateImages(-1));
rightButton.addEventListener("click", () => navigateImages(1));

// Initialize images
updateImages();
