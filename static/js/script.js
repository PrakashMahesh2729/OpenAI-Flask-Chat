document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');
    
    // Function to create message divs
    function createMessageElement(text, author) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.className = author;
        chatBox.appendChild(messageDiv); // Append new messages to the end
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
    
    // Send message to chat
    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            createMessageElement(message, 'user-message');
            input.value = '';
            // Fetch request to the Flask backend
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `message=${encodeURIComponent(message)}`
            })
            .then(response => response.json())
            .then(data => {
                // Assuming the server responds with a JSON object containing the 'response' key
                createMessageElement(data.response, 'ai-message');
            })
            .catch(error => {
                console.error('Error:', error);
                createMessageElement("Sorry, I couldn't send your message.", 'ai-message');
            });
        }
    }
    
    // Handle send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Handle enter key press
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault(); // Prevent default to avoid form submitting
        }
    });
    
    // Send the initial message automatically
    setTimeout(() => {
        createMessageElement("Hi, I am Lilly. How can I help you today?", 'ai-message');
    }, 1000);
});
