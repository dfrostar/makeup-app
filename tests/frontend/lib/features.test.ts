import {
  initSmoothScroll,
  initSearch,
  initFilters,
  initVirtualTryOn,
  initIngredientGlossary,
  initPersonalizationQuiz
} from '../../../frontend/lib/features';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        products: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description 1'
          }
        ]
      })
  })
);

describe('Features Module', () => {
  beforeEach(() => {
    // Set up DOM elements
    document.body.innerHTML = `
      <input class="search-input" type="text" />
      <form class="filter-form">
        <input type="text" name="brand" value="test-brand" />
        <button type="submit">Apply Filters</button>
      </form>
      <form class="quiz-form">
        <input type="radio" name="skin-type" value="oily" />
        <input type="radio" name="concerns" value="acne" />
        <button type="submit">Submit Quiz</button>
      </form>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('initSmoothScroll', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <a href="#section1">Link 1</a>
        <div id="section1"></div>
      `;
    });

    it('should add click handlers to anchor links', () => {
      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      initSmoothScroll();

      const link = document.querySelector('a');
      link?.click();

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  describe('initSearch', () => {
    it('should debounce search input and fetch results', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ results: [] })
      });
      global.fetch = mockFetch;

      const input = document.querySelector('.search-input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('test'),
        expect.any(Object)
      );
    });
  });

  describe('initFilters', () => {
    it('should handle filter form submission', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ results: [] })
      });
      global.fetch = mockFetch;

      const form = document.querySelector('.filter-form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      // Wait for fetch
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('brand=test-brand'),
        expect.any(Object)
      );
    });
  });

  describe('initVirtualTryOn', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <video class="virtual-try-on-video"></video>
        <canvas class="virtual-try-on-canvas"></canvas>
      `;

      // Mock getUserMedia
      const mockStream = { id: 'mock-stream' };
      (navigator.mediaDevices.getUserMedia as jest.Mock) = jest.fn()
        .mockResolvedValue(mockStream);
    });

    it('should initialize video stream and canvas', async () => {
      const video = document.querySelector('.virtual-try-on-video') as HTMLVideoElement;
      const playSpy = jest.spyOn(video, 'play').mockImplementation(() => Promise.resolve());

      initVirtualTryOn();

      // Wait for getUserMedia to complete
      await Promise.resolve();

      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
      expect(video.srcObject).toEqual({ id: 'mock-stream' });
      expect(playSpy).toHaveBeenCalled();
    });
  });

  describe('initIngredientGlossary', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="ingredient-item">
          <div class="ingredient-details"></div>
        </div>
      `;
    });

    it('should toggle ingredient details on click', () => {
      initIngredientGlossary();

      const item = document.querySelector('.ingredient-item');
      const details = document.querySelector('.ingredient-details');

      item?.click();
      expect(details?.classList.contains('active')).toBe(true);

      item?.click();
      expect(details?.classList.contains('active')).toBe(false);
    });
  });

  describe('initPersonalizationQuiz', () => {
    it('should handle quiz submission and show recommendations', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({
          recommendations: [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' }
          ]
        })
      });
      global.fetch = mockFetch;

      const form = document.querySelector('.quiz-form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      // Wait for fetch
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      );
    });
  });
});
