type EventCallback = (data: any) => void;

export class VoiceSearchService {
  private listeners: { [key: string]: EventCallback[] } = {};
  private recognition: SpeechRecognition | null = null;

  constructor() {
    if (typeof window !== "undefined" && "SpeechRecognition" in window) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      this.emit("search", text);
    };

    this.recognition.onerror = (event) => {
      this.emit("error", new Error(event.error));
    };
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(): void {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  public stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

// Add types for the Web Speech API if not available
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}