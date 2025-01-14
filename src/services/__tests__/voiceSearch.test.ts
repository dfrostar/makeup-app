import { VoiceSearchService } from '../voiceSearch';

describe('VoiceSearchService', () => {
    let voiceService: VoiceSearchService;
    let mockRecognition: any;

    beforeEach(() => {
        // Mock SpeechRecognition instance with getters and setters
        mockRecognition = {
            _continuous: false,
            _interimResults: false,
            _lang: '',
            _maxAlternatives: 1,
            get continuous() { 
                console.log('Getting continuous:', this._continuous);
                return this._continuous; 
            },
            set continuous(value) { 
                console.log('Setting continuous:', value);
                this._continuous = value; 
            },
            get interimResults() { 
                console.log('Getting interimResults:', this._interimResults);
                return this._interimResults; 
            },
            set interimResults(value) { 
                console.log('Setting interimResults:', value);
                this._interimResults = value; 
            },
            get lang() { 
                console.log('Getting lang:', this._lang);
                return this._lang; 
            },
            set lang(value) { 
                console.log('Setting lang:', value);
                this._lang = value; 
            },
            get maxAlternatives() { 
                console.log('Getting maxAlternatives:', this._maxAlternatives);
                return this._maxAlternatives; 
            },
            set maxAlternatives(value) { 
                console.log('Setting maxAlternatives:', value);
                this._maxAlternatives = value; 
            },
            start: jest.fn(),
            stop: jest.fn(),
            onstart: jest.fn(),
            onend: jest.fn(),
            onresult: jest.fn(),
            onerror: jest.fn()
        };

        // Mock window with SpeechRecognition
        console.log('Setting up window.webkitSpeechRecognition mock');
        (global as any).window = {
            webkitSpeechRecognition: jest.fn().mockImplementation(() => {
                console.log('Creating new SpeechRecognition instance');
                const recognition = Object.create(mockRecognition);
                recognition._continuous = false;
                recognition._interimResults = false;
                recognition._lang = '';
                recognition._maxAlternatives = 1;
                return recognition;
            })
        };

        // Create service after setting up mock
        console.log('Creating VoiceSearchService instance');
        voiceService = new VoiceSearchService();
        console.log('VoiceSearchService instance created');
    });

    afterEach(() => {
        console.log('Cleaning up mocks');
        jest.clearAllMocks();
        delete (global as any).window;
    });

    it('should initialize with default options', (done) => {
        // Check if service is supported
        console.log('Checking if service is supported');
        expect(voiceService.isSupported()).toBe(true);

        // Give time for the initialization to complete
        setTimeout(() => {
            // Check if recognition object is initialized with correct options
            console.log('Checking recognition properties');
            const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
            
            expect(recognition.continuous).toBe(true);
            expect(recognition.interimResults).toBe(true);
            expect(recognition.lang).toBe('en-US');
            done();
        }, 0);
    });

    it('should start voice recognition', (done) => {
        voiceService.on('start', () => {
            console.log('Start event received');
            expect(mockRecognition.start).toHaveBeenCalled();
            done();
        });

        console.log('Starting voice recognition');
        voiceService.start();
        // Simulate start event by calling the callback directly
        const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
        recognition.onstart();
    });

    it('should stop voice recognition', (done) => {
        voiceService.on('end', () => {
            console.log('End event received');
            done();
        });

        console.log('Starting voice recognition');
        voiceService.start();
        const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
        recognition.onstart();
        
        console.log('Stopping voice recognition');
        voiceService.stop();
        expect(mockRecognition.stop).toHaveBeenCalled();
        recognition.onend();
    });

    it('should handle recognition results', (done) => {
        const mockTranscript = 'test query';
        const mockConfidence = 0.9;

        voiceService.on('result', (result) => {
            console.log('Result event received:', result);
            expect(result).toEqual({
                transcript: mockTranscript,
                confidence: mockConfidence,
                isFinal: true
            });
            done();
        });

        console.log('Starting voice recognition');
        voiceService.start();
        const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
        recognition.onstart();

        // Simulate recognition result
        console.log('Simulating recognition result');
        recognition.onresult({
            resultIndex: 0,
            results: [{
                0: { transcript: mockTranscript, confidence: mockConfidence },
                isFinal: true,
                length: 1
            }]
        });
    });

    it('should process search commands', (done) => {
        voiceService.on('search', (query) => {
            console.log('Search event received:', query);
            expect(query).toBe('lipstick');
            done();
        });

        console.log('Starting voice recognition');
        voiceService.start();
        const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
        recognition.onstart();

        // Simulate final result with search command
        console.log('Simulating search command result');
        recognition.onresult({
            resultIndex: 0,
            results: [{
                0: { transcript: 'search for lipstick', confidence: 0.9 },
                isFinal: true,
                length: 1
            }]
        });
    });

    it('should handle recognition errors', (done) => {
        const mockError = new Error('Recognition error');

        voiceService.on('error', (error) => {
            console.log('Error event received:', error);
            expect(error).toBe(mockError);
            done();
        });

        console.log('Starting voice recognition');
        voiceService.start();
        const recognition = (global as any).window.webkitSpeechRecognition.mock.results[0].value;
        recognition.onstart();
        
        console.log('Simulating error event');
        recognition.onerror(mockError);
    });

    it('should handle unsupported browsers', () => {
        // Remove SpeechRecognition support
        console.log('Removing webkitSpeechRecognition from window');
        delete (global as any).window.webkitSpeechRecognition;

        // Set up error handler before creating service
        const errorHandler = jest.fn();

        // Create service in a try-catch block to handle the error
        try {
            console.log('Creating VoiceSearchService instance without speech recognition support');
            const unsupportedService = new VoiceSearchService();
            unsupportedService.on('error', errorHandler);
            expect(unsupportedService.isSupported()).toBe(false);
        } catch (error) {
            // Handle any synchronous errors
            expect(error).toEqual(new Error('Speech recognition not supported'));
        }
    });
});
