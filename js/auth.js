/* =====================================
   REWEAR AUTHENTICATION
===================================== */


// Get registered users

function getUsers() {

    return JSON.parse(
        localStorage.getItem("rewearUsers")
    ) || [];

}


// Save users

function saveUsers(users) {

    localStorage.setItem(
        "rewearUsers",
        JSON.stringify(users)
    );

}


// Register User

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Get values

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim().toLowerCase();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            const location =
                document.getElementById(
                    "registerLocation"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Clear errors

            document.getElementById(
                "nameError"
            ).textContent = "";


            document.getElementById(
                "emailError"
            ).textContent = "";


            document.getElementById(
                "passwordError"
            ).textContent = "";


            document.getElementById(
                "confirmError"
            ).textContent = "";


            // Name validation

            if (name.length < 3) {

                document.getElementById(
                    "nameError"
                ).textContent =
                    "Please enter your full name.";

                return;

            }


            // Password validation

            if (password.length < 6) {

                document.getElementById(
                    "passwordError"
                ).textContent =
                    "Password must contain at least 6 characters.";

                return;

            }


            // Confirm password

            if (password !== confirmPassword) {

                document.getElementById(
                    "confirmError"
                ).textContent =
                    "Passwords do not match.";

                return;

            }


            // Location

            if (!location) {

                message.textContent =
                    "Please select your location.";

                message.style.color =
                    "#c0392b";

                return;

            }


            // Existing users

            const users = getUsers();


            const existingUser =
                users.find(
                    user => user.email === email
                );


            if (existingUser) {

                document.getElementById(
                    "emailError"
                ).textContent =
                    "An account with this email already exists.";

                return;

            }


            // Create user

            const newUser = {

                id:
                    Date.now(),

                name:
                    name,

                email:
                    email,

                password:
                    password,

                location:
                    location,

                joined:
                    new Date().toISOString(),

                listings:
                    [],

                swaps:
                    []

            };


            users.push(newUser);


            saveUsers(users);


            // Success message

            message.textContent =
                "Account created successfully! Redirecting to login...";

            message.style.color =
                "#3f6b52";


            // Redirect

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

}



// Login User

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim().toLowerCase();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            const user =
                users.find(
                    account =>
                        account.email === email &&
                        account.password === password
                );


            if (!user) {

                message.textContent =
                    "Invalid email or password.";

                message.style.color =
                    "#c0392b";

                return;

            }


            // Save logged-in user

            localStorage.setItem(
                "rewearCurrentUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Login successful! Redirecting...";

            message.style.color =
                "#3f6b52";


            setTimeout(
                function() {

                    window.location.href =
                        "dashboard.html";

                },
                700
            );

        }
    );

}