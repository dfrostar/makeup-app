import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock GSAP and ScrollTrigger
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
  })),
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(() => []),
    killAll: jest.fn(),
  },
}));

// Mock Web Speech API
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  continuous: false,
  interimResults: true,
  lang: 'en-US',
};

global.SpeechRecognition = jest.fn(() => mockSpeechRecognition);
global.webkitSpeechRecognition = jest.fn(() => mockSpeechRecognition);

// Mock HTMLMediaElement
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();
window.HTMLMediaElement.prototype.load = jest.fn();

// Mock getUserMedia
global.navigator.mediaDevices = {
  ...global.navigator.mediaDevices,
  getUserMedia: jest.fn(() =>
    Promise.resolve({
      getTracks: () => [{
        stop: jest.fn()
      }]
    })
  ),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  constructor(callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  constructor(callback: ResizeObserverCallback) {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock console.error to ignore specific warnings
const originalError = console.error;
console.error = (...args: any[]) => {
  // Ignore specific errors
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Error: Not implemented: HTMLCanvasElement.prototype.getContext') ||
     args[0].includes('Error: Not implemented: HTMLMediaElement.prototype.play'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

afterAll(() => {
  console.error = originalError;
});
