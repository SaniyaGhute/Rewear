// ========================================
// REWEAR MARKETPLACE
// ========================================


// Sample + custom listings

const customListings =
    JSON.parse(
        localStorage.getItem(
            "rewearCustomListings"
        )
    ) || [];


let allListings = [
    ...clothingData,
    ...customListings
];


// ========================================
// DOM ELEMENTS
// ========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const sizeFilter =
    document.getElementById(
        "sizeFilter"
    );

const conditionFilter =
    document.getElementById(
        "conditionFilter"
    );

const locationFilter =
    document.getElementById(
        "locationFilter"
    );

const locationMatch =
    document.getElementById(
        "locationMatch"
    );

const sortFilter =
    document.getElementById(
        "sortFilter"
    );

const clearFilters =
    document.getElementById(
        "clearFilters"
    );

const listingGrid =
    document.getElementById(
        "listingGrid"
    );

const noResults =
    document.getElementById(
        "noResults"
    );


// ========================================
// CURRENT USER
// ========================================

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "rewearCurrentUser"
        )
    );


// ========================================
// DISPLAY LISTINGS
// ========================================

function displayListings(listings) {

    if (listings.length === 0) {

        listingGrid.innerHTML = "";

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    listingGrid.innerHTML =
        listings.map(
            item => createListingCard(item)
        ).join("");

}


// ========================================
// LISTING CARD
// ========================================

function createListingCard(item) {

    const locationClass =
        getLocationClass(
            item.location
        );


    return `

        <article class="listing-card">


            <div class="listing-image">

                <span>
                    ${item.emoji || "👕"}
                </span>


                <div class="listing-badges">

                    <span class="condition-badge">

                        ${item.condition}

                    </span>

                </div>

            </div>


            <div class="listing-content">


                <span class="listing-category">

                    ${item.category}

                </span>


                <h3>

                    ${item.name}

                </h3>


                <p class="listing-brand">

                    ${item.brand}
                    •
                    Size ${item.size}

                </p>


                <div class="listing-location">

                    📍 ${item.location}

                    ${
                        currentUser
                            ? `
                                <span class="
                                    location-match
                                    ${locationClass}
                                ">
                                    ${getLocationText(
                                        item.location
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="listing-footer">


                    <div>

                        <span class="value-label">
                            Estimated Value
                        </span>

                        <strong>

                            ₹${Number(
                                item.value
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    <a
                        href="item-details.html?id=${item.id}"
                        class="btn btn-primary">

                        View

                    </a>


                </div>


            </div>

        </article>

    `;

}


// ========================================
// LOCATION CLASS
// ========================================

function getLocationClass(location) {

    if (!currentUser) {

        return "";

    }


    const userLocation =
        currentUser.location
            .toLowerCase()
            .trim();


    const itemLocation =
        location
            .toLowerCase()
            .trim();


    if (
        userLocation ===
        itemLocation
    ) {

        return "same-city";

    }


    if (
        isNearbyLocation(
            userLocation,
            itemLocation
        )
    ) {

        return "nearby-city";

    }


    return "other-location";

}


// ========================================
// LOCATION TEXT
// ========================================

function getLocationText(location) {

    if (!currentUser) {

        return "";

    }


    const userLocation =
        currentUser.location
            .toLowerCase()
            .trim();


    const itemLocation =
        location
            .toLowerCase()
            .trim();


    if (
        userLocation ===
        itemLocation
    ) {

        return "Same City";

    }


    if (
        isNearbyLocation(
            userLocation,
            itemLocation
        )
    ) {

        return "Nearby";

    }


    return "Other Location";

}


// ========================================
// NEARBY LOCATION DATA
// ========================================

const nearbyCities = {

    mumbai: [
        "thane",
        "navi mumbai"
    ],

    thane: [
        "mumbai",
        "navi mumbai"
    ],

    "navi mumbai": [
        "mumbai",
        "thane"
    ],

    pune: [
        "mumbai"
    ],

    nashik: [
        "pune"
    ]

};


// ========================================
// CHECK NEARBY LOCATION
// ========================================

function isNearbyLocation(
    userLocation,
    itemLocation
) {

    if (
        nearbyCities[userLocation]
    ) {

        return nearbyCities[
            userLocation
        ].includes(itemLocation);

    }


    return false;

}


// ========================================
// APPLY FILTERS
// ========================================

function applyFilters() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    const size =
        sizeFilter.value;


    const condition =
        conditionFilter.value;


    const location =
        locationFilter.value;


    const match =
        locationMatch
            ? locationMatch.value
            : "";


    let filtered =
        allListings.filter(item => {


            const matchesSearch =
                !search ||
                item.name
                    .toLowerCase()
                    .includes(search) ||
                item.brand
                    .toLowerCase()
                    .includes(search) ||
                item.category
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                !category ||
                item.category === category;


            const matchesSize =
                !size ||
                item.size === size;


            const matchesCondition =
                !condition ||
                item.condition === condition;


            const matchesLocation =
                !location ||
                item.location === location;


            let matchesLocationType =
                true;


            if (match && currentUser) {

                const locationClass =
                    getLocationClass(
                        item.location
                    );


                if (match === "same") {

                    matchesLocationType =
                        locationClass ===
                        "same-city";

                }


                if (match === "nearby") {

                    matchesLocationType =
                        locationClass ===
                        "nearby-city";

                }

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesSize &&
                matchesCondition &&
                matchesLocation &&
                matchesLocationType
            );

        });


    applySorting(filtered);

}


// ========================================
// SORTING
// ========================================

function applySorting(listings) {

    const sort =
        sortFilter.value;


    if (sort === "low") {

        listings.sort(
            (a, b) =>
                Number(a.value) -
                Number(b.value)
        );

    }


    if (sort === "high") {

        listings.sort(
            (a, b) =>
                Number(b.value) -
                Number(a.value)
        );

    }


    if (sort === "newest") {

        listings.sort(
            (a, b) =>
                new Date(b.created || 0) -
                new Date(a.created || 0)
        );

    }


    displayListings(
        listings
    );

}


// ========================================
// EVENT LISTENERS
// ========================================

searchInput.addEventListener(
    "input",
    applyFilters
);


categoryFilter.addEventListener(
    "change",
    applyFilters
);


sizeFilter.addEventListener(
    "change",
    applyFilters
);


conditionFilter.addEventListener(
    "change",
    applyFilters
);


locationFilter.addEventListener(
    "change",
    applyFilters
);


if (locationMatch) {

    locationMatch.addEventListener(
        "change",
        applyFilters
    );

}


sortFilter.addEventListener(
    "change",
    applyFilters
);


// ========================================
// CLEAR FILTERS
// ========================================

clearFilters.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        categoryFilter.value = "";

        sizeFilter.value = "";

        conditionFilter.value = "";

        locationFilter.value = "";

        if (locationMatch) {

            locationMatch.value = "";

        }

        sortFilter.value =
            "recommended";


        applyFilters();

    }
);


// ========================================
// INITIAL DISPLAY
// ========================================

displayListings(
    allListings
);




// ========================================
// LOCATION SUGGESTIONS
// ========================================

const nearbyListingsContainer =
    document.getElementById(
        "nearbyListings"
    );

const userLocationDisplay =
    document.getElementById(
        "userLocationDisplay"
    );


function displayNearbyListings() {

    if (
        !nearbyListingsContainer
    ) {

        return;

    }


    if (!currentUser) {

        nearbyListingsContainer.innerHTML = `

            <div class="location-login-message">

                <p>
                    Login to see clothing
                    listings near you.
                </p>

                <a
                    href="login.html"
                    class="btn btn-primary">

                    Login

                </a>

            </div>

        `;

        return;

    }


    if (userLocationDisplay) {

        userLocationDisplay.innerHTML = `

            📍
            <strong>
                ${currentUser.location}
            </strong>

        `;

    }


    const recommendedListings =
        allListings.filter(item => {

            const match =
                getLocationClass(
                    item.location
                );

            return (
                match === "same-city" ||
                match === "nearby-city"
            );

        });


    if (
        recommendedListings.length === 0
    ) {

        nearbyListingsContainer.innerHTML = `

            <div class="location-login-message">

                <p>
                    No nearby listings found
                    at the moment.
                </p>

            </div>

        `;

        return;

    }


    nearbyListingsContainer.innerHTML =
        recommendedListings
            .slice(0, 4)
            .map(
                item =>
                    createListingCard(item)
            )
            .join("");

}


displayNearbyListings();