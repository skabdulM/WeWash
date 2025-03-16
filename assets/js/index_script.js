const imagePairs = [
    { before: "./assets/img/before1.png", after: "./assets/img/after1.png" },
    { before: "./assets/img/before2.png", after: "./assets/img/after2.png" }
];

let currentIndex = 0;
const beforeImage = document.querySelector(".before-card .comparison-image");
const afterImage = document.querySelector(".after-card .comparison-image");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

function updateImages() {
    beforeImage.src = imagePairs[currentIndex].before;
    afterImage.src = imagePairs[currentIndex].after;
    animateCards();
}

function animateCards() {
    const beforeCard = document.querySelector('.before-card');
    const afterCard = document.querySelector('.after-card');

    beforeCard.classList.add('animate');
    afterCard.classList.add('animate');

    setTimeout(() => {
        beforeCard.classList.remove('animate');
        afterCard.classList.remove('animate');
    }, 600);
}

function navigateImages(direction) {
    currentIndex = (currentIndex + direction + imagePairs.length) % imagePairs.length;
    updateImages();
}

leftButton.addEventListener("click", () => {
    navigateImages(-1);
    resetCarouselTimer();
});

rightButton.addEventListener("click", () => {
    navigateImages(1);
    resetCarouselTimer();
});

let carouselTimer = setInterval(() => {
    navigateImages(1);
}, 3000);

function resetCarouselTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
        navigateImages(1);
    }, 3000);
}

updateImages();
