export class ApiService {
  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl;
    this.currentTranscript = null; 
  }

 
  async fetchTranscript(url) {
    try {
      const response = await fetch(`${this.baseUrl}/get_transcript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch transcript");
      }

      const { transcript } = await response.json();
      this.currentTranscript = transcript;
      return transcript;
    } catch (error) {
      console.error("Failed to fetch transcript:", error);
      throw new Error(
        error.message ||
          "Could not get video transcript. Please check the URL and try again."
      );
    }
  }

 
  async getAnswer(question) {
    if (!this.currentTranscript) {
      throw new Error("Please load a video first");
    }

    try {
      const response = await fetch(`${this.baseUrl}/get_answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: this.currentTranscript,
          question,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate answer");
      }

      const { answer } = await response.json();
      return answer;
    } catch (error) {
      console.error("Failed to get answer:", error);
      throw new Error(
        error.message || "Could not generate answer. Please try again."
      );
    }
  }

  
  clearTranscript() {
    this.currentTranscript = null;
  }

  
  updateSettings(endpoint, model) {
    if (endpoint) this.baseUrl = endpoint;
    if (model) console.log("Model selection not implemented in backend");
  }
}
