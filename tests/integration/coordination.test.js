const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

describe('Coordination System Integration', () => {
    const testDir = path.join(__dirname, '../tmp');
    
    beforeAll(() => {
        // Create test directory
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterAll(() => {
        // Clean up test directory
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    test('should have AI coordinator available', () => {
        const aiCoordinatorPath = path.join(__dirname, '../../src/ai-coordinator.js');
        expect(fs.existsSync(aiCoordinatorPath)).toBe(true);
    });

    test('should show help for AI coordinator', async () => {
        const { stdout } = await execAsync('node src/ai-coordinator.js --help', {
            cwd: path.join(__dirname, '../..')
        });
        
        expect(stdout).toContain('AI Coordinator');
        expect(stdout).toContain('suggest');
        expect(stdout).toContain('predict');
        expect(stdout).toContain('assign');
    });

    test('should handle invalid commands gracefully', async () => {
        try {
            await execAsync('node src/ai-coordinator.js invalid-command', {
                cwd: path.join(__dirname, '../..')
            });
        } catch (error) {
            // Should show help for invalid commands
            expect(error.stdout || error.stderr).toContain('Usage');
        }
    });

    test('should have session manager available', () => {
        const sessionManagerPath = path.join(__dirname, '../../src/session-manager.js');
        expect(fs.existsSync(sessionManagerPath)).toBe(true);
    });

    test('should have dashboard files available', () => {
        const dashboardPath = path.join(__dirname, '../../src/dashboard.html');
        const serverPath = path.join(__dirname, '../../src/dashboard-server.js');
        
        expect(fs.existsSync(dashboardPath)).toBe(true);
        expect(fs.existsSync(serverPath)).toBe(true);
    });

    test('should have executable permissions on scripts', () => {
        const scripts = [
            'src/ai-coordinator.js',
            'src/session-manager.js',
            'src/dashboard-server.js',
            'src/ai-integration.sh'
        ];

        for (const script of scripts) {
            const scriptPath = path.join(__dirname, '../../', script);
            if (fs.existsSync(scriptPath)) {
                const stats = fs.statSync(scriptPath);
                const isExecutable = (stats.mode & parseInt('111', 8)) !== 0;
                expect(isExecutable).toBe(true);
            }
        }
    });
});