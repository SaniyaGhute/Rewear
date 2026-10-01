// ========================================
// REWEAR SWAP REQUEST MANAGEMENT
// ========================================


// Get logged-in user
const currentUser =
    JSON.parse(
        localStorage.getItem("rewearCurrentUser")
    );


// Protect page
if (!currentUser) {

    window.location.href = "login.html";

}


// Get requests
let swapRequests =
    JSON.parse(
        localStorage.getItem("rewearSwapRequests")
    ) || [];


// Containers
const incomingContainer =
    document.getElementById("incomingRequests");

const sentContainer =
    document.getElementById("sentRequests");


// ========================================
// DISPLAY REQUESTS
// ========================================

function displayRequests() {

    // Incoming requests
    const incomingRequests =
        swapRequests.filter(
            request =>
                request.ownerEmail ===
                currentUser.email
        );


    // Sent requests
    const sentRequests =
        swapRequests.filter(
            request =>
                request.requesterEmail ===
                currentUser.email
        );


    displayIncoming(incomingRequests);

    displaySent(sentRequests);

}


// ========================================
// INCOMING REQUESTS
// ========================================

function displayIncoming(requests) {

    if (requests.length === 0) {

        incomingContainer.innerHTML = `

            <div class="swap-empty">

                <div class="swap-empty-icon">
                    📩
                </div>

                <h2>No Incoming Requests</h2>

                <p>
                    You don't have any swap requests
                    from other users yet.
                </p>

                <a href="marketplace.html"
                   class="btn btn-primary">
                    Browse Marketplace
                </a>

            </div>

        `;

        return;

    }


    incomingContainer.innerHTML =
        requests.map(
            request =>
                createRequestCard(
                    request,
                    true
                )
        ).join("");

}


// ========================================
// SENT REQUESTS
// ========================================

function displaySent(requests) {

    if (requests.length === 0) {

        sentContainer.innerHTML = `

            <div class="swap-empty">

                <div class="swap-empty-icon">
                    📤
                </div>

                <h2>No Sent Requests</h2>

                <p>
                    You haven't sent any swap
                    requests yet.
                </p>

                <a href="marketplace.html"
                   class="btn btn-primary">
                    Find Clothes to Swap
                </a>

            </div>

        `;

        return;

    }


    sentContainer.innerHTML =
        requests.map(
            request =>
                createRequestCard(
                    request,
                    false
                )
        ).join("");

}


// ========================================
// REQUEST CARD
// ========================================

function createRequestCard(
    request,
    isIncoming
) {

    const date =
        new Date(
            request.created
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         let actions = "";


if (
    request.status === "Pending"
) {

    if (isIncoming) {

        actions = `

            <div class="request-actions">

                <button
                    class="btn btn-primary"
                    onclick="acceptRequest(${request.id})">

                    Accept

                </button>


                <button
                    class="btn btn-danger"
                    onclick="rejectRequest(${request.id})">

                    Reject

                </button>

            </div>

        `;

    }

}


if (
    request.status === "Accepted"
) {

    actions = `

        <div class="request-actions">

            <a
                href="chat.html?swapId=${request.id}"
                class="btn btn-primary">

                Open Chat

            </a>

        </div>

    `;

}


if (
    request.status === "Completed"
) {

    actions = `

        <div class="request-actions">

            <a
                href="chat.html?swapId=${request.id}"
                class="btn btn-outline">

                View Chat

            </a>

        </div>

    `;

}


    // Incoming pending request
    if (
        isIncoming &&
        request.status === "Pending"
    ) {

        actions = `

            <div class="request-actions">

                <button
                    class="btn btn-primary"
                    onclick="acceptRequest(${request.id})">

                    Accept

                </button>


                <button
                    class="btn btn-danger"
                    onclick="rejectRequest(${request.id})">

                    Reject

                </button>

            </div>

        `;

    }


    // Status for accepted/rejected/pending
    const statusClass =
        request.status
            .toLowerCase()
            .replace(" ", "-");


    return `

        <article class="swap-request-card">


            <!-- Header -->

            <div class="request-header">

                <div>

                    <span class="request-type">

                        ${
                            isIncoming
                                ? "Incoming Request"
                                : "Sent Request"
                        }

                    </span>

                    <h3>

                        ${
                            isIncoming
                                ? request.requesterName
                                : request.ownerName
                        }

                    </h3>

                </div>


                <span class="
                    request-status
                    ${statusClass}
                ">

                    ${request.status}

                </span>

            </div>


            <!-- Swap Items -->

            <div class="swap-items">


                <div class="swap-item">

                    <div class="swap-item-icon">
                        👕
                    </div>

                    <div>

                        <span>
                            ${
                                isIncoming
                                    ? "They Offer"
                                    : "You Offer"
                            }
                        </span>

                        <strong>
                            ${request.offeredItemName}
                        </strong>

                        <small>
                            ₹${Number(
                                request.offeredItemValue
                            ).toLocaleString("en-IN")}
                        </small>

                    </div>

                </div>


                <div class="swap-arrow">
                    ⇄
                </div>


                <div class="swap-item">

                    <div class="swap-item-icon">
                        👗
                    </div>

                    <div>

                        <span>
                            ${
                                isIncoming
                                    ? "Your Item"
                                    : "Requested Item"
                            }
                        </span>

                        <strong>
                            ${request.requestedItemName}
                        </strong>

                        <small>
                            ₹${Number(
                                request.requestedItemValue
                            ).toLocaleString("en-IN")}
                        </small>

                    </div>

                </div>

            </div>


            <!-- Message -->

            <div class="request-message">

                <strong>Message</strong>

                <p>
                    "${request.message}"
                </p>

            </div>


            <!-- Footer -->

            <div class="request-footer">

                <span>
                    Requested on ${date}
                </span>

                ${actions}

            </div>


        </article>

    `;

}


// ========================================
// ACCEPT REQUEST
// ========================================

function acceptRequest(requestId) {

    const request =
        swapRequests.find(
            item =>
                item.id === requestId
        );


    if (!request) {

        return;

    }


    const confirmAccept =
        confirm(
            "Accept this swap request?"
        );


    if (!confirmAccept) {

        return;

    }


    request.status =
        "Accepted";


    request.updated =
        new Date().toISOString();


    saveRequests();


    displayRequests();


    alert(
        "Swap request accepted successfully!"
    );

}


// ========================================
// REJECT REQUEST
// ========================================

function rejectRequest(requestId) {

    const request =
        swapRequests.find(
            item =>
                item.id === requestId
        );


    if (!request) {

        return;

    }


    const confirmReject =
        confirm(
            "Reject this swap request?"
        );


    if (!confirmReject) {

        return;

    }


    request.status =
        "Rejected";


    request.updated =
        new Date().toISOString();


    saveRequests();


    displayRequests();


    alert(
        "Swap request rejected."
    );

}


// ========================================
// SAVE REQUESTS
// ========================================

function saveRequests() {

    localStorage.setItem(
        "rewearSwapRequests",
        JSON.stringify(swapRequests)
    );

}


// ========================================
// TAB SWITCHING
// ========================================

const tabs =
    document.querySelectorAll(
        ".swap-tab"
    );

const sections =
    document.querySelectorAll(
        ".swap-section"
    );


tabs.forEach(tab => {

    tab.addEventListener(
        "click",
        function () {

            const target =
                this.dataset.tab;


            tabs.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            sections.forEach(section => {

                section.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            document
                .getElementById(target)
                .classList.add("active");

        }
    );

});


// ========================================
// INITIAL LOAD
// ========================================

displayRequests();