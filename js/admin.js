/* =========================================
   REWEAR ADMIN PANEL
========================================= */


/* =========================================
   ADMIN CREDENTIALS
========================================= */

const ADMIN_EMAIL = "admin@rewear.com";
const ADMIN_PASSWORD = "admin123";


/* =========================================
   GET DATA
========================================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("rewearUsers")
    ) || [];

}


function getCustomListings() {

    return JSON.parse(
        localStorage.getItem("rewearCustomListings")
    ) || [];

}


function getSwapRequests() {

    return JSON.parse(
        localStorage.getItem("rewearSwapRequests")
    ) || [];

}


/* =========================================
   SAVE DATA
========================================= */

function saveUsers(users) {

    localStorage.setItem(
        "rewearUsers",
        JSON.stringify(users)
    );

}


function saveListings(listings) {

    localStorage.setItem(
        "rewearCustomListings",
        JSON.stringify(listings)
    );

}


function saveSwaps(swaps) {

    localStorage.setItem(
        "rewearSwapRequests",
        JSON.stringify(swaps)
    );

}


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(text) {

    if (text === undefined || text === null) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   ADMIN LOGIN
========================================= */

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "adminEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            const message =
                document.getElementById(
                    "adminLoginMessage"
                );


            if (
                email === ADMIN_EMAIL &&
                password === ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "rewearAdminLoggedIn",
                    "true"
                );


                message.textContent =
                    "Admin login successful.";

                message.className =
                    "form-message success";


                showAdminDashboard();

            } else {

                message.textContent =
                    "Invalid admin email or password.";

                message.className =
                    "form-message error";

            }

        }
    );

}


/* =========================================
   SHOW ADMIN DASHBOARD
========================================= */

function showAdminDashboard() {

    const loginSection =
        document.getElementById(
            "adminLogin"
        );


    const dashboard =
        document.getElementById(
            "adminDashboard"
        );


    if (loginSection) {

        loginSection.classList.add(
            "hidden"
        );

    }


    if (dashboard) {

        dashboard.classList.remove(
            "hidden"
        );

    }


    loadAdminData();

}


/* =========================================
   ADMIN LOGOUT
========================================= */

function adminLogout() {

    sessionStorage.removeItem(
        "rewearAdminLoggedIn"
    );


    window.location.href =
        "admin.html";

}


/* =========================================
   LOAD ADMIN DATA
========================================= */

function loadAdminData() {

    loadStatistics();

    loadUsers();

    loadListings();

    loadSwaps();

    loadAnalytics();

}


/* =========================================
   STATISTICS
========================================= */

function loadStatistics() {

    const users =
        getUsers();


    const listings =
        getCustomListings();


    const swaps =
        getSwapRequests();


    const completed =
        swaps.filter(
            swap =>
                swap.status === "Completed"
        );


    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    const totalListings =
        document.getElementById(
            "totalListings"
        );


    const totalSwaps =
        document.getElementById(
            "totalSwaps"
        );


    const completedSwaps =
        document.getElementById(
            "completedSwaps"
        );


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }


    if (totalListings) {

        totalListings.textContent =
            listings.length;

    }


    if (totalSwaps) {

        totalSwaps.textContent =
            swaps.length;

    }


    if (completedSwaps) {

        completedSwaps.textContent =
            completed.length;

    }

}


/* =========================================
   USER MANAGEMENT
========================================= */

function loadUsers() {

    const users =
        getUsers();


    const listings =
        getCustomListings();


    const table =
        document.getElementById(
            "usersTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (users.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No registered users found.
                </td>
            </tr>
        `;

        return;

    }


    users.forEach(
        user => {

            const userListings =
                listings.filter(
                    listing =>
                        listing.ownerEmail ===
                        user.email
                ).length;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        user.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.email
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        user.location
                    )}
                </td>

                <td>
                    ${userListings}
                </td>

                <td>

                    <button
                        class="admin-danger-btn"
                        onclick="removeUser('${escapeHTML(
                            user.email
                        )}')"
                    >
                        Remove
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================
   REMOVE USER
========================================= */

function removeUser(email) {

    const confirmDelete =
        confirm(
            "Are you sure you want to remove this user?"
        );


    if (!confirmDelete) {
        return;
    }


    let users =
        getUsers();


    users =
        users.filter(
            user =>
                user.email !== email
        );


    saveUsers(users);


    /* Remove user's listings */

    let listings =
        getCustomListings();


    listings =
        listings.filter(
            listing =>
                listing.ownerEmail !== email
        );


    saveListings(listings);


    loadAdminData();

}


/* =========================================
   LISTING MANAGEMENT
========================================= */

function loadListings() {

    const listings =
        getCustomListings();


    const table =
        document.getElementById(
            "listingsTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (listings.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No user listings found.
                </td>
            </tr>
        `;

        return;

    }


    listings.forEach(
        listing => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    ${listing.emoji || "👕"}

                    ${escapeHTML(
                        listing.name
                    )}

                </td>

                <td>
                    ${escapeHTML(
                        listing.owner ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        listing.category ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        listing.location ||
                        "-"
                    )}
                </td>

                <td>
                    ₹${Number(
                        listing.value || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${escapeHTML(
                        listing.status ||
                        "Available"
                    )}
                </td>

                <td>

                    <button
                        class="admin-danger-btn"
                        onclick="removeListing('${listing.id}')"
                    >
                        Remove
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================
   REMOVE LISTING
========================================= */

function removeListing(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to remove this clothing listing?"
        );


    if (!confirmDelete) {
        return;
    }


    let listings =
        getCustomListings();


    listings =
        listings.filter(
            listing =>
                String(listing.id) !==
                String(id)
        );


    saveListings(listings);


    loadAdminData();

}


/* =========================================
   SWAP MANAGEMENT
========================================= */

function loadSwaps() {

    const swaps =
        getSwapRequests();


    const table =
        document.getElementById(
            "swapsTableBody"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (swaps.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No swap requests found.
                </td>
            </tr>
        `;

        return;

    }


    swaps.forEach(
        swap => {

            const row =
                document.createElement(
                    "tr"
                );


            let actionButton =
                "No Action";


            if (
                swap.status === "Pending"
            ) {

                actionButton = `
                    <button
                        class="admin-action-btn"
                        onclick="adminAcceptSwap('${swap.id}')"
                    >
                        Accept
                    </button>

                    <button
                        class="admin-danger-btn"
                        onclick="adminRejectSwap('${swap.id}')"
                    >
                        Reject
                    </button>
                `;

            }

if (
    swap.status === "Accepted"
) {

    actionButton = `
        <a 
            href="chat.html?swapId=${swap.id}" 
            class="admin-action-btn" 
        > 
            Open Chat 
        </a>

        <button
            class="admin-danger-btn"
            onclick="adminMarkDispute('${swap.id}')"
        >
            Mark Dispute
        </button>
    `;

}


if (
    swap.status === "Disputed"
) {

    actionButton = `
        <button
            class="admin-action-btn"
            onclick="adminResolveDispute('${swap.id}')"
        >
            Resolve
        </button>
    `;
}



            if (
                swap.status === "Completed"
            ) {

                actionButton = `
                    <span>
                        Completed
                    </span>
                `;

            }


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        swap.requesterName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        swap.ownerName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        swap.offeredItemName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        swap.requestedItemName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        swap.status ||
                        "Pending"
                    )}
                </td>

                <td>
                    ${actionButton}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================
   ACCEPT SWAP
========================================= */

function adminAcceptSwap(id) {

    let swaps =
        getSwapRequests();


    const swap =
        swaps.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!swap) {
        return;
    }


    swap.status =
        "Accepted";


    swap.updated =
        new Date().toISOString();


    saveSwaps(swaps);


    loadAdminData();

}


/* =========================================
   REJECT SWAP
========================================= */

function adminRejectSwap(id) {

    const confirmReject =
        confirm(
            "Are you sure you want to reject this swap request?"
        );


    if (!confirmReject) {
        return;
    }


    let swaps =
        getSwapRequests();


    const swap =
        swaps.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!swap) {
        return;
    }


    swap.status =
        "Rejected";


    swap.updated =
        new Date().toISOString();


    saveSwaps(swaps);


    loadAdminData();

}


/* =========================================
   ANALYTICS
========================================= */

function loadAnalytics() {

    const listings =
        getCustomListings();


    const swaps =
        getSwapRequests();


    const available =
        listings.filter(
            listing =>
                !listing.status ||
                listing.status ===
                "Available"
        ).length;


    const pending =
        swaps.filter(
            swap =>
                swap.status ===
                "Pending"
        ).length;


    const accepted =
        swaps.filter(
            swap =>
                swap.status ===
                "Accepted"
        ).length;


    const disputed =
        swaps.filter(
            swap =>
                swap.status ===
                "Disputed"
        ).length;


    const availableElement =
        document.getElementById(
            "availableListings"
        );


    const pendingElement =
        document.getElementById(
            "pendingSwaps"
        );


    const acceptedElement =
        document.getElementById(
            "acceptedSwaps"
        );


    const disputedElement =
        document.getElementById(
            "disputedSwaps"
        );


    if (availableElement) {

        availableElement.textContent =
            available;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (acceptedElement) {

        acceptedElement.textContent =
            accepted;

    }


    if (disputedElement) {

        disputedElement.textContent =
            disputed;

    }

}




/* =========================================
   MARK SWAP AS DISPUTED
========================================= */

function adminMarkDispute(id) {

    const confirmDispute =
        confirm(
            "Are you sure you want to mark this swap as disputed?"
        );

    if (!confirmDispute) {
        return;
    }

    let swaps =
        getSwapRequests();

    const swap =
        swaps.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!swap) {
        return;
    }

    swap.status =
        "Disputed";

    swap.updated =
        new Date().toISOString();

    saveSwaps(swaps);

    loadAdminData();
}


/* =========================================
   RESOLVE DISPUTE
========================================= */

function adminResolveDispute(id) {

    const confirmResolve =
        confirm(
            "Resolve this dispute and mark the swap as completed?"
        );

    if (!confirmResolve) {
        return;
    }

    let swaps =
        getSwapRequests();

    const swap =
        swaps.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!swap) {
        return;
    }

    swap.status =
        "Completed";

    swap.resolvedAt =
        new Date().toISOString();

    saveSwaps(swaps);

    loadAdminData();
}



/* =========================================
   CHECK ADMIN SESSION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const adminLoggedIn =
            sessionStorage.getItem(
                "rewearAdminLoggedIn"
            );


        if (
            adminLoggedIn === "true"
        ) {

            showAdminDashboard();

        }

    }
);