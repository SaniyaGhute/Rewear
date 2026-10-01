// Get custom listings created by users
const customListings =
    JSON.parse(localStorage.getItem("rewearCustomListings")) || [];


// Combine sample listings and user listings
const allListings = [
    ...clothingData,
    ...customListings
];


// Get item ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");


// Find selected item
const selectedItem = allListings.find(
    item => String(item.id) === String(itemId)
);


// Get current logged-in user
const currentUser =
    JSON.parse(localStorage.getItem("rewearCurrentUser"));


// Main container
const itemDetails =
    document.getElementById("itemDetails");


// If item does not exist
if (!selectedItem) {

    itemDetails.innerHTML = `
        <div class="not-found">
            <h2>Item Not Found</h2>
            <p>
                The clothing item you are looking for
                does not exist or has been removed.
            </p>

            <a href="marketplace.html"
               class="btn btn-primary">
                Back to Marketplace
            </a>
        </div>
    `;

} else {

    displayItemDetails();

}


// Display selected item
function displayItemDetails() {

    const isOwner =
        currentUser &&
        selectedItem.ownerEmail === currentUser.email;


    let actionButton = "";


    if (isOwner) {

        actionButton = `
            <div class="owner-message">
                <strong>Your Listing</strong>
                <p>
                    This is your own clothing listing.
                </p>

                <a href="dashboard.html"
                   class="btn btn-outline">
                    Manage Listing
                </a>
            </div>
        `;

    } else if (!currentUser) {

        actionButton = `
            <div class="swap-action-box">

                <h3>Interested in this item?</h3>

                <p>
                    Login to send a swap request.
                </p>

                <a href="login.html"
                   class="btn btn-primary">
                    Login to Request Swap
                </a>

            </div>
        `;

    } else {

        actionButton = `
            <div class="swap-action-box">

                <h3>Request a Swap</h3>

                <p>
                    Select one of your clothing items
                    to offer in exchange.
                </p>

                <label for="offerItem">
                    Your Item
                </label>

                <select id="offerItem">
                    <option value="">
                        Select an item
                    </option>
                </select>

                <div id="valueComparison"
                     class="value-comparison">
                </div>

                <textarea
                    id="swapMessage"
                    placeholder="Write a message to the owner..."
                    rows="4"></textarea>

                <button
                    id="requestSwapBtn"
                    class="btn btn-primary"
                    disabled>
                    Send Swap Request
                </button>

                <p id="swapMessageStatus"
                   class="form-message">
                </p>

            </div>
        `;
    }


    itemDetails.innerHTML = `

        <div class="item-details-grid">

            <!-- Item Visual -->
            <div class="item-image-large">

                <span class="large-item-emoji">
                    ${selectedItem.emoji || "👕"}
                </span>

            </div>


            <!-- Item Information -->
            <div class="item-information">

                <div class="item-meta">

                    <span class="category-label">
                        ${selectedItem.category}
                    </span>

                    <span class="condition-label">
                        ${selectedItem.condition}
                    </span>

                </div>


                <h1>
                    ${selectedItem.name}
                </h1>


                <p class="item-brand">
                    ${selectedItem.brand}
                </p>


                <div class="item-info-list">

                    <div>
                        <strong>Size</strong>
                        <span>${selectedItem.size}</span>
                    </div>

                    <div>
                        <strong>Condition</strong>
                        <span>${selectedItem.condition}</span>
                    </div>

                    <div>
                        <strong>Location</strong>
                        <span>${selectedItem.location}</span>
                    </div>

                    <div>
                        <strong>Owner</strong>
                        <span>${selectedItem.owner}</span>
                    </div>

                </div>


                <div class="swap-value-large">

                    <span>Estimated Swap Value</span>

                    <strong>
                        ₹${Number(selectedItem.value).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div class="item-description">

                    <h3>Description</h3>

                    <p>
                        ${selectedItem.description}
                    </p>

                </div>


                ${actionButton}

            </div>

        </div>

    `;


    // Only setup swap functionality
    // when user can request a swap
    if (currentUser && !isOwner) {

        setupSwapRequest();

    }

}


// Setup swap request
function setupSwapRequest() {

    const offerItem =
        document.getElementById("offerItem");

    const comparison =
        document.getElementById("valueComparison");

    const requestButton =
        document.getElementById("requestSwapBtn");


    const userListings =
        customListings.filter(
            item =>
                item.ownerEmail === currentUser.email
        );


    // No listings
    if (userListings.length === 0) {

        offerItem.innerHTML = `
            <option value="">
                No clothing listed yet
            </option>
        `;

        comparison.innerHTML = `
            <div class="comparison-warning">

                <strong>
                    Add a clothing item first
                </strong>

                <p>
                    You need at least one clothing
                    listing before requesting a swap.
                </p>

                <a href="dashboard.html"
                   class="btn btn-outline">
                    Add Clothing
                </a>

            </div>
        `;

        return;
    }


    // Add user's listings
    userListings.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item.id;

        option.textContent =
            `${item.name} — ₹${Number(item.value).toLocaleString("en-IN")}`;

        offerItem.appendChild(option);

    });


    // When user selects an item
    offerItem.addEventListener("change", function () {

        const selectedOffer =
            userListings.find(
                item =>
                    String(item.id) ===
                    String(this.value)
            );


        if (!selectedOffer) {

            comparison.innerHTML = "";

            requestButton.disabled = true;

            return;
        }


        const targetValue =
            Number(selectedItem.value);

        const offerValue =
            Number(selectedOffer.value);

        const difference =
            offerValue - targetValue;


        let message = "";


        if (difference === 0) {

            message = `
                <strong>Equal estimated value</strong>
                <p>
                    Both items have the same
                    estimated swap value.
                </p>
            `;

        } else if (difference > 0) {

            message = `
                <strong>
                    Your item is ₹${difference.toLocaleString("en-IN")}
                    higher
                </strong>

                <p>
                    The other user may negotiate
                    the exchange value.
                </p>
            `;

        } else {

            message = `
                <strong>
                    Target item is
                    ₹${Math.abs(difference).toLocaleString("en-IN")}
                    higher
                </strong>

                <p>
                    Consider discussing the value
                    difference during negotiation.
                </p>
            `;
        }


        comparison.innerHTML = `

            <div class="comparison-box">

                <div>
                    <span>Your Item</span>
                    <strong>
                        ₹${offerValue.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div class="comparison-arrow">
                    ⇄
                </div>

                <div>
                    <span>Requested Item</span>
                    <strong>
                        ₹${targetValue.toLocaleString("en-IN")}
                    </strong>
                </div>

            </div>

            <div class="comparison-result">
                ${message}
            </div>

        `;


        requestButton.disabled = false;

    });


    // Send swap request
    requestButton.addEventListener("click", function () {

        const selectedOfferId =
            offerItem.value;

        if (!selectedOfferId) {

            return;

        }


        const selectedOffer =
            userListings.find(
                item =>
                    String(item.id) ===
                    String(selectedOfferId)
            );


        if (!selectedOffer) {

            return;

        }


        const messageInput =
            document.getElementById("swapMessage");


        const message =
            messageInput.value.trim();


        // Get existing requests
        const swapRequests =
            JSON.parse(
                localStorage.getItem("rewearSwapRequests")
            ) || [];


        // Create request
        const newRequest = {

            id: Date.now(),

            requesterEmail:
                currentUser.email,

            requesterName:
                currentUser.name,

            ownerEmail:
                selectedItem.ownerEmail || "",

            ownerName:
                selectedItem.owner,

            offeredItemId:
                selectedOffer.id,

            offeredItemName:
                selectedOffer.name,

            offeredItemValue:
                Number(selectedOffer.value),

            requestedItemId:
                selectedItem.id,

            requestedItemName:
                selectedItem.name,

            requestedItemValue:
                Number(selectedItem.value),

            message:
                message || "Interested in swapping this item.",

            status:
                "Pending",

            created:
                new Date().toISOString()

        };


        // Save request
        swapRequests.push(newRequest);

        localStorage.setItem(
            "rewearSwapRequests",
            JSON.stringify(swapRequests)
        );


        // Show success
        document.getElementById(
            "swapMessageStatus"
        ).innerHTML = `
            <span class="success-message">
                ✓ Swap request sent successfully!
            </span>
        `;


        requestButton.disabled = true;

        requestButton.textContent =
            "Request Sent";

    });

}