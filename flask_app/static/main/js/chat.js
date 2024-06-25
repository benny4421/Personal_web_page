// Declare the socket variable globally.
var socket;

// When the document is fully loaded, execute the following functions.
$(document).ready(function(){
    
    // Connect to the server's chat namespace using WebSocket.
    socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');

    // When the connection is established, emit a 'joined' event to the server.
    socket.on('connect', function() {
        socket.emit('joined', {});
    });
    
    // Listen for 'status' events from the server and handle them.
    socket.on('status', function(data) {     
        let tag = document.createElement("p");  // Create a new paragraph element.
        let text = document.createTextNode(data.msg);  // Create a text node with the message.
        let element = document.getElementById("chat"); // Find the chat element by its ID.
        tag.appendChild(text);  // Append the text node to the paragraph.
        tag.style.cssText = data.style;  // Apply any style sent from the server.
        element.appendChild(tag);  // Append the paragraph to the chat element.
        $('#chat').scrollTop($('#chat')[0].scrollHeight);  // Automatically scroll to the newest message.
    });        
});

// Retrieve the input box element and add an event listener for the 'keydown' event.
var input = document.getElementById("text_box");
input.addEventListener("keydown", function (e) {
    // When the Enter key is pressed and the input is not empty, call validate.
    if (e.key === "Enter") {  
        if (e.target.value !== ""){
            validate(e);
        }
    }
});

// Validate the input and send the message.
function validate(e) {
    var msg = e.target.value;  // Get the message from the input.
    e.target.value = "";  // Clear the input box.

    // Reconnect to the chat namespace to ensure the connection is fresh.
    var socket;
    socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');
    socket.emit('msgsend', msg);  // Emit the 'msgsend' event with the message to the server.
}

// Function to handle leaving the chat.
function leave(){
    var socket;
    // Reconnect to the chat namespace to ensure the connection is fresh.
    socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');
    socket.emit('leave', {});  // Emit the 'leave' event to the server.
    window.location.href = "/";  // Redirect to the home page.
}
