// Initialize a counter to keep track of something, initially set to 0.
let count = 0;

// Function to check user credentials
function checkCredentials() {
    // Retrieve the user-entered email from the input field
    var email = document.getElementById("emailInput").value;
    // Retrieve the user-entered password from the input field
    var password = document.getElementById("passwordInput").value;
    
    // Package the email and password data into a JSON object for sending to the server
    var data_d = {'email': email, 'password': password};
    // Log the packaged data to the console for debugging purposes
    console.log('data_d', data_d);

    // Send data to server via jQuery.ajax() method
    jQuery.ajax({
        url: "/processlogin",  // Server endpoint that processes login
        data: data_d,          // Data being sent to the server
        type: "POST",          // Method type of the HTTP request
        success: function(returned_data) {  // Function to handle successful response from server
            // Parse the returned JSON data from the server
            returned_data = JSON.parse(returned_data);
            // Store the number of login attempts received from the server
            attempt = returned_data;
            
            // Conditional logic based on the number of login attempts
            if (attempt > 0) {
                // If there is at least one failed attempt, redirect user back to the login page
                window.location.href = "/login";
            } else {
                // If login is successful (no failed attempts), redirect user to the home page
                window.location.href = "/home";
            }
        }
    });
}
