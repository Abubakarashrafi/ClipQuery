export class VideoPlayer {
  constructor(
    container,
    urlInput,
    loadButton,
    statusElement,
    progressBar,
    progressText,
    apiService
  ) {
    this.container = container;
    this.urlInput = urlInput;
    this.loadButton = loadButton;
    this.statusElement = statusElement;
    this.progressBar = progressBar;
    this.progressText = progressText;
    this.apiService = apiService;
    this.currentVideoId = null;
    this.onProcessingComplete = null;
    this.isProcessing = false;

    this.initEventListeners();
  }

  initEventListeners() {
    this.loadButton.addEventListener("click", () => this.loadVideo());
    this.urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.loadVideo();
    });

    this.urlInput.addEventListener("focus", () => {
      if (this.isProcessing) {
        this.resetProcessing();
      }
    });
  }

  async loadVideo() {
    const url = this.urlInput.value.trim();
    if (!url) return;

    try {
      this.currentVideoId = this.extractVideoId(url);
      if (!this.currentVideoId) {
        this.showError("Invalid YouTube URL. Please try again.");
        return;
      }

      this.showVideoPlaceholder(false);
      this.createIframe(this.currentVideoId);
      this.disableControls();
      this.showProcessing();
      this.isProcessing = true;
      this.showButtonLoading(true);

      
      this.updateStatus("Fetching transcript...");
      this.updateProgress(20);

      
      await this.apiService.fetchTranscript(url);

     
      await this.simulateProcessingSteps(
        [
          "Processing transcript...",
          "Creating embeddings...",
          "Building vector store...",
        ],
        30
      ); 

      this.isProcessing = false;
      this.showButtonLoading(false);

      if (this.onProcessingComplete) {
        this.onProcessingComplete();
      }
    } catch (error) {
      console.error("Error loading video:", error);
      this.showError(error.message || "Error loading video. Please try again.");
      this.resetControls();
      this.showButtonLoading(false);
    }
  }

  async simulateProcessingSteps(steps, initialProgress = 0) {
    for (let i = 0; i < steps.length; i++) {
      this.updateStatus(steps[i]);
      const progress =
        initialProgress +
        Math.floor(((i + 1) / steps.length) * (100 - initialProgress));
      this.updateProgress(progress);
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 800)
      );
    }
    this.updateStatus("Processing complete!");
    this.updateProgress(100);
  }

  extractVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  createIframe(videoId) {
    this.container.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    this.container.appendChild(iframe);
  }

  showProcessing() {
    this.updateStatus("Starting video processing...");
    this.updateProgress(0);
  }

  updateStatus(message) {
    this.statusElement.textContent = message;
  }

  updateProgress(percent) {
    this.progressBar.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
  }

  showButtonLoading(show = true) {
    if (show) {
      this.loadButton.classList.add("btn-loading");
      this.loadButton.disabled = true;
    } else {
      this.loadButton.classList.remove("btn-loading");
      this.loadButton.disabled = false;
    }
  }

  disableControls() {
    this.urlInput.disabled = true;
    this.loadButton.disabled = true;
  }

  enableControls() {
    this.urlInput.disabled = false;
    this.loadButton.disabled = false;
  }

  resetControls() {
    this.enableControls();
    this.updateProgress(0);
    this.updateStatus("Ready to process video content");
  }

  resetProcessing() {
    this.isProcessing = false;
    this.resetControls();
    this.urlInput.value = "";
    this.urlInput.focus();
    this.showVideoPlaceholder(true);
    this.container.innerHTML = `
      <div class="video-placeholder">
        <i class="fab fa-youtube placeholder-icon"></i>
        <p>Enter a YouTube URL to begin</p>
      </div>
    `;
    this.apiService.clearTranscript();
  }

  showError(message) {
    this.statusElement.textContent = message;
    this.statusElement.style.color = "var(--error)";
    setTimeout(() => {
      this.statusElement.style.color = "";
    }, 3000);
  }

  showVideoPlaceholder(show = true) {
    const placeholder = this.container.querySelector(".video-placeholder");
    if (placeholder) {
      placeholder.style.display = show ? "flex" : "none";
    }
  }
}
