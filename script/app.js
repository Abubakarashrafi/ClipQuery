import { VideoPlayer } from "./videoPlayer.js";
import { ChatInterface } from "./chatInterface.js";
import { ApiService } from "./apiService.js";

class YouTubeRAGApp {
  constructor() {
    this.apiService = new ApiService();
    this.videoPlayer = new VideoPlayer(
      document.getElementById("video-container"),
      document.getElementById("video-url"),
      document.getElementById("load-video"),
      document.getElementById("processing-details"),
      document.querySelector(".progress-bar"),
      document.querySelector(".progress-text"),
      this.apiService
    );

    this.chatInterface = new ChatInterface(
      document.getElementById("chat-messages"),
      document.getElementById("user-input"),
      document.getElementById("send-button"),
      document.getElementById("clear-chat")
    );

    

    this.initEventListeners();
    this.initTheme();
  }

  initEventListeners() {
    
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      this.updateThemeIcon(newTheme);
    });
   
    document.getElementById("clear-url").addEventListener("click", () => {
      this.videoPlayer.urlInput.value = "";
      this.videoPlayer.urlInput.focus();
      this.videoPlayer.resetProcessing();
      this.apiService.clearTranscript();
    });

    
    document
      .getElementById("load-video")
      .addEventListener("click", function () {
        this.classList.add("btn-loading");
        setTimeout(() => {
          this.classList.remove("btn-loading");
        }, 3000); 
      });

   
    document
      .getElementById("video-url")
      .addEventListener("input", function (e) {
        const clearBtn = document.getElementById("clear-url");
        if (this.value.length > 0) {
          clearBtn.classList.add("show");
        } else {
          clearBtn.classList.remove("show");
        }
      });
    
    const settingsModal = document.getElementById("settings-modal");
    document.getElementById("settings-btn").addEventListener("click", () => {
      settingsModal.classList.add("active");
    });

    document.querySelector(".modal-close").addEventListener("click", () => {
      settingsModal.classList.remove("active");
    });

    document.getElementById("save-settings").addEventListener("click", () => {
      const endpoint = document.getElementById("api-endpoint").value;
      const model = document.getElementById("model-select").value;

      this.apiService.updateSettings(endpoint, model);
      settingsModal.classList.remove("active");

      this.chatInterface.addSystemMessage("Settings updated successfully");
    });

    
    this.videoPlayer.onProcessingComplete = (videoId) => {
      this.chatInterface.enable();
      this.chatInterface.addBotMessage(
        `I've processed this video. Ask me anything about its content!`,
        "Video AI"
      );
    };

    
    this.chatInterface.onSendMessage = async (message) => {
      try {
        const answer = await this.apiService.getAnswer(message);
        this.chatInterface.addBotMessage(answer);
      } catch (error) {
        this.chatInterface.addBotMessage(
          error.message || "Sorry, I couldn't process your question.",
          "System"
        );
        console.error("API Error:", error);
      }
    };
  }

  initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    icon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon";
  }
  
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("click");
  
  new YouTubeRAGApp();
});
