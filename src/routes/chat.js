document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
  
    
    async function cargarMensajes() {
      const response = await fetch('/api/mensajes'); 
      const data = await response.json();
  
      if (data && data.messages) {
        chatMessages.innerHTML = '';
        data.messages.forEach((message) => {
          chatMessages.innerHTML += `<div class="message"><strong>${message.user}:</strong> ${message.message}</div>`;
        });
      }
    }
  
   
    cargarMensajes();
  

    sendButton.addEventListener('click', async () => {
      const user = userInput.value;
      const message = messageInput.value;
  
   
      const response = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, message }),
      });
  
      if (response.status === 201) {
        cargarMensajes();
        messageInput.value = '';
      }
    });
  });
  