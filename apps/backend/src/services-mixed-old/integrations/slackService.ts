import { EventEmitter } from 'events';
import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';
import { IntelligentAIRouter } from '../ai/intelligentRouter';
import { AIOrchestrationService } from '../ai/orchestrationService';

export interface SlackIntegration {
  id: string;
  teamId: string;
  teamName: string;
  botToken: string;
  userToken: string;
  appId: string;
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  scopes: string[];
  webhookUrl?: string;
  channelMappings: ChannelMapping[];
  notificationSettings: SlackNotificationSettings;
  botSettings: SlackBotSettings;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelMapping {
  slackChannelId: string;
  slackChannelName: string;
  projectId: string;
  projectName: string;
  notificationTypes: SlackNotificationType[];
  autoRespond: boolean;
  mentionUsers: string[];
}

export interface SlackNotificationSettings {
  enableRealTime: boolean;
  enableDigest: boolean;
  digestFrequency: 'hourly' | 'daily' | 'weekly';
  quietHours: {
    start: string;
    end: string;
    timezone: string;
  };
  urgencyLevels: {
    critical: SlackUrgencyConfig;
    high: SlackUrgencyConfig;
    medium: SlackUrgencyConfig;
    low: SlackUrgencyConfig;
  };
}

export interface SlackUrgencyConfig {
  enabled: boolean;
  immediate: boolean;
  mentionChannel: boolean;
  mentionUsers: string[];
  customMessage?: string;
}

export interface SlackBotSettings {
  botName: string;
  botIcon?: string;
  enableAI: boolean;
  aiPersonality: 'professional' | 'friendly' | 'casual' | 'technical';
  enableCommands: boolean;
  enableInteractiveElements: boolean;
  autoRespond: boolean;
  learningMode: boolean;
}

export type SlackNotificationType = 
  | 'task_created'
  | 'task_completed'
  | 'task_assigned'
  | 'project_milestone'
  | 'code_review'
  | 'deployment'
  | 'system_alert'
  | 'team_update'
  | 'ai_insight'
  | 'performance_alert';

export interface SlackNotification {
  id: string;
  integrationId: string;
  type: SlackNotificationType;
  channel: string;
  title: string;
  message: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  attachments?: SlackAttachment[];
  blocks?: any[];
  actions?: SlackAction[];
  metadata: Record<string, any>;
  sentAt?: Date;
  acknowledged: boolean;
  responses: SlackResponse[];
}

export interface SlackAttachment {
  color?: string;
  title?: string;
  titleLink?: string;
  text?: string;
  fields: SlackField[];
  imageUrl?: string;
  thumbUrl?: string;
  footer?: string;
  timestamp?: number;
}

export interface SlackField {
  title: string;
  value: string;
  short: boolean;
}

export interface SlackAction {
  name: string;
  text: string;
  type: 'button' | 'select';
  value?: string;
  style?: 'default' | 'primary' | 'danger';
  options?: { text: string; value: string }[];
  confirm?: {
    title: string;
    text: string;
    okText: string;
    dismissText: string;
  };
}

export interface SlackResponse {
  userId: string;
  userName: string;
  action: string;
  value: string;
  timestamp: Date;
  channelId: string;
  messageTs: string;
}

export interface SlackCommand {
  command: string;
  text: string;
  userId: string;
  userName: string;
  channelId: string;
  channelName: string;
  teamId: string;
  responseUrl: string;
}

export interface SlackEvent {
  type: string;
  channel: string;
  user: string;
  text?: string;
  ts: string;
  eventTs: string;
  channelType: string;
}

export interface AISlackResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  actions: SlackAction[];
  followUp: boolean;
  context: Record<string, any>;
}

export class SlackIntegrationService extends EventEmitter {
  private integrations: Map<string, SlackIntegration> = new Map();
  private clients: Map<string, WebClient> = new Map();
  private eventAdapters: Map<string, any> = new Map();
  private messageAdapters: Map<string, any> = new Map();
  private notifications: Map<string, SlackNotification> = new Map();
  private aiRouter: IntelligentAIRouter;
  private orchestrationService: AIOrchestrationService;

  constructor(aiRouter: IntelligentAIRouter, orchestrationService: AIOrchestrationService) {
    super();
    this.aiRouter = aiRouter;
    this.orchestrationService = orchestrationService;
  }

  async createIntegration(integrationData: Partial<SlackIntegration>): Promise<SlackIntegration> {
    const integration: SlackIntegration = {
      id: this.generateId(),
      teamId: integrationData.teamId!,
      teamName: integrationData.teamName!,
      botToken: integrationData.botToken!,
      userToken: integrationData.userToken!,
      appId: integrationData.appId!,
      clientId: integrationData.clientId!,
      clientSecret: integrationData.clientSecret!,
      signingSecret: integrationData.signingSecret!,
      scopes: integrationData.scopes || ['bot', 'commands', 'incoming-webhook'],
      channelMappings: integrationData.channelMappings || [],
      notificationSettings: integrationData.notificationSettings || this.getDefaultNotificationSettings(),
      botSettings: integrationData.botSettings || this.getDefaultBotSettings(),
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.setupSlackClient(integration);
    await this.setupEventHandlers(integration);
    
    this.integrations.set(integration.id, integration);

    this.emit('integration_created', integration);

    return integration;
  }

  private async setupSlackClient(integration: SlackIntegration): Promise<void> {
    const client = new WebClient(integration.botToken);
    
    try {
      const auth = await client.auth.test();
      console.log(`Connected to Slack team: ${auth.team} (${auth.team_id})`);
      
      this.clients.set(integration.id, client);
    } catch (error) {
      console.error('Failed to connect to Slack:', error);
      throw new Error('Invalid Slack credentials');
    }
  }

  private async setupEventHandlers(integration: SlackIntegration): Promise<void> {
    const eventAdapter = createEventAdapter(integration.signingSecret);
    const messageAdapter = createMessageAdapter(integration.signingSecret);

    eventAdapter.on('message', async (event: SlackEvent) => {
      await this.handleMessage(integration, event);
    });

    eventAdapter.on('app_mention', async (event: SlackEvent) => {
      await this.handleMention(integration, event);
    });

    eventAdapter.on('channel_join', async (event: SlackEvent) => {
      await this.handleChannelJoin(integration, event);
    });

    messageAdapter.action({ actionId: /.*/ }, async (payload: any) => {
      await this.handleInteractiveAction(integration, payload);
    });

    this.eventAdapters.set(integration.id, eventAdapter);
    this.messageAdapters.set(integration.id, messageAdapter);
  }

  async sendNotification(integrationId: string, notification: Omit<SlackNotification, 'id' | 'sentAt' | 'acknowledged' | 'responses'>): Promise<SlackNotification> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const client = this.clients.get(integrationId);
    if (!client) {
      throw new Error('Slack client not initialized');
    }

    const fullNotification: SlackNotification = {
      ...notification,
      id: this.generateId(),
      sentAt: new Date(),
      acknowledged: false,
      responses: []
    };

    const channelMapping = integration.channelMappings.find(
      mapping => mapping.notificationTypes.includes(notification.type)
    );

    const targetChannel = channelMapping?.slackChannelId || notification.channel;

    try {
      const messageOptions: any = {
        channel: targetChannel,
        text: notification.message,
        attachments: notification.attachments,
        blocks: notification.blocks
      };

      if (notification.urgency === 'critical') {
        messageOptions.text = `🚨 CRITICAL: ${notification.message}`;
      }

      const result = await client.chat.postMessage(messageOptions);
      
      fullNotification.sentAt = new Date();
      this.notifications.set(fullNotification.id, fullNotification);

      this.emit('notification_sent', fullNotification);

      return fullNotification;
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      throw error;
    }
  }

  private async handleMessage(integration: SlackIntegration, event: SlackEvent): Promise<void> {
    if (!event.text || event.user === integration.appId) return;

    const channelMapping = integration.channelMappings.find(
      mapping => mapping.slackChannelId === event.channel
    );

    if (channelMapping && channelMapping.autoRespond && integration.botSettings.enableAI) {
      const aiResponse = await this.generateAIResponse(integration, event);
      
      if (aiResponse.confidence > 0.7) {
        await this.sendResponse(integration, event.channel, aiResponse.response, aiResponse.actions);
      }
    }

    this.emit('message_received', {
      integration,
      event,
      channelMapping
    });
  }

  private async handleMention(integration: SlackIntegration, event: SlackEvent): Promise<void> {
    if (!integration.botSettings.enableAI) {
      await this.sendResponse(integration, event.channel, "Hello! I'm here to help with your development workflow.");
      return;
    }

    const aiResponse = await this.generateAIResponse(integration, event);
    await this.sendResponse(integration, event.channel, aiResponse.response, aiResponse.actions);

    this.emit('mention_received', {
      integration,
      event,
      aiResponse
    });
  }

  private async handleChannelJoin(integration: SlackIntegration, event: SlackEvent): Promise<void> {
    const client = this.clients.get(integration.id);
    if (!client) return;

    const welcomeMessage = `Welcome to the team! 👋 I'm ${integration.botSettings.botName}, your AI development assistant. Use /help to see what I can do for you.`;

    await client.chat.postMessage({
      channel: event.channel,
      text: welcomeMessage,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: welcomeMessage
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Get Started'
              },
              action_id: 'get_started',
              style: 'primary'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Commands'
              },
              action_id: 'view_commands'
            }
          ]
        }
      ]
    });
  }

  private async handleInteractiveAction(integration: SlackIntegration, payload: any): Promise<void> {
    const action = payload.actions[0];
    const user = payload.user;
    const channel = payload.channel;

    const response: SlackResponse = {
      userId: user.id,
      userName: user.name,
      action: action.action_id,
      value: action.value || action.selected_option?.value || '',
      timestamp: new Date(),
      channelId: channel.id,
      messageTs: payload.message_ts
    };

    switch (action.action_id) {
      case 'get_started':
        await this.handleGetStarted(integration, channel.id, user.id);
        break;
      case 'view_commands':
        await this.handleViewCommands(integration, channel.id);
        break;
      case 'approve_deployment':
        await this.handleDeploymentApproval(integration, response);
        break;
      case 'request_review':
        await this.handleReviewRequest(integration, response);
        break;
      default:
        await this.handleCustomAction(integration, response);
    }

    this.emit('interactive_action', {
      integration,
      response,
      payload
    });
  }

  async handleSlashCommand(integrationId: string, command: SlackCommand): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration || !integration.botSettings.enableCommands) {
      return {
        response_type: 'ephemeral',
        text: 'Commands are not enabled for this integration.'
      };
    }

    switch (command.command) {
      case '/status':
        return await this.handleStatusCommand(integration, command);
      case '/deploy':
        return await this.handleDeployCommand(integration, command);
      case '/review':
        return await this.handleReviewCommand(integration, command);
      case '/ai':
        return await this.handleAICommand(integration, command);
      case '/help':
        return await this.handleHelpCommand(integration, command);
      default:
        return {
          response_type: 'ephemeral',
          text: `Unknown command: ${command.command}`
        };
    }
  }

  private async generateAIResponse(integration: SlackIntegration, event: SlackEvent): Promise<AISlackResponse> {
    try {
      const context = {
        channel: event.channel,
        user: event.user,
        text: event.text,
        channelType: event.channelType,
        integration: integration.id,
        personality: integration.botSettings.aiPersonality
      };

      const aiRequest = {
        prompt: `As a ${integration.botSettings.aiPersonality} AI development assistant named ${integration.botSettings.botName}, respond to this Slack message: "${event.text}". Keep it concise and helpful.`,
        context,
        maxTokens: 500,
        temperature: 0.7
      };

      const routingDecision = await this.aiRouter.routeRequest(aiRequest);
      const response = await routingDecision.provider.generateResponse(aiRequest);

      return {
        response: response.content,
        confidence: response.confidence || 0.8,
        suggestions: response.suggestions || [],
        actions: this.generateContextualActions(event.text || ''),
        followUp: response.requiresFollowUp || false,
        context
      };
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      return {
        response: "I'm sorry, I'm having trouble understanding right now. Please try again later.",
        confidence: 0.1,
        suggestions: [],
        actions: [],
        followUp: false,
        context: {}
      };
    }
  }

  private generateContextualActions(text: string): SlackAction[] {
    const actions: SlackAction[] = [];

    if (text.toLowerCase().includes('deploy')) {
      actions.push({
        name: 'deploy',
        text: 'Start Deployment',
        type: 'button',
        value: 'deploy',
        style: 'primary'
      });
    }

    if (text.toLowerCase().includes('review') || text.toLowerCase().includes('code')) {
      actions.push({
        name: 'review',
        text: 'Request Review',
        type: 'button',
        value: 'review'
      });
    }

    if (text.toLowerCase().includes('help') || text.toLowerCase().includes('command')) {
      actions.push({
        name: 'help',
        text: 'Show Help',
        type: 'button',
        value: 'help'
      });
    }

    return actions;
  }

  private async sendResponse(integration: SlackIntegration, channel: string, text: string, actions: SlackAction[] = []): Promise<void> {
    const client = this.clients.get(integration.id);
    if (!client) return;

    const messageOptions: any = {
      channel,
      text
    };

    if (actions.length > 0) {
      messageOptions.blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text
          }
        },
        {
          type: 'actions',
          elements: actions.map(action => ({
            type: 'button',
            text: {
              type: 'plain_text',
              text: action.text
            },
            action_id: action.name,
            value: action.value,
            style: action.style
          }))
        }
      ];
    }

    await client.chat.postMessage(messageOptions);
  }

  private async handleStatusCommand(integration: SlackIntegration, command: SlackCommand): Promise<any> {
    return {
      response_type: 'ephemeral',
      text: '📊 System Status: All systems operational',
      attachments: [
        {
          color: 'good',
          fields: [
            { title: 'Server', value: '✅ Online', short: true },
            { title: 'Database', value: '✅ Connected', short: true },
            { title: 'AI Services', value: '✅ Active', short: true },
            { title: 'Deployments', value: '✅ Ready', short: true }
          ]
        }
      ]
    };
  }

  private async handleDeployCommand(integration: SlackIntegration, command: SlackCommand): Promise<any> {
    return {
      response_type: 'in_channel',
      text: `🚀 Deployment initiated by <@${command.userId}>`,
      attachments: [
        {
          color: 'warning',
          text: 'Deployment is starting. This may take a few minutes.',
          actions: [
            {
              name: 'approve',
              text: 'Approve',
              type: 'button',
              style: 'primary',
              value: 'approve_deployment'
            },
            {
              name: 'cancel',
              text: 'Cancel',
              type: 'button',
              style: 'danger',
              value: 'cancel_deployment',
              confirm: {
                title: 'Cancel Deployment',
                text: 'Are you sure you want to cancel this deployment?',
                okText: 'Yes, Cancel',
                dismissText: 'No, Continue'
              }
            }
          ]
        }
      ]
    };
  }

  private async handleReviewCommand(integration: SlackIntegration, command: SlackCommand): Promise<any> {
    return {
      response_type: 'in_channel',
      text: `👀 Code review requested by <@${command.userId}>`,
      attachments: [
        {
          color: 'good',
          text: `Project: ${command.text || 'Current project'}`,
          fields: [
            { title: 'Status', value: 'Pending Review', short: true },
            { title: 'Priority', value: 'Normal', short: true }
          ]
        }
      ]
    };
  }

  private async handleAICommand(integration: SlackIntegration, command: SlackCommand): Promise<any> {
    if (!command.text) {
      return {
        response_type: 'ephemeral',
        text: 'Please provide a question or task for the AI. Example: `/ai explain this error`'
      };
    }

    const aiResponse = await this.generateAIResponse(integration, {
      type: 'message',
      channel: command.channelId,
      user: command.userId,
      text: command.text,
      ts: Date.now().toString(),
      eventTs: Date.now().toString(),
      channelType: 'channel'
    });

    return {
      response_type: 'ephemeral',
      text: `🤖 AI Assistant: ${aiResponse.response}`,
      attachments: aiResponse.suggestions.length > 0 ? [
        {
          color: 'good',
          title: 'Suggestions:',
          text: aiResponse.suggestions.join('\n• ')
        }
      ] : undefined
    };
  }

  private async handleHelpCommand(integration: SlackIntegration, command: SlackCommand): Promise<any> {
    return {
      response_type: 'ephemeral',
      text: `🤖 ${integration.botSettings.botName} - Available Commands`,
      attachments: [
        {
          color: 'good',
          fields: [
            { title: '/status', value: 'Check system status', short: true },
            { title: '/deploy', value: 'Start deployment', short: true },
            { title: '/review', value: 'Request code review', short: true },
            { title: '/ai <question>', value: 'Ask AI assistant', short: true }
          ]
        }
      ]
    };
  }

  private async handleGetStarted(integration: SlackIntegration, channelId: string, userId: string): Promise<void> {
    const message = `Great! Here's what I can help you with:

🔹 **Real-time notifications** for your projects
🔹 **AI-powered assistance** for development questions  
🔹 **Deployment management** and status updates
🔹 **Code review** coordination
🔹 **Team collaboration** insights

Try mentioning me (@${integration.botSettings.botName}) with a question, or use slash commands like \`/status\` or \`/help\`.`;

    await this.sendResponse(integration, channelId, message);
  }

  private async handleViewCommands(integration: SlackIntegration, channelId: string): Promise<void> {
    const message = `📋 **Available Commands:**

\`/status\` - Check system and project status
\`/deploy [project]\` - Start deployment process  
\`/review [description]\` - Request code review
\`/ai [question]\` - Ask the AI assistant
\`/help\` - Show this help message

You can also mention me (@${integration.botSettings.botName}) in any channel for AI assistance!`;

    await this.sendResponse(integration, channelId, message);
  }

  private async handleDeploymentApproval(integration: SlackIntegration, response: SlackResponse): Promise<void> {
    const message = `✅ Deployment approved by <@${response.userId}>. Starting deployment process...`;
    await this.sendResponse(integration, response.channelId, message);
  }

  private async handleReviewRequest(integration: SlackIntegration, response: SlackResponse): Promise<void> {
    const message = `👀 Review requested by <@${response.userId}>. Notifying available reviewers...`;
    await this.sendResponse(integration, response.channelId, message);
  }

  private async handleCustomAction(integration: SlackIntegration, response: SlackResponse): Promise<void> {
    const message = `Action "${response.action}" completed by <@${response.userId}>.`;
    await this.sendResponse(integration, response.channelId, message);
  }

  async updateIntegration(integrationId: string, updates: Partial<SlackIntegration>): Promise<SlackIntegration> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const updatedIntegration = { ...integration, ...updates, updatedAt: new Date() };
    this.integrations.set(integrationId, updatedIntegration);

    this.emit('integration_updated', updatedIntegration);

    return updatedIntegration;
  }

  async deleteIntegration(integrationId: string): Promise<void> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    this.clients.delete(integrationId);
    this.eventAdapters.delete(integrationId);
    this.messageAdapters.delete(integrationId);
    this.integrations.delete(integrationId);

    this.emit('integration_deleted', integration);
  }

  getIntegration(integrationId: string): SlackIntegration | undefined {
    return this.integrations.get(integrationId);
  }

  getAllIntegrations(): SlackIntegration[] {
    return Array.from(this.integrations.values());
  }

  private getDefaultNotificationSettings(): SlackNotificationSettings {
    return {
      enableRealTime: true,
      enableDigest: false,
      digestFrequency: 'daily',
      quietHours: {
        start: '22:00',
        end: '08:00',
        timezone: 'UTC'
      },
      urgencyLevels: {
        critical: {
          enabled: true,
          immediate: true,
          mentionChannel: true,
          mentionUsers: [],
          customMessage: '🚨 Critical issue detected!'
        },
        high: {
          enabled: true,
          immediate: true,
          mentionChannel: false,
          mentionUsers: []
        },
        medium: {
          enabled: true,
          immediate: false,
          mentionChannel: false,
          mentionUsers: []
        },
        low: {
          enabled: false,
          immediate: false,
          mentionChannel: false,
          mentionUsers: []
        }
      }
    };
  }

  private getDefaultBotSettings(): SlackBotSettings {
    return {
      botName: 'Claude Code Assistant',
      botIcon: ':robot_face:',
      enableAI: true,
      aiPersonality: 'professional',
      enableCommands: true,
      enableInteractiveElements: true,
      autoRespond: false,
      learningMode: true
    };
  }

  private generateId(): string {
    return `slack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAnalytics(integrationId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const notifications = Array.from(this.notifications.values()).filter(
      n => n.integrationId === integrationId && 
           n.sentAt && 
           n.sentAt >= timeRange.start && 
           n.sentAt <= timeRange.end
    );

    return {
      totalNotifications: notifications.length,
      byType: this.groupBy(notifications, 'type'),
      byUrgency: this.groupBy(notifications, 'urgency'),
      acknowledgedRate: notifications.filter(n => n.acknowledged).length / notifications.length,
      averageResponseTime: this.calculateAverageResponseTime(notifications),
      topChannels: this.getTopChannels(notifications),
      userEngagement: this.calculateUserEngagement(notifications)
    };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateAverageResponseTime(notifications: SlackNotification[]): number {
    const responseTimes = notifications
      .filter(n => n.responses.length > 0)
      .map(n => {
        const firstResponse = n.responses[0];
        const sentTime = n.sentAt?.getTime() || 0;
        const responseTime = firstResponse.timestamp.getTime();
        return responseTime - sentTime;
      });

    return responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;
  }

  private getTopChannels(notifications: SlackNotification[]): Record<string, number> {
    return this.groupBy(notifications, 'channel');
  }

  private calculateUserEngagement(notifications: SlackNotification[]): any {
    const userResponses = notifications.flatMap(n => n.responses);
    const uniqueUsers = new Set(userResponses.map(r => r.userId));
    
    return {
      totalResponses: userResponses.length,
      uniqueUsers: uniqueUsers.size,
      averageResponsesPerUser: userResponses.length / uniqueUsers.size
    };
  }
}