import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { TelemetryUtils, DatabaseService, databaseService } from '../../../../utils/telemetry';
import jwt from 'jsonwebtoken';

export interface CollaborationUser {
  id: string;
  username: string;
  email: string;
  organization_id: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  current_project?: string;
  permissions: string[];
}

export interface CollaborationSession {
  id: string;
  project_id: string;
  organization_id: string;
  session_name: string;
  session_type: 'coding' | 'review' | 'planning' | 'meeting';
  creator_id: string;
  participants: CollaborationUser[];
  shared_state: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface RealtimeMessage {
  id: string;
  session_id: string;
  user_id: string;
  message_type: 'chat' | 'cursor' | 'selection' | 'edit' | 'system' | 'code_review' | 'task_update';
  content: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CursorPosition {
  user_id: string;
  file_path: string;
  line: number;
  column: number;
  selection_start?: { line: number; column: number };
  selection_end?: { line: number; column: number };
  timestamp: Date;
}

export interface CodeEdit {
  user_id: string;
  session_id: string;
  file_path: string;
  edit_type: 'insert' | 'delete' | 'replace';
  start_position: { line: number; column: number };
  end_position?: { line: number; column: number };
  content: string;
  original_content?: string;
  timestamp: Date;
  edit_id: string;
}

export class RealtimeCollaborationService extends EventEmitter {
  private wss: WebSocketServer;
  private db: DatabaseService;
  private connectedUsers: Map<string, { ws: WebSocket; user: CollaborationUser }> = new Map();
  private activeSessions: Map<string, CollaborationSession> = new Map();
  private userSessions: Map<string, Set<string>> = new Map(); // user_id -> session_ids
  private sessionUsers: Map<string, Set<string>> = new Map(); // session_id -> user_ids

  constructor(server: any) {
    super();
    this.db = databaseService;
    
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/collaboration'
    });

    this.setupWebSocketHandlers();
    this.startHeartbeat();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', async (ws: WebSocket, request) => {
      return TelemetryUtils.traceAsync('collaboration.websocket_connection', async () => {
        try {
          // Extract and verify JWT token from query parameters
          const url = new URL(request.url!, `http://${request.headers.host}`);
          const token = url.searchParams.get('token');
          
          if (!token) {
            ws.close(4001, 'Authentication required');
            return;
          }

          // Verify JWT and get user info
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const user = await this.getUserById(decoded.user_id);
          
          if (!user) {
            ws.close(4002, 'Invalid user');
            return;
          }

          // Store connection
          this.connectedUsers.set(user.id, { ws, user });
          user.status = 'online';

          console.log(`User ${user.username} connected to collaboration service`);

          // Send welcome message
          this.sendToUser(user.id, {
            type: 'connection_established',
            data: {
              user_id: user.id,
              connected_users: this.getConnectedUsersList(),
              active_sessions: Array.from(this.activeSessions.values())
            }
          });

          // Broadcast user online status
          this.broadcastUserStatusUpdate(user);

          // Handle WebSocket messages
          ws.on('message', (message: string) => {
            this.handleWebSocketMessage(user.id, message);
          });

          // Handle disconnect
          ws.on('close', () => {
            this.handleUserDisconnect(user.id);
          });

          ws.on('error', (error) => {
            console.error(`WebSocket error for user ${user.id}:`, error);
            this.handleUserDisconnect(user.id);
          });

        } catch (error) {
          console.error('WebSocket connection error:', error);
          ws.close(4003, 'Connection failed');
        }
      });
    });
  }

  private async handleWebSocketMessage(userId: string, message: string) {
    return TelemetryUtils.traceAsync('collaboration.handle_message', async () => {
      try {
        const data = JSON.parse(message);
        const { type, payload } = data;

        switch (type) {
          case 'join_session':
            await this.handleJoinSession(userId, payload.session_id);
            break;
          
          case 'leave_session':
            await this.handleLeaveSession(userId, payload.session_id);
            break;
          
          case 'create_session':
            await this.handleCreateSession(userId, payload);
            break;
          
          case 'chat_message':
            await this.handleChatMessage(userId, payload);
            break;
          
          case 'cursor_update':
            await this.handleCursorUpdate(userId, payload);
            break;
          
          case 'code_edit':
            await this.handleCodeEdit(userId, payload);
            break;
          
          case 'code_review':
            await this.handleCodeReview(userId, payload);
            break;
          
          case 'task_update':
            await this.handleTaskUpdate(userId, payload);
            break;
          
          case 'status_update':
            await this.handleStatusUpdate(userId, payload);
            break;

          default:
            console.warn(`Unknown message type: ${type}`);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        this.sendErrorToUser(userId, 'Failed to process message', error);
      }
    });
  }

  /**
   * Create a new collaboration session
   */
  async createSession(
    creatorId: string,
    sessionData: {
      project_id: string;
      session_name: string;
      session_type: 'coding' | 'review' | 'planning' | 'meeting';
      initial_participants?: string[];
    }
  ): Promise<CollaborationSession> {
    return TelemetryUtils.traceAsync('collaboration.create_session', async () => {
      const creator = this.connectedUsers.get(creatorId)?.user;
      if (!creator) {
        throw new Error('Creator not found or not connected');
      }

      const session: CollaborationSession = {
        id: this.generateSessionId(),
        project_id: sessionData.project_id,
        organization_id: creator.organization_id,
        session_name: sessionData.session_name,
        session_type: sessionData.session_type,
        creator_id: creatorId,
        participants: [creator],
        shared_state: {},
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
      };

      // Store in memory and database
      this.activeSessions.set(session.id, session);
      await this.storeSession(session);

      // Add creator to session mappings
      this.addUserToSession(creatorId, session.id);

      // Invite initial participants
      if (sessionData.initial_participants) {
        for (const participantId of sessionData.initial_participants) {
          await this.inviteUserToSession(session.id, participantId, creatorId);
        }
      }

      this.emit('session_created', session);
      
      // Broadcast session creation
      this.broadcastToOrganization(creator.organization_id, {
        type: 'session_created',
        data: session
      });

      return session;
    });
  }

  /**
   * Join an existing session
   */
  async joinSession(userId: string, sessionId: string): Promise<void> {
    return TelemetryUtils.traceAsync('collaboration.join_session', async () => {
      const user = this.connectedUsers.get(userId)?.user;
      const session = this.activeSessions.get(sessionId);

      if (!user) throw new Error('User not found or not connected');
      if (!session) throw new Error('Session not found');
      if (!session.is_active) throw new Error('Session is not active');

      // Check permissions
      if (session.organization_id !== user.organization_id) {
        throw new Error('Access denied to session');
      }

      // Add user to session
      if (!session.participants.find(p => p.id === userId)) {
        session.participants.push(user);
        await this.updateSession(session);
      }

      this.addUserToSession(userId, sessionId);

      // Notify session participants
      this.broadcastToSession(sessionId, {
        type: 'user_joined',
        data: {
          session_id: sessionId,
          user: user,
          participants: session.participants
        }
      });

      // Send session state to joining user
      this.sendToUser(userId, {
        type: 'session_joined',
        data: {
          session: session,
          shared_state: session.shared_state
        }
      });

      this.emit('user_joined_session', { userId, sessionId, session });
    });
  }

  /**
   * Handle real-time code editing
   */
  private async handleCodeEdit(userId: string, payload: CodeEdit): Promise<void> {
    return TelemetryUtils.traceAsync('collaboration.handle_code_edit', async () => {
      const edit: CodeEdit = {
        ...payload,
        user_id: userId,
        timestamp: new Date(),
        edit_id: this.generateEditId()
      };

      // Store edit in database
      await this.storeCodeEdit(edit);

      // Broadcast edit to session participants (excluding sender)
      this.broadcastToSession(edit.session_id, {
        type: 'code_edit',
        data: edit
      }, [userId]);

      // Update session shared state
      const session = this.activeSessions.get(edit.session_id);
      if (session) {
        if (!session.shared_state.recent_edits) {
          session.shared_state.recent_edits = [];
        }
        session.shared_state.recent_edits.push(edit);
        
        // Keep only last 50 edits
        if (session.shared_state.recent_edits.length > 50) {
          session.shared_state.recent_edits = session.shared_state.recent_edits.slice(-50);
        }

        session.updated_at = new Date();
        await this.updateSession(session);
      }

      this.emit('code_edit', edit);
    });
  }

  /**
   * Handle cursor position updates
   */
  private async handleCursorUpdate(userId: string, payload: CursorPosition): Promise<void> {
    const cursor: CursorPosition = {
      ...payload,
      user_id: userId,
      timestamp: new Date()
    };

    // Broadcast cursor position to other users in the same session
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.forEach(sessionId => {
        this.broadcastToSession(sessionId, {
          type: 'cursor_update',
          data: cursor
        }, [userId]);
      });
    }
  }

  /**
   * Handle chat messages
   */
  private async handleChatMessage(userId: string, payload: any): Promise<void> {
    return TelemetryUtils.traceAsync('collaboration.handle_chat_message', async () => {
      const message: RealtimeMessage = {
        id: this.generateMessageId(),
        session_id: payload.session_id,
        user_id: userId,
        message_type: 'chat',
        content: payload.content,
        timestamp: new Date(),
        metadata: payload.metadata
      };

      // Store message
      await this.storeMessage(message);

      // Broadcast to session participants
      this.broadcastToSession(message.session_id, {
        type: 'chat_message',
        data: message
      });

      this.emit('chat_message', message);
    });
  }

  /**
   * Handle code review comments
   */
  private async handleCodeReview(userId: string, payload: any): Promise<void> {
    return TelemetryUtils.traceAsync('collaboration.handle_code_review', async () => {
      const review: RealtimeMessage = {
        id: this.generateMessageId(),
        session_id: payload.session_id,
        user_id: userId,
        message_type: 'code_review',
        content: {
          file_path: payload.file_path,
          line_number: payload.line_number,
          comment: payload.comment,
          review_type: payload.review_type, // 'suggestion', 'issue', 'praise'
          code_snippet: payload.code_snippet
        },
        timestamp: new Date(),
        metadata: payload.metadata
      };

      await this.storeMessage(review);

      // Broadcast to session participants
      this.broadcastToSession(review.session_id, {
        type: 'code_review',
        data: review
      });

      this.emit('code_review', review);
    });
  }

  /**
   * Broadcasting and communication methods
   */
  private broadcastToSession(sessionId: string, message: any, excludeUsers: string[] = []): void {
    const userIds = this.sessionUsers.get(sessionId);
    if (userIds) {
      userIds.forEach(userId => {
        if (!excludeUsers.includes(userId)) {
          this.sendToUser(userId, message);
        }
      });
    }
  }

  private broadcastToOrganization(organizationId: string, message: any): void {
    this.connectedUsers.forEach(({ user, ws }) => {
      if (user.organization_id === organizationId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcastUserStatusUpdate(user: CollaborationUser): void {
    this.broadcastToOrganization(user.organization_id, {
      type: 'user_status_update',
      data: {
        user_id: user.id,
        username: user.username,
        status: user.status,
        current_project: user.current_project
      }
    });
  }

  private sendToUser(userId: string, message: any): void {
    const connection = this.connectedUsers.get(userId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  }

  private sendErrorToUser(userId: string, errorMessage: string, details?: any): void {
    this.sendToUser(userId, {
      type: 'error',
      data: {
        message: errorMessage,
        details: details?.message || details
      }
    });
  }

  /**
   * Session management helper methods
   */
  private addUserToSession(userId: string, sessionId: string): void {
    // Add session to user's sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);

    // Add user to session's users
    if (!this.sessionUsers.has(sessionId)) {
      this.sessionUsers.set(sessionId, new Set());
    }
    this.sessionUsers.get(sessionId)!.add(userId);
  }

  private removeUserFromSession(userId: string, sessionId: string): void {
    this.userSessions.get(userId)?.delete(sessionId);
    this.sessionUsers.get(sessionId)?.delete(userId);
  }

  private handleUserDisconnect(userId: string): void {
    console.log(`User ${userId} disconnected from collaboration service`);
    
    const connection = this.connectedUsers.get(userId);
    if (connection) {
      connection.user.status = 'offline';
      this.broadcastUserStatusUpdate(connection.user);
    }

    // Remove user from all sessions
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.forEach(sessionId => {
        this.broadcastToSession(sessionId, {
          type: 'user_left',
          data: { user_id: userId, session_id: sessionId }
        }, [userId]);
        this.removeUserFromSession(userId, sessionId);
      });
    }

    this.connectedUsers.delete(userId);
  }

  /**
   * Heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    setInterval(() => {
      this.connectedUsers.forEach(({ ws, user }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          this.handleUserDisconnect(user.id);
        }
      });
    }, 30000); // 30 seconds
  }

  /**
   * Database operations (mock implementations - replace with actual database calls)
   */
  private async getUserById(userId: string): Promise<CollaborationUser | null> {
    // Mock implementation
    return {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      organization_id: 'org1',
      status: 'online',
      permissions: ['collaborate', 'edit', 'review']
    };
  }

  private async storeSession(session: CollaborationSession): Promise<void> {
    // Mock implementation
    console.log('Storing session:', session.id);
  }

  private async updateSession(session: CollaborationSession): Promise<void> {
    // Mock implementation
    console.log('Updating session:', session.id);
  }

  private async storeMessage(message: RealtimeMessage): Promise<void> {
    // Mock implementation
    console.log('Storing message:', message.id);
  }

  private async storeCodeEdit(edit: CodeEdit): Promise<void> {
    // Mock implementation
    console.log('Storing code edit:', edit.edit_id);
  }

  /**
   * Utility methods
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEditId(): string {
    return `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getConnectedUsersList(): CollaborationUser[] {
    return Array.from(this.connectedUsers.values()).map(conn => conn.user);
  }

  /**
   * Handler methods for WebSocket messages
   */
  private async handleJoinSession(userId: string, sessionId: string): Promise<void> {
    await this.joinSession(userId, sessionId);
  }

  private async handleLeaveSession(userId: string, sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      // Remove user from participants
      session.participants = session.participants.filter(p => p.id !== userId);
      await this.updateSession(session);
      
      this.removeUserFromSession(userId, sessionId);
      
      this.broadcastToSession(sessionId, {
        type: 'user_left',
        data: { user_id: userId, session_id: sessionId }
      }, [userId]);
    }
  }

  private async handleCreateSession(userId: string, payload: any): Promise<void> {
    const session = await this.createSession(userId, payload);
    this.sendToUser(userId, {
      type: 'session_created',
      data: session
    });
  }

  private async handleStatusUpdate(userId: string, payload: any): Promise<void> {
    const user = this.connectedUsers.get(userId)?.user;
    if (user) {
      user.status = payload.status;
      user.current_project = payload.current_project;
      this.broadcastUserStatusUpdate(user);
    }
  }

  private async handleTaskUpdate(userId: string, payload: any): Promise<void> {
    const message: RealtimeMessage = {
      id: this.generateMessageId(),
      session_id: payload.session_id,
      user_id: userId,
      message_type: 'task_update',
      content: payload,
      timestamp: new Date()
    };

    await this.storeMessage(message);
    
    this.broadcastToSession(message.session_id, {
      type: 'task_update',
      data: message
    });
  }

  private async inviteUserToSession(sessionId: string, userId: string, inviterId: string): Promise<void> {
    this.sendToUser(userId, {
      type: 'session_invitation',
      data: {
        session_id: sessionId,
        inviter_id: inviterId,
        session: this.activeSessions.get(sessionId)
      }
    });
  }

  /**
   * Public API methods
   */
  getActiveSessionsForUser(userId: string): CollaborationSession[] {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return [];
    
    return Array.from(sessionIds)
      .map(sessionId => this.activeSessions.get(sessionId))
      .filter(session => session !== undefined) as CollaborationSession[];
  }

  getConnectedUsersInOrganization(organizationId: string): CollaborationUser[] {
    return Array.from(this.connectedUsers.values())
      .filter(conn => conn.user.organization_id === organizationId)
      .map(conn => conn.user);
  }

  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.wss.close();
    this.connectedUsers.clear();
    this.activeSessions.clear();
    this.userSessions.clear();
    this.sessionUsers.clear();
  }
}

export default RealtimeCollaborationService;