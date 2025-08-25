/**
 * Multi-User Coordination System
 * Handles real-time collaboration between multiple users building projects
 * 
 * Features:
 * - Live cursor tracking
 * - Conflict resolution
 * - Role-based collaboration
 * - Shared workspace management
 * - Real-time presence awareness
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

class MultiUserCoordinator extends EventEmitter {
    constructor() {
        super();
        this.sessions = new Map(); // sessionId -> session data
        this.users = new Map();    // userId -> user data
        this.projects = new Map(); // projectId -> project data
        this.conflicts = new Map(); // conflictId -> conflict data
        this.wsServer = null;
        this.port = 8080;
        
        this.initializeServer();
    }

    async initializeServer() {
        try {
            this.wsServer = new WebSocket.Server({ 
                port: this.port,
                perMessageDeflate: false
            });

            this.wsServer.on('connection', (ws, req) => {
                this.handleNewConnection(ws, req);
            });

            console.log(`🌐 Multi-User Coordination Server running on port ${this.port}`);
        } catch (error) {
            console.error('Failed to start Multi-User Coordinator:', error);
        }
    }

    handleNewConnection(ws, req) {
        const userId = this.generateUserId();
        const user = {
            id: userId,
            ws: ws,
            presence: 'online',
            currentProject: null,
            role: 'collaborator',
            cursor: { x: 0, y: 0 },
            selection: null,
            connectedAt: new Date().toISOString(),
            lastActivity: Date.now()
        };

        this.users.set(userId, user);

        // Send welcome message
        this.sendToUser(userId, {
            type: 'welcome',
            userId: userId,
            serverTime: new Date().toISOString()
        });

        // Handle incoming messages
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleUserMessage(userId, message);
            } catch (error) {
                console.error('Failed to parse user message:', error);
            }
        });

        // Handle disconnection
        ws.on('close', () => {
            this.handleUserDisconnect(userId);
        });

        // Handle connection errors
        ws.on('error', (error) => {
            console.error(`WebSocket error for user ${userId}:`, error);
            this.handleUserDisconnect(userId);
        });

        console.log(`👤 User ${userId} connected`);
        this.broadcastUserPresence();
    }

    handleUserMessage(userId, message) {
        const user = this.users.get(userId);
        if (!user) return;

        user.lastActivity = Date.now();

        switch (message.type) {
            case 'join_project':
                this.handleJoinProject(userId, message);
                break;
            case 'leave_project':
                this.handleLeaveProject(userId, message);
                break;
            case 'cursor_update':
                this.handleCursorUpdate(userId, message);
                break;
            case 'selection_update':
                this.handleSelectionUpdate(userId, message);
                break;
            case 'text_edit':
                this.handleTextEdit(userId, message);
                break;
            case 'role_change':
                this.handleRoleChange(userId, message);
                break;
            case 'build_request':
                this.handleBuildRequest(userId, message);
                break;
            case 'conflict_resolution':
                this.handleConflictResolution(userId, message);
                break;
            case 'presence_update':
                this.handlePresenceUpdate(userId, message);
                break;
            default:
                console.log(`Unknown message type: ${message.type}`);
        }
    }

    handleJoinProject(userId, message) {
        const { projectId, projectData } = message;
        const user = this.users.get(userId);
        
        if (!user) return;

        // Create or get existing project
        let project = this.projects.get(projectId);
        if (!project) {
            project = {
                id: projectId,
                name: projectData?.name || 'Untitled Project',
                description: projectData?.description || '',
                createdBy: userId,
                createdAt: new Date().toISOString(),
                collaborators: new Map(),
                buildStatus: 'idle',
                content: {
                    description: projectData?.description || '',
                    selectedTemplate: projectData?.selectedTemplate || null,
                    techStack: projectData?.techStack || 'react-ts'
                },
                history: [],
                locks: new Map() // filePath -> userId
            };
            this.projects.set(projectId, project);
        }

        // Add user as collaborator
        project.collaborators.set(userId, {
            userId: userId,
            role: user.role,
            joinedAt: new Date().toISOString(),
            contributions: 0
        });

        user.currentProject = projectId;

        // Send project state to user
        this.sendToUser(userId, {
            type: 'project_joined',
            projectId: projectId,
            project: {
                ...project,
                collaborators: Array.from(project.collaborators.values())
            }
        });

        // Notify other collaborators
        this.broadcastToProject(projectId, {
            type: 'user_joined',
            user: {
                id: userId,
                role: user.role,
                presence: user.presence
            }
        }, userId);

        console.log(`👤 User ${userId} joined project ${projectId}`);
    }

    handleLeaveProject(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        const projectId = user.currentProject;
        const project = this.projects.get(projectId);
        
        if (project) {
            // Remove user from project
            project.collaborators.delete(userId);
            
            // Release any locks held by this user
            for (const [filePath, lockUserId] of project.locks.entries()) {
                if (lockUserId === userId) {
                    project.locks.delete(filePath);
                    this.broadcastToProject(projectId, {
                        type: 'file_unlocked',
                        filePath: filePath,
                        unlockedBy: userId
                    });
                }
            }

            // Notify other collaborators
            this.broadcastToProject(projectId, {
                type: 'user_left',
                userId: userId
            });
        }

        user.currentProject = null;
        console.log(`👤 User ${userId} left project ${projectId}`);
    }

    handleCursorUpdate(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        user.cursor = message.cursor;

        // Broadcast cursor position to other project members
        this.broadcastToProject(user.currentProject, {
            type: 'cursor_moved',
            userId: userId,
            cursor: message.cursor
        }, userId);
    }

    handleSelectionUpdate(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        user.selection = message.selection;

        // Broadcast selection to other project members
        this.broadcastToProject(user.currentProject, {
            type: 'selection_changed',
            userId: userId,
            selection: message.selection
        }, userId);
    }

    handleTextEdit(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        const project = this.projects.get(user.currentProject);
        if (!project) return;

        const { field, operation, position, text, timestamp } = message;

        // Check for potential conflicts
        const conflict = this.detectConflict(project, userId, field, operation, position, timestamp);
        
        if (conflict) {
            // Handle conflict
            const conflictId = this.generateConflictId();
            this.conflicts.set(conflictId, {
                id: conflictId,
                projectId: user.currentProject,
                type: 'text_edit',
                users: conflict.users,
                field: field,
                operations: conflict.operations,
                timestamp: new Date().toISOString()
            });

            // Notify users about conflict
            conflict.users.forEach(conflictUserId => {
                this.sendToUser(conflictUserId, {
                    type: 'conflict_detected',
                    conflictId: conflictId,
                    conflict: this.conflicts.get(conflictId)
                });
            });
            return;
        }

        // Apply edit
        this.applyTextEdit(project, field, operation, position, text);

        // Add to project history
        project.history.push({
            type: 'text_edit',
            userId: userId,
            field: field,
            operation: operation,
            timestamp: new Date().toISOString(),
            position: position,
            text: text
        });

        // Broadcast edit to other collaborators
        this.broadcastToProject(user.currentProject, {
            type: 'text_edited',
            userId: userId,
            field: field,
            operation: operation,
            position: position,
            text: text,
            timestamp: timestamp
        }, userId);
    }

    detectConflict(project, userId, field, operation, position, timestamp) {
        // Simple conflict detection: check if another user edited the same field recently
        const recentEdits = project.history
            .filter(edit => 
                edit.field === field &&
                edit.userId !== userId &&
                Date.now() - new Date(edit.timestamp).getTime() < 5000 // 5 seconds
            );

        if (recentEdits.length > 0) {
            return {
                users: [userId, ...recentEdits.map(edit => edit.userId)],
                operations: [
                    { userId, operation, position, text: operation === 'insert' ? operation : '', timestamp },
                    ...recentEdits
                ]
            };
        }

        return null;
    }

    applyTextEdit(project, field, operation, position, text) {
        if (!project.content[field]) {
            project.content[field] = '';
        }

        switch (operation) {
            case 'insert':
                project.content[field] = 
                    project.content[field].slice(0, position) + 
                    text + 
                    project.content[field].slice(position);
                break;
            case 'delete':
                const deleteEnd = position + (text ? text.length : 1);
                project.content[field] = 
                    project.content[field].slice(0, position) + 
                    project.content[field].slice(deleteEnd);
                break;
            case 'replace':
                project.content[field] = text;
                break;
        }
    }

    handleRoleChange(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        const { targetUserId, newRole } = message;
        
        // Only project creator or admins can change roles
        const project = this.projects.get(user.currentProject);
        if (!project || (project.createdBy !== userId && user.role !== 'admin')) {
            this.sendToUser(userId, {
                type: 'error',
                message: 'Insufficient permissions to change roles'
            });
            return;
        }

        const targetUser = this.users.get(targetUserId);
        if (targetUser && targetUser.currentProject === user.currentProject) {
            targetUser.role = newRole;
            
            const collaborator = project.collaborators.get(targetUserId);
            if (collaborator) {
                collaborator.role = newRole;
            }

            // Notify all project members
            this.broadcastToProject(user.currentProject, {
                type: 'role_changed',
                userId: targetUserId,
                newRole: newRole,
                changedBy: userId
            });
        }
    }

    handleBuildRequest(userId, message) {
        const user = this.users.get(userId);
        if (!user || !user.currentProject) return;

        const project = this.projects.get(user.currentProject);
        if (!project) return;

        // Check if user has build permissions
        if (user.role === 'viewer') {
            this.sendToUser(userId, {
                type: 'error',
                message: 'Insufficient permissions to start build'
            });
            return;
        }

        // Check if build is already in progress
        if (project.buildStatus !== 'idle') {
            this.sendToUser(userId, {
                type: 'error',
                message: 'Build already in progress'
            });
            return;
        }

        // Start collaborative build
        this.startCollaborativeBuild(user.currentProject, userId);
    }

    async startCollaborativeBuild(projectId, initiatedBy) {
        const project = this.projects.get(projectId);
        if (!project) return;

        project.buildStatus = 'building';
        project.buildInitiatedBy = initiatedBy;
        project.buildStartTime = new Date().toISOString();

        // Notify all collaborators about build start
        this.broadcastToProject(projectId, {
            type: 'build_started',
            initiatedBy: initiatedBy,
            projectContent: project.content
        });

        try {
            // Simulate collaborative build process
            const buildSteps = [
                'Analyzing project requirements',
                'Setting up project structure',
                'Generating components',
                'Setting up backend services',
                'Integrating APIs',
                'Applying styling',
                'Running tests',
                'Building for production'
            ];

            for (let i = 0; i < buildSteps.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.broadcastToProject(projectId, {
                    type: 'build_progress',
                    step: i + 1,
                    totalSteps: buildSteps.length,
                    currentStep: buildSteps[i],
                    progress: ((i + 1) / buildSteps.length) * 100
                });
            }

            // Build completed
            project.buildStatus = 'completed';
            project.buildCompletedAt = new Date().toISOString();
            project.buildResult = {
                success: true,
                deploymentUrl: `https://${projectId}.vercel.app`,
                buildTime: Date.now() - new Date(project.buildStartTime).getTime()
            };

            this.broadcastToProject(projectId, {
                type: 'build_completed',
                success: true,
                result: project.buildResult
            });

        } catch (error) {
            project.buildStatus = 'failed';
            project.buildError = error.message;

            this.broadcastToProject(projectId, {
                type: 'build_failed',
                error: error.message
            });
        }
    }

    handleConflictResolution(userId, message) {
        const { conflictId, resolution, selectedOperation } = message;
        const conflict = this.conflicts.get(conflictId);
        
        if (!conflict || !conflict.users.includes(userId)) return;

        const project = this.projects.get(conflict.projectId);
        if (!project) return;

        // Apply resolution
        if (resolution === 'accept_selected') {
            this.applyTextEdit(
                project, 
                conflict.field, 
                selectedOperation.operation, 
                selectedOperation.position, 
                selectedOperation.text
            );
        }

        // Remove conflict
        this.conflicts.delete(conflictId);

        // Notify all involved users
        conflict.users.forEach(conflictUserId => {
            this.sendToUser(conflictUserId, {
                type: 'conflict_resolved',
                conflictId: conflictId,
                resolution: resolution,
                resolvedBy: userId
            });
        });

        console.log(`⚖️ Conflict ${conflictId} resolved by user ${userId}`);
    }

    handlePresenceUpdate(userId, message) {
        const user = this.users.get(userId);
        if (!user) return;

        user.presence = message.presence;
        this.broadcastUserPresence();
    }

    handleUserDisconnect(userId) {
        const user = this.users.get(userId);
        if (!user) return;

        // Leave current project
        if (user.currentProject) {
            this.handleLeaveProject(userId, { projectId: user.currentProject });
        }

        // Remove user
        this.users.delete(userId);
        console.log(`👤 User ${userId} disconnected`);
        
        this.broadcastUserPresence();
    }

    // Utility methods
    sendToUser(userId, message) {
        const user = this.users.get(userId);
        if (user && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify(message));
        }
    }

    broadcastToProject(projectId, message, excludeUserId = null) {
        const project = this.projects.get(projectId);
        if (!project) return;

        for (const collaborator of project.collaborators.keys()) {
            if (collaborator !== excludeUserId) {
                this.sendToUser(collaborator, message);
            }
        }
    }

    broadcastUserPresence() {
        const presenceData = {
            type: 'presence_update',
            users: Array.from(this.users.values()).map(user => ({
                id: user.id,
                presence: user.presence,
                currentProject: user.currentProject,
                role: user.role
            }))
        };

        for (const user of this.users.values()) {
            this.sendToUser(user.id, presenceData);
        }
    }

    generateUserId() {
        return `user_${crypto.randomBytes(8).toString('hex')}`;
    }

    generateConflictId() {
        return `conflict_${crypto.randomBytes(8).toString('hex')}`;
    }

    // API methods for external use
    getProjectStatus(projectId) {
        const project = this.projects.get(projectId);
        if (!project) return null;

        return {
            id: project.id,
            name: project.name,
            buildStatus: project.buildStatus,
            collaborators: Array.from(project.collaborators.values()),
            activeConflicts: Array.from(this.conflicts.values())
                .filter(conflict => conflict.projectId === projectId)
        };
    }

    getActiveUsers() {
        return Array.from(this.users.values()).map(user => ({
            id: user.id,
            presence: user.presence,
            currentProject: user.currentProject,
            role: user.role,
            connectedAt: user.connectedAt,
            lastActivity: new Date(user.lastActivity).toISOString()
        }));
    }

    getSystemStats() {
        return {
            totalUsers: this.users.size,
            activeProjects: this.projects.size,
            activeConflicts: this.conflicts.size,
            totalBuilds: Array.from(this.projects.values())
                .filter(p => p.buildStatus === 'completed').length
        };
    }
}

// Export singleton instance
const multiUserCoordinator = new MultiUserCoordinator();
export default multiUserCoordinator;