
// ========================================
// DESTINATIONS DROPDOWN TOGGLE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const destinationItem = document.querySelector(
        ".navbar .dropdown-menu > li:nth-child(2)"
    );

    if (!destinationItem) return;

    const destinationLink = destinationItem.querySelector("a");

    const countries = [
        "BOTSWANA",
        "KENYA",
        "MOZAMBIQUE",
        "NAMIBIA",
        "SOUTH AFRICA",
        "TANZANIA",
        "ZAMBIA",
        "ZIMBABWE"
    ];

    const dropdown = document.createElement("ul");
    dropdown.className = "destination-dropdown";

    countries.forEach(country => {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.textContent = country;
        link.href = "#destinations";

        li.appendChild(link);
        dropdown.appendChild(li);
    });

    destinationItem.appendChild(dropdown);

    // Initially hidden
    dropdown.style.display = "none";

    destinationLink.addEventListener("click", function (e) {
        e.preventDefault();

        const isOpen = dropdown.style.display === "none";

        dropdown.style.display = isOpen ? "block" : "none";

        destinationItem.classList.toggle("open", isOpen);
        dropdown.classList.toggle("active", isOpen);

        destinationLink.setAttribute("aria-expanded", isOpen);
    });

});


//////////// HERO SECTION MOVE + DYNAMIC BACKGROUND ////////////

//////////// HERO SECTION - INFINITE COUNTRY LOOP ////////////

const countryList = document.querySelector(".country-list");
const searchBox = countryList.querySelector(".search-box");
const selectedInput = searchBox.querySelector("input");

const hero = document.querySelector(".hero");
const heroCountry = document.querySelector(".hero-country");

// Country background images
const countryImages = {
    "Zimbabwe": "./images/Zimbabwe.png",
    "Botswana": "./images/Bootswana.png",
    "Kenya": "./images/Kenya.png",
    "Mozambique": "./images/Mozambique.png",
    "Namibia": "./images/Namibia.png",
    "South Africa": "./images/SouthAfrica.png",
    "Zambia": "./images/Zambia.png",
    "Tanzania": "./images/Tanzania.png"
};

// Get original countries
const originalCountries = Array.from(
    countryList.querySelectorAll(":scope > p")
).map(p => p.textContent.trim());

// Insert Mozambique after Kenya
const countries = [
    ...originalCountries.slice(0, 3),
    "Mozambique",
    ...originalCountries.slice(3)
];

// Initial country
const initialCountry =
    selectedInput.value.trim() ||
    selectedInput.placeholder.trim() ||
    countries[0];

const initialIndex = Math.max(
    0,
    countries.indexOf(initialCountry)
);

// Remove original paragraphs
countryList.querySelectorAll(":scope > p").forEach(p => p.remove());

// Create moving track
const track = document.createElement("div");
track.className = "country-track";

// Duplicate countries three times for seamless looping
for (let i = 0; i < 3; i++) {
    countries.forEach(country => {
        const p = document.createElement("p");
        p.textContent = country;
        track.appendChild(p);
    });
}

// Insert track before search box
countryList.insertBefore(track, searchBox);
// Settings
let itemHeight = 42;
const totalCountries = countries.length;

let currentIndex = totalCountries + initialIndex;

// Background layer
const background = document.createElement("div");

background.style.cssText = `
    position: absolute;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.5s ease;
    transition:opacity 1.2s ease-in-out;
`;

hero.insertBefore(background, hero.firstChild);


// Change background
function changeCountryBanner(country) {

    const image = countryImages[country];

    if (!image) return;

    background.style.backgroundImage = `url("${image}")`;

    heroCountry.textContent = country;
}


// Update country position
function updateCountries(animate = true) {

    track.style.transition = animate
        ? "transform 2s cubic-bezier(0.45, 0, 0.25, 1)"
        : "none";

    const centerPosition = countryList.clientHeight / 2;

    const offset =
        centerPosition -
        (currentIndex * itemHeight + itemHeight / 2);

    track.style.transform = `translateY(${offset}px)`;

    const activeCountry =
        countries[currentIndex % totalCountries];

    // Update search input
    selectedInput.value = activeCountry;

    // Update hero background
    changeCountryBanner(activeCountry);
}


// Initial position
updateCountries(false);


// Seamless loop reset after animation completes
track.addEventListener("transitionend", function (event) {

    if (event.propertyName !== "transform") return;

    if (currentIndex >= totalCountries * 2) {

        currentIndex -= totalCountries;

        updateCountries(false);
    }

});


// Automatic infinite scrolling
setInterval(() => {

    currentIndex++;

    updateCountries(true);

}, 2000);

function adjustCountryHeight() {
    itemHeight = track.children[0].getBoundingClientRect().height;
    updateCountries(false);
}

window.addEventListener("resize", adjustCountryHeight);

adjustCountryHeight();




// ========================================
// COUNTRY FILTER + DESTINATION SLIDER
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".destination-cards");

    const allCards = Array.from(
        document.querySelectorAll(".destination-card")
    );

    const countryButtons = document.querySelectorAll(
        ".country-packages button"
    );

    // Both arrow buttons and pagination buttons
    // currently share these IDs in your HTML.
    const prevButtons = document.querySelectorAll("#prevBtn");
    const nextButtons = document.querySelectorAll("#nextBtn");

    const currentPage = document.getElementById("currentPage");
    const totalPages = document.getElementById("totalPages");

    if (!slider || !allCards.length) return;

    let visibleCards = [...allCards];
    let currentIndex = 0;


    // GET CARD POSITION
    function getCardPosition(card) {

        return (
            card.getBoundingClientRect().left -
            slider.getBoundingClientRect().left +
            slider.scrollLeft
        );
    }


    // UPDATE PAGINATION AND ARROWS
    function updatePagination() {

        if (!visibleCards.length) {
            currentPage.textContent = "00";
            totalPages.textContent = "00";
            return;
        }

        if (currentIndex >= visibleCards.length) {
            currentIndex = visibleCards.length - 1;
        }

        currentPage.textContent =
            String(currentIndex + 1).padStart(2, "0");

        totalPages.textContent =
            String(visibleCards.length).padStart(2, "0");

        prevButtons.forEach(button => {
            button.disabled = currentIndex === 0;
        });

        nextButtons.forEach(button => {
            button.disabled =
                currentIndex === visibleCards.length - 1;
        });

    }


    // MOVE SLIDER
    function goToCard(index) {

        if (!visibleCards.length) return;

        currentIndex = Math.max(
            0,
            Math.min(index, visibleCards.length - 1)
        );

        slider.scrollTo({
            left: getCardPosition(visibleCards[currentIndex]),
            behavior: "smooth"
        });

        updatePagination();

    }


    // NEXT AND PREVIOUS
    prevButtons.forEach(button => {

        button.addEventListener("click", function (event) {
            event.preventDefault();
            goToCard(currentIndex - 1);
        });

    });


    nextButtons.forEach(button => {

        button.addEventListener("click", function (event) {
            event.preventDefault();
            goToCard(currentIndex + 1);
        });

    });


    // MANUAL SLIDER SCROLL
    slider.addEventListener("scroll", function () {

        if (!visibleCards.length) return;

        let closestIndex = 0;
        let closestDistance = Infinity;

        visibleCards.forEach((card, index) => {

            const distance = Math.abs(
                getCardPosition(card) - slider.scrollLeft
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }

        });

        currentIndex = closestIndex;
        updatePagination();

    });


    // COUNTRY FILTER
    countryButtons.forEach(button => {

        button.addEventListener("click", function () {

            const selectedCountry = this.dataset.country;

            // SHOW SELECTED COUNTRY PACKAGES
            allCards.forEach(card => {

                card.style.display =
                    card.dataset.country === selectedCountry
                        ? "flex"
                        : "none";

            });

            // UPDATE VISIBLE CARD LIST
            visibleCards = allCards.filter(card => {
                return card.dataset.country === selectedCountry;
            });

            // ACTIVE COUNTRY BUTTON
            countryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            // RESET SLIDER
            currentIndex = 0;

            slider.scrollTo({
                left: 0,
                behavior: "instant"
            });

            updatePagination();

        });

    });


    // INITIAL STATE
    updatePagination();


    // RESPONSIVE UPDATE
    window.addEventListener("resize", function () {

        if (visibleCards.length) {
            slider.scrollTo({
                left: getCardPosition(visibleCards[currentIndex]),
                behavior: "instant"
            });
        }

        updatePagination();

    });

});




//////////////// REVIEWS SLIDER //////////////////



document.addEventListener("DOMContentLoaded", function () {

    const reviewContainer = document.querySelector(".reviews-container");

    const reviewCards = document.querySelectorAll(".review-card");

    const prevBtn = document.querySelector(
        ".review-arrows button:first-child"
    );

    const nextBtn = document.querySelector(
        ".review-arrows button:last-child"
    );

    if (
        !reviewContainer ||
        !prevBtn ||
        !nextBtn ||
        reviewCards.length === 0
    ) {
        return;
    }

    let currentIndex = 0;

    // SHOW SELECTED REVIEW
    function showReview(index) {

        currentIndex = (index + reviewCards.length) % reviewCards.length;

        const selectedCard = reviewCards[currentIndex];

        const firstCard = reviewCards[0];

        const position = selectedCard.offsetLeft - firstCard.offsetLeft;

        reviewContainer.scrollTo({
            left: position,
            behavior: "smooth"
        });

    }

    // NEXT REVIEW
    nextBtn.addEventListener("click", function (event) {

        event.preventDefault();

        showReview(currentIndex + 1);

    });

    // PREVIOUS REVIEW
    prevBtn.addEventListener("click", function (event) {

        event.preventDefault();

        showReview(currentIndex - 1);

    });

    // INITIAL REVIEW
    showReview(0);

});

//////////////// PARTNERS SLIDER //////////////////

document.addEventListener("DOMContentLoaded", function () {

    const partnerContainer = document.querySelector(".partner-logos");
    const partnerItems = document.querySelectorAll(".partner-item");
    const dots = document.querySelectorAll(".partner-dots span");

    if (!partnerContainer || !partnerItems.length || !dots.length) return;

    let currentIndex = 0;
    const total = Math.min(partnerItems.length, dots.length);

    function showPartner(index) {

        currentIndex = Math.max(0, Math.min(index, total - 1));

        const item = partnerItems[currentIndex];

        const containerRect = partnerContainer.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const scrollPosition =
            partnerContainer.scrollLeft +
            itemRect.left -
            containerRect.left;

        partnerContainer.scrollTo({
            left: scrollPosition,
            behavior: "smooth"
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            showPartner(index);
        });
    });

    showPartner(0);

    window.addEventListener("resize", function () {
        showPartner(currentIndex);
    });

});


const hamburger = document.getElementById("hamburger");
const closeMenu = document.getElementById("closeMenu");
const dropdownMenu = document.querySelector(".dropdown-menu");

// Initially keep menu closed
dropdownMenu.classList.remove("active");

// Open menu when hamburger is clicked
hamburger.addEventListener("click", () => {
    dropdownMenu.classList.add("active");
});

// Close menu when cross button is clicked
closeMenu.addEventListener("click", () => {
    dropdownMenu.classList.remove("active");
});









