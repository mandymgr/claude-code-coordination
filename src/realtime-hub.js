#!/usr/bin/env node

/**
 * Claude Code Coordination - Real-time WebSocket Hub v4.0
 * Revolutionary real-time coordination with live collaboration features
 */

const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class RealTimeCoordinationHub {
    constructor(options = {}) {
        this.port = options.port || 3334;
        this.coordinationDir = path.resolve(options.coordinationDir || '.claude-coordination');
        
        // Real-time state
        this.connectedSessions = new Map();
        this.activeRooms = new Map();
        this.liveCollaborations = new Map();
        this.messageQueue = [];
        
        // WebSocket server setup
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        
        // Initialize features
        this.setupWebSocketHandlers();
        this.setupRESTAPI();
        this.setupStaticFiles();
        this.startHeartbeat();
    }

    /**
     * Setup WebSocket connection handlers
     */
    setupWebSocketHandlers() {
        this.wss.on('connection', (ws, request) => {
            const sessionId = this.extractSessionId(request);
            const clientInfo = {
                id: sessionId,
                ws: ws,
                connectedAt: Date.now(),
                lastHeartbeat: Date.now(),
                room: null,
                metadata: {}
            };

            this.connectedSessions.set(sessionId, clientInfo);
            
            console.log(`🔌 Session connected: ${sessionId.substring(0, 8)}... (${this.connectedSessions.size} total)`);
            
            // Send welcome message
            this.sendToSession(sessionId, {
                type: 'welcome',
                sessionId: sessionId,
                connectedSessions: this.getSessionList(),
                features: ['live_collaboration', 'real_time_messaging', 'code_sharing', 'voice_coordination']
            });

            // Broadcast new session to others
            this.broadcastToOthers(sessionId, {
                type: 'session_joined',
                sessionId: sessionId,
                timestamp: Date.now()
            });

            // Setup message handlers
            ws.on('message', (message) => {
                this.handleWebSocketMessage(sessionId, message);
            });

            ws.on('close', () => {
                this.handleSessionDisconnect(sessionId);
            });

            ws.on('error', (error) => {
                console.error(`❌ WebSocket error for ${sessionId}: ${error.message}`);
            });
        });
    }

    /**
     * Handle WebSocket messages from clients
     */
    handleWebSocketMessage(sessionId, rawMessage) {
        try {
            const message = JSON.parse(rawMessage);
            const client = this.connectedSessions.get(sessionId);
            
            if (!client) return;

            switch (message.type) {
                case 'heartbeat':
                    client.lastHeartbeat = Date.now();
                    this.sendToSession(sessionId, { type: 'heartbeat_ack' });
                    break;

                case 'join_room':
                    this.handleJoinRoom(sessionId, message.room, message.metadata);
                    break;

                case 'leave_room':
                    this.handleLeaveRoom(sessionId);
                    break;

                case 'broadcast_message':
                    this.handleBroadcastMessage(sessionId, message);
                    break;

                case 'private_message':
                    this.handlePrivateMessage(sessionId, message);
                    break;

                case 'code_share':
                    this.handleCodeShare(sessionId, message);
                    break;

                case 'file_lock_request':
                    this.handleFileLockRequest(sessionId, message);
                    break;

                case 'task_update':
                    this.handleTaskUpdate(sessionId, message);
                    break;

                case 'collaboration_invite':
                    this.handleCollaborationInvite(sessionId, message);
                    break;

                case 'voice_coordination':
                    this.handleVoiceCoordination(sessionId, message);
                    break;

                default:
                    console.warn(`Unknown message type: ${message.type}`);
            }
        } catch (error) {
            console.error(`Error handling message from ${sessionId}: ${error.message}`);
        }
    }

    /**
     * Handle room-based coordination
     */
    handleJoinRoom(sessionId, roomName, metadata = {}) {
        const client = this.connectedSessions.get(sessionId);
        if (!client) return;

        // Leave current room if in one
        if (client.room) {
            this.handleLeaveRoom(sessionId);
        }

        // Join new room
        if (!this.activeRooms.has(roomName)) {
            this.activeRooms.set(roomName, {
                name: roomName,
                members: new Set(),
                createdAt: Date.now(),
                metadata: {}
            });
        }

        const room = this.activeRooms.get(roomName);
        room.members.add(sessionId);
        client.room = roomName;
        client.metadata = metadata;

        // Notify room members
        this.broadcastToRoom(roomName, {
            type: 'member_joined',
            sessionId: sessionId,
            roomName: roomName,
            metadata: metadata,
            memberCount: room.members.size
        });

        // Send room info to new member
        this.sendToSession(sessionId, {
            type: 'room_joined',
            roomName: roomName,
            members: this.getRoomMemberList(roomName),
            metadata: room.metadata
        });

        console.log(`🏠 Session ${sessionId.substring(0, 8)}... joined room: ${roomName}`);
    }

    /**
     * Handle leaving rooms
     */
    handleLeaveRoom(sessionId) {
        const client = this.connectedSessions.get(sessionId);
        if (!client || !client.room) return;

        const room = this.activeRooms.get(client.room);
        if (room) {
            room.members.delete(sessionId);
            
            // Notify remaining members
            this.broadcastToRoom(client.room, {
                type: 'member_left',
                sessionId: sessionId,
                roomName: client.room,
                memberCount: room.members.size
            });

            // Remove empty rooms
            if (room.members.size === 0) {
                this.activeRooms.delete(client.room);
            }
        }

        client.room = null;
        console.log(`🏠 Session ${sessionId.substring(0, 8)}... left room`);
    }

    /**
     * Handle broadcasting messages
     */
    handleBroadcastMessage(sessionId, message) {
        const broadcastData = {
            type: 'broadcast_received',
            from: sessionId,
            message: message.content,
            priority: message.priority || 'normal',
            timestamp: Date.now()
        };

        if (message.target === 'room' && message.room) {
            this.broadcastToRoom(message.room, broadcastData);
        } else {
            this.broadcastToAll(broadcastData, sessionId);
        }

        // Store in message history
        this.messageQueue.push({
            ...broadcastData,
            id: uuidv4()
        });

        // Keep only last 100 messages
        if (this.messageQueue.length > 100) {
            this.messageQueue = this.messageQueue.slice(-100);
        }
    }

    /**
     * Handle private messaging
     */
    handlePrivateMessage(sessionId, message) {
        const targetSession = message.target;
        if (!this.connectedSessions.has(targetSession)) {
            this.sendToSession(sessionId, {
                type: 'message_error',
                error: 'Target session not connected'
            });
            return;
        }

        this.sendToSession(targetSession, {
            type: 'private_message_received',
            from: sessionId,
            message: message.content,
            timestamp: Date.now()
        });
    }

    /**
     * Handle live code sharing
     */
    handleCodeShare(sessionId, message) {
        const shareData = {
            type: 'code_shared',
            from: sessionId,
            file: message.file,
            content: message.content,
            language: message.language,
            changes: message.changes,
            timestamp: Date.now()
        };

        if (message.target === 'room' && message.room) {
            this.broadcastToRoom(message.room, shareData);
        } else if (message.target === 'session') {
            this.sendToSession(message.targetSession, shareData);
        } else {
            this.broadcastToAll(shareData, sessionId);
        }
    }

    /**
     * Handle file locking requests
     */
    handleFileLockRequest(sessionId, message) {
        const lockData = {
            file: message.file,
            operation: message.operation,
            sessionId: sessionId,
            timestamp: Date.now()
        };

        // Broadcast lock request to all sessions
        this.broadcastToAll({
            type: 'file_lock_requested',
            ...lockData
        }, sessionId);

        // TODO: Integrate with existing file lock system
        console.log(`🔒 File lock requested: ${message.file} by ${sessionId.substring(0, 8)}...`);
    }

    /**
     * Handle task updates
     */
    handleTaskUpdate(sessionId, message) {
        const client = this.connectedSessions.get(sessionId);
        if (!client) return;

        client.metadata.currentTask = message.task;

        // Broadcast task update
        this.broadcastToOthers(sessionId, {
            type: 'task_updated',
            sessionId: sessionId,
            task: message.task,
            status: message.status,
            timestamp: Date.now()
        });
    }

    /**
     * Handle collaboration invitations
     */
    handleCollaborationInvite(sessionId, message) {
        const collaborationId = uuidv4();
        const collaboration = {
            id: collaborationId,
            initiator: sessionId,
            invitees: message.invitees,
            purpose: message.purpose,
            files: message.files || [],
            createdAt: Date.now(),
            participants: new Set([sessionId])
        };

        this.liveCollaborations.set(collaborationId, collaboration);

        // Send invitations
        for (const invitee of message.invitees) {
            if (this.connectedSessions.has(invitee)) {
                this.sendToSession(invitee, {
                    type: 'collaboration_invite',
                    collaborationId: collaborationId,
                    from: sessionId,
                    purpose: message.purpose,
                    files: message.files
                });
            }
        }
    }

    /**
     * Handle voice coordination features
     */
    handleVoiceCoordination(sessionId, message) {
        // Placeholder for voice coordination features
        // This would integrate with WebRTC for voice/video calls
        console.log(`🎤 Voice coordination requested by ${sessionId.substring(0, 8)}...`);
        
        this.broadcastToOthers(sessionId, {
            type: 'voice_coordination',
            from: sessionId,
            action: message.action,
            data: message.data
        });
    }

    /**
     * Handle session disconnect
     */
    handleSessionDisconnect(sessionId) {
        const client = this.connectedSessions.get(sessionId);
        if (!client) return;

        // Leave room if in one
        if (client.room) {
            this.handleLeaveRoom(sessionId);
        }

        // Remove from connected sessions
        this.connectedSessions.delete(sessionId);

        // Broadcast disconnect
        this.broadcastToAll({
            type: 'session_disconnected',
            sessionId: sessionId,
            timestamp: Date.now()
        });

        console.log(`🔌 Session disconnected: ${sessionId.substring(0, 8)}... (${this.connectedSessions.size} remaining)`);
    }

    /**
     * Setup REST API endpoints
     */
    setupRESTAPI() {
        this.app.use(express.json());

        // Get connected sessions
        this.app.get('/api/sessions', (req, res) => {
            res.json({
                sessions: this.getSessionList(),
                rooms: this.getRoomList(),
                messageHistory: this.messageQueue.slice(-20)
            });
        });

        // Get room information
        this.app.get('/api/rooms/:roomName', (req, res) => {
            const room = this.activeRooms.get(req.params.roomName);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.json({
                name: room.name,
                members: this.getRoomMemberList(req.params.roomName),
                createdAt: room.createdAt,
                metadata: room.metadata
            });
        });

        // Send message via REST
        this.app.post('/api/broadcast', (req, res) => {
            const { sessionId, message, priority = 'normal' } = req.body;
            
            if (!sessionId || !message) {
                return res.status(400).json({ error: 'sessionId and message required' });
            }

            this.handleBroadcastMessage(sessionId, {
                content: message,
                priority: priority
            });

            res.json({ success: true, timestamp: Date.now() });
        });

        // Create collaboration
        this.app.post('/api/collaborate', (req, res) => {
            const { sessionId, invitees, purpose, files } = req.body;
            
            if (!sessionId || !invitees) {
                return res.status(400).json({ error: 'sessionId and invitees required' });
            }

            this.handleCollaborationInvite(sessionId, {
                invitees: invitees,
                purpose: purpose,
                files: files
            });

            res.json({ success: true });
        });
    }

    /**
     * Setup static file serving
     */
    setupStaticFiles() {
        // Serve the real-time dashboard
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'realtime-dashboard.html'));
        });

        // Serve static assets
        this.app.use('/static', express.static(path.join(__dirname, 'static')));
    }

    /**
     * Start heartbeat monitoring
     */
    startHeartbeat() {
        setInterval(() => {
            const now = Date.now();
            const timeoutThreshold = 60000; // 1 minute

            for (const [sessionId, client] of this.connectedSessions.entries()) {
                if (now - client.lastHeartbeat > timeoutThreshold) {
                    console.log(`⏰ Session ${sessionId.substring(0, 8)}... timed out`);
                    client.ws.terminate();
                    this.handleSessionDisconnect(sessionId);
                }
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Utility methods for messaging
     */
    
    sendToSession(sessionId, data) {
        const client = this.connectedSessions.get(sessionId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    broadcastToAll(data, excludeSession = null) {
        let sent = 0;
        for (const [sessionId, client] of this.connectedSessions.entries()) {
            if (sessionId !== excludeSession && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify(data));
                sent++;
            }
        }
        return sent;
    }

    broadcastToOthers(sessionId, data) {
        return this.broadcastToAll(data, sessionId);
    }

    broadcastToRoom(roomName, data) {
        const room = this.activeRooms.get(roomName);
        if (!room) return 0;

        let sent = 0;
        for (const sessionId of room.members) {
            if (this.sendToSession(sessionId, data)) {
                sent++;
            }
        }
        return sent;
    }

    getSessionList() {
        const sessions = [];
        for (const [sessionId, client] of this.connectedSessions.entries()) {
            sessions.push({
                id: sessionId,
                connectedAt: client.connectedAt,
                room: client.room,
                metadata: client.metadata
            });
        }
        return sessions;
    }

    getRoomList() {
        const rooms = [];
        for (const [roomName, room] of this.activeRooms.entries()) {
            rooms.push({
                name: roomName,
                memberCount: room.members.size,
                createdAt: room.createdAt,
                metadata: room.metadata
            });
        }
        return rooms;
    }

    getRoomMemberList(roomName) {
        const room = this.activeRooms.get(roomName);
        if (!room) return [];

        const members = [];
        for (const sessionId of room.members) {
            const client = this.connectedSessions.get(sessionId);
            if (client) {
                members.push({
                    id: sessionId,
                    metadata: client.metadata,
                    connectedAt: client.connectedAt
                });
            }
        }
        return members;
    }

    extractSessionId(request) {
        // Extract session ID from URL parameters, headers, or generate new one
        const url = new URL(request.url, 'http://localhost');
        return url.searchParams.get('sessionId') || 
               request.headers['x-session-id'] || 
               uuidv4();
    }

    /**
     * Start the real-time hub server
     */
    async start() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(`🌐 Real-time Coordination Hub running at:`);
                    console.log(`   HTTP: http://localhost:${this.port}`);
                    console.log(`   WebSocket: ws://localhost:${this.port}`);
                    console.log('');
                    console.log('🚀 Features:');
                    console.log('   • Real-time session coordination');
                    console.log('   • Live code sharing and collaboration');
                    console.log('   • Room-based team coordination');
                    console.log('   • File locking with live notifications');
                    console.log('   • Voice coordination integration ready');
                    console.log('   • REST API for external integrations');
                    console.log('');
                    console.log('📱 Ready for real-time coordination!');
                    resolve();
                }
            });
        });
    }

    /**
     * Stop the server
     */
    async stop() {
        return new Promise((resolve) => {
            // Close all WebSocket connections
            for (const [sessionId, client] of this.connectedSessions.entries()) {
                client.ws.close(1000, 'Server shutting down');
            }

            this.server.close(() => {
                console.log('👋 Real-time Hub stopped');
                resolve();
            });
        });
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3334;
    const coordDir = args.find(arg => arg.startsWith('--coord-dir='))?.split('=')[1] || '.claude-coordination';
    
    const hub = new RealTimeCoordinationHub({ port, coordinationDir: coordDir });
    
    try {
        await hub.start();
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n👋 Shutting down Real-time Hub...');
            await hub.stop();
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`❌ Failed to start Real-time Hub: ${error.message}`);
        process.exit(1);
    }
}

// Export for use as module
module.exports = RealTimeCoordinationHub;

// Run CLI if executed directly
if (require.main === module) {
    main();
}