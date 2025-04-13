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


function setHeroHeight() {
    const heroText = document.querySelector('.hero .text');
    const hero = document.querySelector('.hero .container');
    const viewportHeight = window.innerHeight;

    let totalHeight = 0;

    // Sum the heights of all visible child elements inside .text
    Array.from(heroText.children).forEach(child => {
        const style = getComputedStyle(child);
        const marginTop = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);
        const childHeight = child.getBoundingClientRect().height + marginTop + marginBottom;
        totalHeight += childHeight;
    });

    // Convert 3rem to px
    const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const paddingHeight = 1 * remInPx;

    hero.style.height = `${totalHeight + paddingHeight}px`;
}

setHeroHeight();
window.addEventListener('resize', setHeroHeight);
window.addEventListener('orientationchange', setHeroHeight);
