// ========================================
// REWEAR NEGOTIATION CHAT
// ========================================


// Get current user

const currentUser =
    JSON.parse(
        localStorage.getItem("rewearCurrentUser")
    );


// Protect page

if (!currentUser) {

    window.location.href =
        "login.html";

}


// Get swap ID from URL

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const swapId =
    urlParams.get("swapId");


// Get saved requests

let swapRequests =
    JSON.parse(
        localStorage.getItem(
            "rewearSwapRequests"
        )
    ) || [];


// Find current request

const swapRequest =
    swapRequests.find(
        request =>
            String(request.id) ===
            String(swapId)
    );


// Containers

const chatHeader =
    document.getElementById(
        "chatHeader"
    );

const chatMessages =
    document.getElementById(
        "chatMessages"
    );

const swapSummary =
    document.getElementById(
        "swapSummary"
    );

const chatForm =
    document.getElementById(
        "chatForm"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );


// ========================================
// CHECK REQUEST
// ========================================

if (!swapRequest) {

    showNotFound();

} else {

    initializeChat();

}


// ========================================
// INITIALIZE CHAT
// ========================================

function initializeChat() {

    const isRequester =
        currentUser.email ===
        swapRequest.requesterEmail;


    const otherPerson =
        isRequester
            ? swapRequest.ownerName
            : swapRequest.requesterName;


    chatHeader.innerHTML = `

        <div class="chat-user-info">

            <div class="chat-avatar">

                ${getInitials(otherPerson)}

            </div>


            <div>

                <h2>
                    ${otherPerson}
                </h2>

                <span>
                    Swap Negotiation
                </span>

            </div>

        </div>

    `;


    displaySwapSummary();


    displayMessages();


    chatForm.addEventListener(
        "submit",
        sendMessage
    );

}


// ========================================
// DISPLAY SWAP SUMMARY
// ========================================

function displaySwapSummary() {

    const isRequester =
        currentUser.email ===
        swapRequest.requesterEmail;


    swapSummary.innerHTML = `

        <div class="summary-header">

            <h3>
                Swap Details
            </h3>

            <span class="
                request-status
                ${swapRequest.status
                    .toLowerCase()}
            ">

                ${swapRequest.status}

            </span>

        </div>


        <div class="summary-item">

            <span>
                ${
                    isRequester
                        ? "Your Item"
                        : "Their Item"
                }
            </span>

            <strong>
                ${swapRequest.offeredItemName}
            </strong>

            <small>
                ₹${Number(
                    swapRequest.offeredItemValue
                ).toLocaleString("en-IN")}
            </small>

        </div>


        <div class="summary-arrow">

            ⇅

        </div>


        <div class="summary-item">

            <span>
                ${
                    isRequester
                        ? "Requested Item"
                        : "Your Item"
                }
            </span>

            <strong>
                ${swapRequest.requestedItemName}
            </strong>

            <small>
                ₹${Number(
                    swapRequest.requestedItemValue
                ).toLocaleString("en-IN")}
            </small>

        </div>


        <div class="summary-value">

            <span>
                Value Difference
            </span>

            <strong>
                ₹${Math.abs(
                    Number(
                        swapRequest.offeredItemValue
                    ) -
                    Number(
                        swapRequest.requestedItemValue
                    )
                ).toLocaleString("en-IN")}
            </strong>

        </div>


        ${
            swapRequest.status ===
            "Accepted"
                ? `

                <button
                    id="confirmSwapBtn"
                    class="btn btn-primary confirm-swap-btn">

                    Confirm Swap

                </button>

            `
                : ""
        }


        <a href="swap-requests.html"
           class="btn btn-outline summary-back">

            Back to Requests

        </a>

    `;


    const confirmButton =
        document.getElementById(
            "confirmSwapBtn"
        );


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            confirmSwap
        );

    }

}


// ========================================
// DISPLAY MESSAGES
// ========================================

function displayMessages() {

    const allMessages =
        JSON.parse(
            localStorage.getItem(
                "rewearChatMessages"
            )
        ) || [];


    const messages =
        allMessages.filter(
            message =>
                String(message.swapId) ===
                String(swapRequest.id)
        );


    if (messages.length === 0) {

        chatMessages.innerHTML = `

            <div class="chat-empty">

                <div>
                    💬
                </div>

                <h3>
                    Start the conversation
                </h3>

                <p>
                    Discuss the swap details,
                    condition, delivery or
                    meeting arrangements.
                </p>

            </div>

        `;

        return;

    }


    chatMessages.innerHTML =
        messages.map(
            message =>
                createMessage(
                    message
                )
        ).join("");


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// ========================================
// CREATE MESSAGE
// ========================================

function createMessage(message) {

    const isMine =
        message.senderEmail ===
        currentUser.email;


    const time =
        new Date(
            message.created
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    return `

        <div class="
            chat-message-row
            ${isMine ? "mine" : "theirs"}
        ">


            <div class="chat-bubble">

                <div class="chat-sender">

                    ${
                        isMine
                            ? "You"
                            : message.senderName
                    }

                </div>


                <p>
                    ${escapeHTML(
                        message.text
                    )}
                </p>


                <span class="chat-time">

                    ${time}

                </span>

            </div>


        </div>

    `;

}


// ========================================
// SEND MESSAGE
// ========================================

function sendMessage(event) {

    event.preventDefault();


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    const allMessages =
        JSON.parse(
            localStorage.getItem(
                "rewearChatMessages"
            )
        ) || [];


    const newMessage = {

        id: Date.now(),

        swapId:
            swapRequest.id,

        senderEmail:
            currentUser.email,

        senderName:
            currentUser.name,

        text:
            text,

        created:
            new Date().toISOString()

    };


    allMessages.push(
        newMessage
    );


    localStorage.setItem(
        "rewearChatMessages",
        JSON.stringify(
            allMessages
        )
    );


    messageInput.value = "";


    displayMessages();

}


// ========================================
// CONFIRM SWAP
// ========================================

function confirmSwap() {

    const confirmation =
        confirm(
            "Confirm that both users have agreed to this swap?"
        );


    if (!confirmation) {

        return;

    }


    swapRequest.status =
        "Completed";


    swapRequest.completedAt =
        new Date().toISOString();


    localStorage.setItem(
        "rewearSwapRequests",
        JSON.stringify(
            swapRequests
        )
    );


    displaySwapSummary();


    alert(
        "Swap completed successfully!"
    );

}


// ========================================
// NOT FOUND
// ========================================

function showNotFound() {

    chatHeader.innerHTML = `
        <h2>
            Swap Request Not Found
        </h2>
    `;


    chatMessages.innerHTML = `

        <div class="chat-empty">

            <h3>
                Conversation unavailable
            </h3>

            <p>
                This swap request could not
                be found.
            </p>

            <a href="swap-requests.html"
               class="btn btn-primary">

                Back to My Swaps

            </a>

        </div>

    `;


    swapSummary.innerHTML = "";

}


// ========================================
// GET INITIALS
// ========================================

function getInitials(name) {

    if (!name) {

        return "U";

    }


    return name
        .split(" ")
        .map(word =>
            word.charAt(0)
        )
        .slice(0, 2)
        .join("")
        .toUpperCase();

}


// ========================================
// BASIC HTML ESCAPING
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}




/* ========================================
   NEGOTIATION CHAT
======================================== */

.chat-page {
    min-height: 70vh;
    padding: 40px 0 70px;
}

.chat-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 25px;
    align-items: start;
}


/* Chat Container */

.chat-container {
    border: 1px solid #ddd;
    border-radius: 18px;
    overflow: hidden;
    background: #fff;
}


/* Chat Header */

.chat-header {
    padding: 20px 25px;
    border-bottom: 1px solid #ddd;
}

.chat-user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.chat-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #eeeeee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.chat-user-info h2 {
    font-size: 20px;
    margin-bottom: 3px;
}

.chat-user-info span {
    color: #777;
    font-size: 13px;
}


/* Messages */

.chat-messages {
    height: 480px;
    overflow-y: auto;
    padding: 25px;
    background: #f7f7f7;
}

.chat-message-row {
    display: flex;
    margin-bottom: 15px;
}

.chat-message-row.mine {
    justify-content: flex-end;
}

.chat-message-row.theirs {
    justify-content: flex-start;
}

.chat-bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 14px;
    background: #ffffff;
    border: 1px solid #ddd;
}

.chat-message-row.mine .chat-bubble {
    background: #111;
    color: #fff;
    border-color: #111;
}

.chat-sender {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 5px;
    opacity: 0.7;
}

.chat-bubble p {
    margin: 0;
    line-height: 1.5;
    word-break: break-word;
}

.chat-time {
    display: block;
    text-align: right;
    font-size: 10px;
    margin-top: 6px;
    opacity: 0.6;
}


/* Empty Chat */

.chat-empty {
    height: 100%;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #666;
}

.chat-empty > div {
    font-size: 45px;
    margin-bottom: 10px;
}

.chat-empty h3 {
    color: #222;
    margin-bottom: 8px;
}

.chat-empty p {
    max-width: 400px;
    line-height: 1.6;
}


/* Chat Form */

.chat-form {
    display: flex;
    gap: 10px;
    padding: 15px;
    border-top: 1px solid #ddd;
}

.chat-form input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    font-family: inherit;
    outline: none;
}

.chat-form input:focus {
    border-color: #555;
}


/* Swap Summary */

.swap-summary {
    border: 1px solid #ddd;
    border-radius: 18px;
    padding: 22px;
    background: #fff;
}

.summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.summary-header h3 {
    margin: 0;
}


.summary-item {
    padding: 15px;
    background: #f6f6f6;
    border-radius: 12px;
}

.summary-item span {
    display: block;
    color: #777;
    font-size: 12px;
    margin-bottom: 5px;
}

.summary-item strong {
    display: block;
    margin-bottom: 4px;
}

.summary-item small {
    color: #666;
}

.summary-arrow {
    text-align: center;
    font-size: 24px;
    padding: 8px;
}

.summary-value {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
}

.summary-value span {
    display: block;
    color: #777;
    font-size: 13px;
    margin-bottom: 5px;
}

.summary-value strong {
    font-size: 20px;
}

.confirm-swap-btn {
    width: 100%;
    margin-top: 20px;
}

.summary-back {
    width: 100%;
    text-align: center;
    margin-top: 10px;
}