const AICoordinator = require('../../src/ai-coordinator.js');

describe('AI Coordinator', () => {
    let coordinator;

    beforeEach(() => {
        coordinator = new AICoordinator();
    });

    test('should initialize with default settings', () => {
        expect(coordinator).toBeDefined();
        expect(coordinator.learningRate).toBe(0.1);
        expect(coordinator.conflictThreshold).toBe(0.7);
    });

    test('should analyze task complexity', () => {
        const result = coordinator.analyzeTaskComplexity('implement authentication system');
        
        expect(result).toHaveProperty('complexity');
        expect(result).toHaveProperty('keywords');
        expect(result.keywords).toContain('authentication');
        expect(result.complexity).toBeGreaterThan(0);
    });

    test('should create session profile', () => {
        const sessionId = 'test-session-123';
        const profile = coordinator.getSessionProfile(sessionId);
        
        expect(profile).toHaveProperty('sessionId', sessionId);
        expect(profile).toHaveProperty('successfulTasks', 0);
        expect(profile).toHaveProperty('expertise');
        expect(profile.expertise).toEqual({});
    });

    test('should handle file type risk assessment', () => {
        const tsRisk = coordinator.fileTypeRisk['.ts'];
        const mdRisk = coordinator.fileTypeRisk['.md'];
        
        expect(tsRisk).toBe(0.8);
        expect(mdRisk).toBe(0.2);
        expect(tsRisk).toBeGreaterThan(mdRisk);
    });

    test('should extract technical terms from text', () => {
        const terms = coordinator.extractTechnicalTerms('implement api endpoint for authentication');
        
        expect(terms).toContain('api');
        expect(terms).toContain('endpoint');
        expect(terms).toContain('authentication');
    });
});