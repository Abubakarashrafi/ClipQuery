export class ChatInterface {
  constructor(messagesContainer, inputElement, sendButton, clearButton) {
    this.messagesContainer = messagesContainer;
    this.inputElement = inputElement;
    this.sendButton = sendButton;
    this.clearButton = clearButton;
    this.onSendMessage = null;

    this.initEventListeners();
    this.disable();
  }

  initEventListeners() {
    this.sendButton.addEventListener("click", () => this.handleSendMessage());
    this.inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSendMessage();
    });

    this.clearButton.addEventListener("click", () => {
      this.messagesContainer.innerHTML = "";
      this.addSystemMessage("Chat history cleared");
    });
  }

  enable() {
    this.inputElement.disabled = false;
    this.sendButton.disabled = false;
    this.inputElement.focus();
  }

  disable() {
    this.inputElement.disabled = true;
    this.sendButton.disabled = true;
  }

  async handleSendMessage() {
    const message = this.inputElement.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    this.inputElement.value = "";

    const typingIndicator = this.showTypingIndicator();

    if (this.onSendMessage) {
      await this.onSendMessage(message);
    }

    this.removeTypingIndicator(typingIndicator);
  }

  addUserMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message user-message";

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    messageDiv.innerHTML = `
            <div>${text}</div>
            <small class="message-time">${time}</small>
        `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addBotMessage(text, sender = "AI Assistant") {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    messageDiv.innerHTML = `
            <div><strong>${sender}:</strong> ${text}</div>
            <small class="message-time">${time}</small>
        `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    return messageDiv;
  }

  addSystemMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";
    messageDiv.innerHTML = `<em>${text}</em>`;
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
    return indicator;
  }

  removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}
