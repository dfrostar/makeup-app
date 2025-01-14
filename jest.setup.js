require("@testing-library/jest-dom");

class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.onresult = null;
    this.onerror = null;
    this.onstart = null;
    this.onend = null;
  }
  
  start() {
    if (this.onstart) this.onstart(new Event("start"));
  }
  
  stop() {
    if (this.onend) this.onend(new Event("end"));
  }
  
  abort() {
    if (this.onend) this.onend(new Event("end"));
  }
}

global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;