/**
 * Cross-AI Communication Protocol
 * Handles real-time communication and coordination between multiple AI agents
 * Part of the Autonomous AI Team Orchestrator system
 */

const EventEmitter = require('events');
const WebSocket = require('ws');
const crypto = require('crypto');

class CrossAIProtocol extends EventEmitter {
    constructor(realtimeHub, aiApiManager) {
        super();
        
        this.realtimeHub = realtimeHub;
        this.aiApiManager = aiApiManager;
        
        // Protocol state
        this.activeConnections = new Map(); // AI service connections
        this.messageQueue = new Map(); // Pending messages per AI
        this.synchronizationPoints = new Map(); // Cross-AI sync points
        this.conflictResolutions = new Map(); // Active conflicts
        
        // Message tracking
        this.messageHistory = [];
        this.pendingResponses = new Map();
        
        // Protocol configuration
        this.config = {
            messageTimeout: 30000, // 30 seconds
            maxRetries: 3,
            syncTimeout: 60000, // 1 minute
            heartbeatInterval: 10000 // 10 seconds
        };
        
        this.initializeProtocol();
    }
    
    /**
     * Message types for cross-AI communication
     */
    static MESSAGE_TYPES = {
        // Task coordination
        TASK_REQUEST: 'task_request',
        TASK_ACCEPT: 'task_accept',
        TASK_REJECT: 'task_reject',
        TASK_COMPLETE: 'task_complete',
        TASK_UPDATE: 'task_update',
        
        // Dependencies
        DEPENDENCY_REQUEST: 'dependency_request',
        DEPENDENCY_READY: 'dependency_ready',
        DEPENDENCY_CHANGED: 'dependency_changed',
        
        // Synchronization
        SYNC_REQUEST: 'sync_request',
        SYNC_RESPONSE: 'sync_response',
        SYNC_COMPLETE: 'sync_complete',
        
        // Conflicts
        CONFLICT_DETECTED: 'conflict_detected',
        CONFLICT_RESOLUTION: 'conflict_resolution',
        CONFLICT_RESOLVED: 'conflict_resolved',
        
        // Status
        HEARTBEAT: 'heartbeat',
        STATUS_UPDATE: 'status_update',
        
        // Project coordination
        PROJECT_START: 'project_start',
        PROJECT_PHASE_CHANGE: 'project_phase_change',
        PROJECT_COMPLETE: 'project_complete',
        
        // Resource sharing
        RESOURCE_REQUEST: 'resource_request',
        RESOURCE_LOCK: 'resource_lock',
        RESOURCE_UNLOCK: 'resource_unlock'
    };
    
    /**
     * Initialize the cross-AI communication protocol
     */
    initializeProtocol() {
        // Set up WebSocket server for AI connections
        this.setupAIWebSocketServer();
        
        // Initialize heartbeat system
        this.startHeartbeat();
        
        // Set up conflict resolution system
        this.initializeConflictResolution();
        
        console.log('🔗 Cross-AI Protocol initialized');
    }
    
    /**
     * Set up WebSocket server for AI agent connections
     */
    setupAIWebSocketServer() {
        // Use existing realtime hub infrastructure
        if (this.realtimeHub && this.realtimeHub.io) {
            // Create AI-specific namespace
            this.aiNamespace = this.realtimeHub.io.of('/ai-coordination');
            
            this.aiNamespace.on('connection', (socket) => {
                console.log('🤖 AI agent connected:', socket.id);
                
                // Handle AI registration
                socket.on('register-ai', (data) => {
                    this.registerAIConnection(socket, data);
                });
                
                // Handle AI messages
                socket.on('ai-message', (message) => {
                    this.handleAIMessage(socket, message);
                });
                
                // Handle disconnection
                socket.on('disconnect', () => {
                    this.handleAIDisconnection(socket);
                });
            });
        }
    }
    
    /**
     * Register a new AI agent connection
     */
    registerAIConnection(socket, registrationData) {
        const aiAgent = {
            id: registrationData.aiId,
            name: registrationData.name,
            specializations: registrationData.specializations,
            socket: socket,
            status: 'connected',
            connectedAt: new Date(),
            lastHeartbeat: new Date(),
            activeTasks: [],
            capabilities: registrationData.capabilities || []
        };
        
        this.activeConnections.set(registrationData.aiId, aiAgent);
        this.messageQueue.set(registrationData.aiId, []);
        
        // Acknowledge registration
        socket.emit('registration-confirmed', {
            success: true,
            protocolVersion: '1.0',
            supportedMessageTypes: Object.values(CrossAIProtocol.MESSAGE_TYPES)
        });
        
        this.emit('ai-registered', aiAgent);
        console.log(`✅ AI agent registered: ${aiAgent.name} (${aiAgent.id})`);
    }
    
    /**
     * Handle incoming messages from AI agents
     */
    async handleAIMessage(socket, message) {
        try {
            // Validate message structure
            if (!this.validateMessage(message)) {
                socket.emit('message-error', { error: 'Invalid message format' });
                return;
            }
            
            // Find sender AI
            const senderAI = Array.from(this.activeConnections.values())
                .find(ai => ai.socket.id === socket.id);
            
            if (!senderAI) {
                socket.emit('message-error', { error: 'AI not registered' });
                return;
            }
            
            // Add message to history
            this.messageHistory.push({
                ...message,
                senderId: senderAI.id,
                timestamp: new Date(),
                messageId: this.generateMessageId()
            });
            
            // Route message based on type
            await this.routeMessage(senderAI, message);
            
        } catch (error) {
            console.error('❌ Error handling AI message:', error);
            socket.emit('message-error', { error: error.message });
        }
    }
    
    /**
     * Route message to appropriate handler
     */
    async routeMessage(senderAI, message) {
        const { type, target, data } = message;
        
        switch (type) {
            case CrossAIProtocol.MESSAGE_TYPES.TASK_REQUEST:
                await this.handleTaskRequest(senderAI, target, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.TASK_COMPLETE:
                await this.handleTaskComplete(senderAI, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_REQUEST:
                await this.handleDependencyRequest(senderAI, target, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_READY:
                await this.handleDependencyReady(senderAI, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.CONFLICT_DETECTED:
                await this.handleConflictDetection(senderAI, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.SYNC_REQUEST:
                await this.handleSyncRequest(senderAI, target, data);
                break;
                
            case CrossAIProtocol.MESSAGE_TYPES.HEARTBEAT:
                await this.handleHeartbeat(senderAI, data);
                break;
                
            default:
                // Broadcast to specific target or all AIs
                if (target && target !== 'broadcast') {
                    await this.sendMessageToAI(target, message);
                } else {
                    await this.broadcastToTeam(message, senderAI.id);
                }
        }
    }
    
    /**
     * Handle task request between AIs
     */
    async handleTaskRequest(requesterAI, targetAI, taskData) {
        const target = this.activeConnections.get(targetAI);
        if (!target) {
            // Send rejection back to requester
            this.sendMessageToAI(requesterAI.id, {
                type: CrossAIProtocol.MESSAGE_TYPES.TASK_REJECT,
                data: { reason: 'Target AI not available', taskId: taskData.taskId }
            });
            return;
        }
        
        // Check if target AI has required specialization
        const hasSpecialization = taskData.requiredSpecialization ? 
            target.specializations.includes(taskData.requiredSpecialization) : true;
        
        if (!hasSpecialization) {
            this.sendMessageToAI(requesterAI.id, {
                type: CrossAIProtocol.MESSAGE_TYPES.TASK_REJECT,
                data: { 
                    reason: 'Missing required specialization', 
                    taskId: taskData.taskId,
                    requiredSpecialization: taskData.requiredSpecialization
                }
            });
            return;
        }
        
        // Forward task request to target AI
        this.sendMessageToAI(targetAI, {
            type: CrossAIProtocol.MESSAGE_TYPES.TASK_REQUEST,
            sender: requesterAI.id,
            data: taskData
        });
        
        // Set up timeout for response
        setTimeout(() => {
            if (!this.hasTaskResponse(taskData.taskId)) {
                this.sendMessageToAI(requesterAI.id, {
                    type: CrossAIProtocol.MESSAGE_TYPES.TASK_REJECT,
                    data: { reason: 'Timeout', taskId: taskData.taskId }
                });
            }
        }, this.config.messageTimeout);
    }
    
    /**
     * Handle task completion notification
     */
    async handleTaskComplete(senderAI, taskData) {
        const { taskId, result, dependents } = taskData;
        
        // Notify dependent AIs
        if (dependents && Array.isArray(dependents)) {
            for (const dependentAI of dependents) {
                this.sendMessageToAI(dependentAI, {
                    type: CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_READY,
                    sender: senderAI.id,
                    data: {
                        taskId,
                        result,
                        dependency: taskData.dependency
                    }
                });
            }
        }
        
        // Update AI status
        senderAI.activeTasks = senderAI.activeTasks.filter(t => t.id !== taskId);
        
        this.emit('task-completed', {
            aiId: senderAI.id,
            taskId,
            result
        });
    }
    
    /**
     * Handle dependency requests
     */
    async handleDependencyRequest(requesterAI, providerAI, dependencyData) {
        const provider = this.activeConnections.get(providerAI);
        if (!provider) {
            this.sendMessageToAI(requesterAI.id, {
                type: CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_READY,
                data: { 
                    error: 'Provider AI not available',
                    dependencyId: dependencyData.dependencyId
                }
            });
            return;
        }
        
        // Forward dependency request
        this.sendMessageToAI(providerAI, {
            type: CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_REQUEST,
            sender: requesterAI.id,
            data: dependencyData
        });
    }
    
    /**
     * Handle conflict detection
     */
    async handleConflictDetection(reporterAI, conflictData) {
        const conflictId = this.generateConflictId();
        const conflict = {
            id: conflictId,
            reportedBy: reporterAI.id,
            type: conflictData.type,
            description: conflictData.description,
            involvedAIs: conflictData.involvedAIs || [],
            resources: conflictData.resources || [],
            timestamp: new Date(),
            status: 'active'
        };
        
        this.conflictResolutions.set(conflictId, conflict);
        
        // Start conflict resolution process
        await this.initiateConflictResolution(conflict);
        
        this.emit('conflict-detected', conflict);
    }
    
    /**
     * Handle synchronization requests
     */
    async handleSyncRequest(requesterAI, targetGroup, syncData) {
        const syncId = this.generateSyncId();
        const syncPoint = {
            id: syncId,
            initiator: requesterAI.id,
            participants: targetGroup === 'all' ? 
                Array.from(this.activeConnections.keys()) : 
                Array.isArray(targetGroup) ? targetGroup : [targetGroup],
            syncData,
            responses: new Map(),
            timestamp: new Date(),
            timeout: Date.now() + this.config.syncTimeout
        };
        
        this.synchronizationPoints.set(syncId, syncPoint);
        
        // Send sync request to all participants
        for (const participantId of syncPoint.participants) {
            if (participantId !== requesterAI.id) {
                this.sendMessageToAI(participantId, {
                    type: CrossAIProtocol.MESSAGE_TYPES.SYNC_REQUEST,
                    sender: requesterAI.id,
                    data: {
                        syncId,
                        syncData,
                        timeout: this.config.syncTimeout
                    }
                });
            }
        }
        
        // Set up timeout
        setTimeout(() => {
            this.processSyncTimeout(syncId);
        }, this.config.syncTimeout);
    }
    
    /**
     * Send message to specific AI
     */
    async sendMessageToAI(aiId, message) {
        const ai = this.activeConnections.get(aiId);
        if (!ai || !ai.socket) {
            console.warn(`⚠️  AI ${aiId} not available for message delivery`);
            return false;
        }
        
        try {
            ai.socket.emit('ai-message', {
                ...message,
                timestamp: new Date(),
                messageId: this.generateMessageId()
            });
            return true;
        } catch (error) {
            console.error(`❌ Failed to send message to AI ${aiId}:`, error);
            return false;
        }
    }
    
    /**
     * Broadcast message to all connected AIs (except sender)
     */
    async broadcastToTeam(message, excludeAI = null) {
        const broadcastPromises = [];
        
        for (const [aiId, ai] of this.activeConnections) {
            if (aiId !== excludeAI && ai.socket) {
                broadcastPromises.push(
                    this.sendMessageToAI(aiId, {
                        ...message,
                        broadcast: true
                    })
                );
            }
        }
        
        const results = await Promise.allSettled(broadcastPromises);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        
        console.log(`📡 Broadcast sent to ${successful}/${results.length} AIs`);
        return successful;
    }
    
    /**
     * Wait for specific dependencies to be ready
     */
    async waitForDependencies(taskId, dependencies, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const readyDependencies = new Set();
            
            const checkDependencies = () => {
                if (readyDependencies.size === dependencies.length) {
                    resolve(Array.from(readyDependencies));
                    return;
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Dependency timeout for task ${taskId}`));
                    return;
                }
                
                setTimeout(checkDependencies, 1000);
            };
            
            // Listen for dependency ready messages
            const dependencyHandler = (message) => {
                if (message.type === CrossAIProtocol.MESSAGE_TYPES.DEPENDENCY_READY &&
                    message.data.taskId === taskId) {
                    readyDependencies.add(message.data.dependency);
                }
            };
            
            this.on('message-received', dependencyHandler);
            
            checkDependencies();
            
            // Cleanup listener after resolution/rejection
            setTimeout(() => {
                this.off('message-received', dependencyHandler);
            }, timeout + 1000);
        });
    }
    
    /**
     * Initiate conflict resolution process
     */
    async initiateConflictResolution(conflict) {
        console.log(`⚔️  Initiating conflict resolution for: ${conflict.description}`);
        
        // Simple conflict resolution strategy
        // In a real implementation, this would be much more sophisticated
        
        const resolution = {
            strategy: this.determineResolutionStrategy(conflict),
            priority: this.calculateConflictPriority(conflict),
            recommendations: this.generateResolutionRecommendations(conflict)
        };
        
        // Notify involved AIs about conflict resolution
        for (const aiId of conflict.involvedAIs) {
            this.sendMessageToAI(aiId, {
                type: CrossAIProtocol.MESSAGE_TYPES.CONFLICT_RESOLUTION,
                data: {
                    conflictId: conflict.id,
                    resolution,
                    action: 'review_and_respond'
                }
            });
        }
        
        return resolution;
    }
    
    /**
     * Determine conflict resolution strategy
     */
    determineResolutionStrategy(conflict) {
        // Simplified strategy determination
        switch (conflict.type) {
            case 'resource_conflict':
                return 'priority_based_allocation';
            case 'task_overlap':
                return 'task_redistribution';
            case 'dependency_deadlock':
                return 'dependency_reordering';
            default:
                return 'collaborative_resolution';
        }
    }
    
    /**
     * Calculate conflict priority
     */
    calculateConflictPriority(conflict) {
        // Simple priority calculation
        let priority = 5; // Base priority
        
        if (conflict.involvedAIs.length > 2) priority += 2;
        if (conflict.resources.length > 1) priority += 1;
        if (conflict.type === 'dependency_deadlock') priority += 3;
        
        return Math.min(priority, 10);
    }
    
    /**
     * Generate resolution recommendations
     */
    generateResolutionRecommendations(conflict) {
        const recommendations = [];
        
        switch (conflict.type) {
            case 'resource_conflict':
                recommendations.push('Consider resource sharing or queuing');
                recommendations.push('Evaluate task priorities and deadlines');
                break;
            case 'task_overlap':
                recommendations.push('Redistribute overlapping tasks');
                recommendations.push('Establish clear task boundaries');
                break;
            default:
                recommendations.push('Review conflict details collaboratively');
                recommendations.push('Seek human intervention if needed');
        }
        
        return recommendations;
    }
    
    /**
     * Start heartbeat system
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.performHeartbeatCheck();
        }, this.config.heartbeatInterval);
    }
    
    /**
     * Perform heartbeat check on all connected AIs
     */
    performHeartbeatCheck() {
        const now = new Date();
        
        for (const [aiId, ai] of this.activeConnections) {
            const timeSinceHeartbeat = now - ai.lastHeartbeat;
            
            if (timeSinceHeartbeat > this.config.heartbeatInterval * 3) {
                // AI hasn't responded to heartbeat in 3 intervals
                console.warn(`⚠️  AI ${ai.name} appears unresponsive`);
                ai.status = 'unresponsive';
                this.emit('ai-unresponsive', ai);
            } else {
                // Send heartbeat request
                this.sendMessageToAI(aiId, {
                    type: CrossAIProtocol.MESSAGE_TYPES.HEARTBEAT,
                    data: { timestamp: now }
                });
            }
        }
    }
    
    /**
     * Handle heartbeat response
     */
    async handleHeartbeat(senderAI, data) {
        senderAI.lastHeartbeat = new Date();
        if (senderAI.status === 'unresponsive') {
            senderAI.status = 'connected';
            this.emit('ai-recovered', senderAI);
        }
    }
    
    /**
     * Handle AI disconnection
     */
    handleAIDisconnection(socket) {
        const disconnectedAI = Array.from(this.activeConnections.values())
            .find(ai => ai.socket.id === socket.id);
        
        if (disconnectedAI) {
            console.log(`🔌 AI agent disconnected: ${disconnectedAI.name}`);
            this.activeConnections.delete(disconnectedAI.id);
            this.messageQueue.delete(disconnectedAI.id);
            
            this.emit('ai-disconnected', disconnectedAI);
        }
    }
    
    /**
     * Utility methods
     */
    generateMessageId() {
        return crypto.randomBytes(16).toString('hex');
    }
    
    generateConflictId() {
        return 'conflict-' + crypto.randomBytes(8).toString('hex');
    }
    
    generateSyncId() {
        return 'sync-' + crypto.randomBytes(8).toString('hex');
    }
    
    validateMessage(message) {
        return message && 
               typeof message.type === 'string' && 
               message.data !== undefined;
    }
    
    hasTaskResponse(taskId) {
        return this.pendingResponses.has(taskId);
    }
    
    /**
     * Get protocol statistics
     */
    getProtocolStats() {
        return {
            connectedAIs: this.activeConnections.size,
            totalMessages: this.messageHistory.length,
            activeSyncs: this.synchronizationPoints.size,
            activeConflicts: this.conflictResolutions.size,
            messageQueueSizes: Object.fromEntries(
                Array.from(this.messageQueue.entries())
                    .map(([id, queue]) => [id, queue.length])
            )
        };
    }
    
    /**
     * Cleanup and shutdown
     */
    shutdown() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        // Close all AI connections
        for (const [aiId, ai] of this.activeConnections) {
            if (ai.socket) {
                ai.socket.disconnect();
            }
        }
        
        this.activeConnections.clear();
        this.messageQueue.clear();
        this.synchronizationPoints.clear();
        this.conflictResolutions.clear();
        
        this.emit('protocol-shutdown');
        console.log('🔴 Cross-AI Protocol shutdown complete');
    }
}

module.exports = { CrossAIProtocol };

// CLI testing interface
if (require.main === module) {
    console.log('🔗 Cross-AI Protocol - Testing Interface\n');
    
    // Mock realtime hub for testing
    const mockRealtimeHub = {
        io: {
            of: (namespace) => ({
                on: (event, handler) => {
                    console.log(`📡 Mock namespace ${namespace} listening for ${event}`);
                }
            })
        }
    };
    
    const protocol = new CrossAIProtocol(mockRealtimeHub);
    
    console.log('✅ Protocol initialized');
    console.log('📊 Protocol stats:', protocol.getProtocolStats());
    
    // Simulate some protocol operations
    setTimeout(() => {
        console.log('🔄 Running protocol simulation...');
        
        // Simulate conflict detection
        protocol.emit('conflict-detected', {
            type: 'resource_conflict',
            description: 'Two AIs attempting to modify the same file',
            involvedAIs: ['claude', 'gpt4']
        });
        
        console.log('✅ Simulation complete');
        protocol.shutdown();
    }, 2000);
}