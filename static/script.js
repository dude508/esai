function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    const chatBox = document.getElementById('chat-messages');

    if (message === "") return;

    // 1. Affiche mesaj itilizatè a
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message sent';
    userMessageDiv.textContent = message;
    chatBox.appendChild(userMessageDiv);

    // 2. Montre yon endikatè k ap tape (pou pi bèl)
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message received typing-indicator';
    typingIndicator.innerHTML = 'AI ap tape...';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Voye bay backend la (Flask)
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        // 4. Retire endikatè a
        chatBox.removeChild(typingIndicator);

        // 5. Affiche repons AI a
        const aiResponseDiv = document.createElement('div');
        aiResponseDiv.className = 'message received';
        aiResponseDiv.textContent = data.response || data.error; // Affiche repons lan oswa erè a
        chatBox.appendChild(aiResponseDiv);
        
        // Desann anba chat la
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error('Erè:', error);
        chatBox.removeChild(typingIndicator);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message received';
        errorDiv.textContent = 'Erè koneksyon ak AI a.';
        chatBox.appendChild(errorDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // 6. Netwaye input la
    input.value = '';
}
