/* =====================================
   REWEAR DASHBOARD + LISTINGS
===================================== */


// Get current user

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "rewearCurrentUser"
        )
    );

}


// Get all custom listings

function getCustomListings() {

    return JSON.parse(
        localStorage.getItem(
            "rewearCustomListings"
        )
    ) || [];

}


// Save custom listings

function saveCustomListings(listings) {

    localStorage.setItem(
        "rewearCustomListings",
        JSON.stringify(listings)
    );

}


// Current user

const currentUser =
    getCurrentUser();


// Protect dashboard

if (!currentUser) {

    window.location.href =
        "login.html";

}


// Get elements

const welcomeName =
    document.getElementById("welcomeName");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileLocation =
    document.getElementById("profileLocation");

const profileJoined =
    document.getElementById("profileJoined");

const userLocation =
    document.getElementById("userLocation");

const listingCount =
    document.getElementById("listingCount");

const myListings =
    document.getElementById("myListings");

const emptyListings =
    document.getElementById("emptyListings");


// Display user information

if (currentUser) {

    welcomeName.textContent =
        `Welcome back, ${currentUser.name.split(" ")[0]} 👋`;

    profileName.textContent =
        currentUser.name;

    profileEmail.textContent =
        currentUser.email;

    profileLocation.textContent =
        currentUser.location;

    userLocation.textContent =
        currentUser.location;


    if (currentUser.joined) {

        const date =
            new Date(currentUser.joined);

        profileJoined.textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    }

}


// Open modal

const modal =
    document.getElementById(
        "listingModal"
    );


const openListingModal =
    document.getElementById(
        "openListingModal"
    );


const openListingModal2 =
    document.getElementById(
        "openListingModal2"
    );


const emptyAddBtn =
    document.getElementById(
        "emptyAddBtn"
    );


function openModal() {

    modal.classList.remove("hidden");

}


function closeModal() {

    modal.classList.add("hidden");

}


openListingModal.addEventListener(
    "click",
    openModal
);


openListingModal2.addEventListener(
    "click",
    openModal
);


emptyAddBtn.addEventListener(
    "click",
    openModal
);


document.getElementById(
    "closeModal"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "cancelListing"
).addEventListener(
    "click",
    closeModal
);


// Close modal by clicking background

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// Display listings

function displayMyListings() {

    const listings =
        getCustomListings().filter(
            item =>
                item.ownerEmail ===
                currentUser.email
        );


    listingCount.textContent =
        listings.length;


    myListings.innerHTML = "";


    if (listings.length === 0) {

        emptyListings.classList.remove(
            "hidden"
        );

        return;

    }


    emptyListings.classList.add(
        "hidden"
    );


    listings.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "my-listing-card";


            card.innerHTML = `

                <div class="my-listing-image">
                    ${item.emoji}
                </div>

                <div class="my-listing-info">

                    <span class="my-listing-status">
                        Available for Swap
                    </span>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.brand}
                        • Size ${item.size}
                        • ${item.condition}
                    </p>

                    <strong>
                        Estimated Value:
                        ₹${item.value.toLocaleString("en-IN")}
                    </strong>

                </div>


                <button
                    class="delete-listing"
                    data-id="${item.id}">

                    Remove

                </button>

            `;


            myListings.appendChild(card);

        }
    );


    // Delete buttons

    document
        .querySelectorAll(
            ".delete-listing"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        deleteListing(
                            Number(
                                this.dataset.id
                            )
                        );

                    }
                );

            }
        );

}


// Delete listing

function deleteListing(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to remove this listing?"
        );


    if (!confirmDelete) {

        return;

    }


    let listings =
        getCustomListings();


    listings =
        listings.filter(
            item =>
                item.id !== id
        );


    saveCustomListings(
        listings
    );


    displayMyListings();

}


// Generate clothing emoji

function getClothingEmoji(
    category
) {

    const emojis = {

        "T-Shirt": "👕",

        "Jeans": "👖",

        "Jacket": "🧥",

        "Dress": "👗",

        "Shirt": "👔",

        "Kurta": "👘",

        "Shoes": "👟"

    };


    return (
        emojis[category] ||
        "👕"
    );

}


// Add listing

const listingForm =
    document.getElementById(
        "listingForm"
    );


listingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "itemName"
            ).value.trim();


        const brand =
            document.getElementById(
                "itemBrand"
            ).value.trim();


        const category =
            document.getElementById(
                "itemCategory"
            ).value;


        const size =
            document.getElementById(
                "itemSize"
            ).value;


        const condition =
            document.getElementById(
                "itemCondition"
            ).value;


        const location =
            document.getElementById(
                "itemLocation"
            ).value;


        const value =
            Number(
                document.getElementById(
                    "itemValue"
                ).value
            );


        const description =
            document.getElementById(
                "itemDescription"
            ).value.trim();


        const message =
            document.getElementById(
                "listingMessage"
            );


        // Validation

        if (name.length < 3) {

            message.textContent =
                "Please enter a valid clothing name.";

            message.style.color =
                "#c0392b";

            return;

        }


        if (brand.length < 2) {

            message.textContent =
                "Please enter the brand name.";

            message.style.color =
                "#c0392b";

            return;

        }


        if (value < 100) {

            message.textContent =
                "Swap value must be at least ₹100.";

            message.style.color =
                "#c0392b";

            return;

        }


        if (description.length < 10) {

            message.textContent =
                "Please provide a more detailed description.";

            message.style.color =
                "#c0392b";

            return;

        }


        // Get existing listings

        const listings =
            getCustomListings();


        // Create listing

        const newListing = {

            id:
                Date.now(),

            name:
                name,

            category:
                category,

            brand:
                brand,

            size:
                size,

            condition:
                condition,

            value:
                value,

            location:
                location,

            owner:
                currentUser.name,

            ownerEmail:
                currentUser.email,

            emoji:
                getClothingEmoji(category),

            description:
                description,

            status:
                "Available",

            created:
                new Date().toISOString()

        };


        listings.push(
            newListing
        );


        saveCustomListings(
            listings
        );


        // Success

        message.textContent =
            "Listing added successfully!";

        message.style.color =
            "#3f6b52";


        listingForm.reset();


        displayMyListings();


        setTimeout(
            closeModal,
            800
        );

    }
);


// Logout

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "rewearCurrentUser"
        );


        window.location.href =
            "index.html";

    }
);


// Initial display

displayMyListings();