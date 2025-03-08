
// Array of image objects with before and after properties
const imagePairs = [
    { before: "./assets/img/before1.png", after: "./assets/img/after1.png" },
    { before: "./assets/img/before2.png", after: "./assets/img/after2.png" },
    // Add more objects as needed
];

// Track the current image index
let currentIndex = 0;

// Function to update the images in the DOM
function updateImages() {
    const beforeImage = document.querySelector(
        ".before-card .comparison-image"
    );
    const afterImage = document.querySelector(
        ".after-card .comparison-image"
    );

    beforeImage.src = imagePairs[currentIndex].before;
    afterImage.src = imagePairs[currentIndex].after;
}

// Event listener for left button
document.querySelector(".left-button").addEventListener("click", () => {
    console.log("Left button clicked");

    currentIndex = (currentIndex - 1 + imagePairs.length) % imagePairs.length;
    updateImages();
});

// Event listener for right button
document.querySelector(".right-button").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imagePairs.length;
    console.log(currentIndex);

    updateImages();
});
