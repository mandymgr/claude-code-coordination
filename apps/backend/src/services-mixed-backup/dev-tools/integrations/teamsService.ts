import { EventEmitter } from 'events';
import { BotFrameworkAdapter, TeamsActivityHandler, CardFactory, MessageFactory, TurnContext, ActivityTypes } from 'botbuilder';
import { IntelligentAIRouter } from '../ai/intelligentRouter';
import { AIOrchestrationService } from '../ai/orchestrationService';

export interface TeamsIntegration {
  id: string;
  tenantId: string;
  teamId: string;
  teamName: string;
  appId: string;
  appPassword: string;
  botId: string;
  botName: string;
  serviceUrl: string;
  channelMappings: TeamsChannelMapping[];
  notificationSettings: TeamsNotificationSettings;
  botSettings: TeamsBotSettings;
  conversationReferences: Map<string, any>;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamsChannelMapping {
  teamsChannelId: string;
  teamsChannelName: string;
  projectId: string;
  projectName: string;
  notificationTypes: TeamsNotificationType[];
  autoRespond: boolean;
  mentionUsers: string[];
  conversationId: string;
}

export interface TeamsNotificationSettings {
  enableRealTime: boolean;
  enableAdaptiveCards: boolean;
  enableProactiveMessages: boolean;
  quietHours: {
    start: string;
    end: string;
    timezone: string;
  };
  urgencyLevels: {
    critical: TeamsUrgencyConfig;
    high: TeamsUrgencyConfig;
    medium: TeamsUrgencyConfig;
    low: TeamsUrgencyConfig;
  };
}

export interface TeamsUrgencyConfig {
  enabled: boolean;
  immediate: boolean;
  useAdaptiveCard: boolean;
  mentionChannel: boolean;
  mentionUsers: string[];
  customTitle?: string;
  customColor?: string;
}

export interface TeamsBotSettings {
  botName: string;
  botIcon?: string;
  enableAI: boolean;
  aiPersonality: 'professional' | 'friendly' | 'casual' | 'technical';
  enableCommands: boolean;
  enableAdaptiveCards: boolean;
  enableFileSharing: boolean;
  autoRespond: boolean;
  learningMode: boolean;
  enableMeetingIntegration: boolean;
}

export type TeamsNotificationType = 
  | 'task_created'
  | 'task_completed'
  | 'task_assigned'
  | 'project_milestone'
  | 'code_review'
  | 'deployment'
  | 'system_alert'
  | 'team_update'
  | 'ai_insight'
  | 'performance_alert'
  | 'meeting_reminder'
  | 'calendar_update';

export interface TeamsNotification {
  id: string;
  integrationId: string;
  type: TeamsNotificationType;
  channelId: string;
  conversationId: string;
  title: string;
  message: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  adaptiveCard?: any;
  attachments?: TeamsAttachment[];
  actions?: TeamsAction[];
  metadata: Record<string, any>;
  sentAt?: Date;
  acknowledged: boolean;
  responses: TeamsResponse[];
}

export interface TeamsAttachment {
  contentType: string;
  content: any;
  name?: string;
  thumbnailUrl?: string;
}

export interface TeamsAction {
  type: 'Action.Submit' | 'Action.OpenUrl' | 'Action.ShowCard';
  title: string;
  data?: any;
  url?: string;
  card?: any;
  style?: 'default' | 'positive' | 'destructive';
}

export interface TeamsResponse {
  userId: string;
  userName: string;
  action: string;
  value: any;
  timestamp: Date;
  channelId: string;
  conversationId: string;
  activityId: string;
}

export interface TeamsCommand {
  commandId: string;
  commandName: string;
  parameters: Record<string, any>;
  userId: string;
  userName: string;
  channelId: string;
  conversationId: string;
  context: any;
}

export interface AITeamsResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  adaptiveCard?: any;
  actions: TeamsAction[];
  followUp: boolean;
  context: Record<string, any>;
}

export class TeamsIntegrationService extends EventEmitter {
  private integrations: Map<string, TeamsIntegration> = new Map();
  private botAdapters: Map<string, BotFrameworkAdapter> = new Map();
  private activityHandlers: Map<string, TeamsActivityHandler> = new Map();
  private notifications: Map<string, TeamsNotification> = new Map();
  private aiRouter: IntelligentAIRouter;
  private orchestrationService: AIOrchestrationService;

  constructor(aiRouter: IntelligentAIRouter, orchestrationService: AIOrchestrationService) {
    super();
    this.aiRouter = aiRouter;
    this.orchestrationService = orchestrationService;
  }

  async createIntegration(integrationData: Partial<TeamsIntegration>): Promise<TeamsIntegration> {
    const integration: TeamsIntegration = {
      id: this.generateId(),
      tenantId: integrationData.tenantId!,
      teamId: integrationData.teamId!,
      teamName: integrationData.teamName!,
      appId: integrationData.appId!,
      appPassword: integrationData.appPassword!,
      botId: integrationData.botId!,
      botName: integrationData.botName || 'Claude Code Assistant',
      serviceUrl: integrationData.serviceUrl!,
      channelMappings: integrationData.channelMappings || [],
      notificationSettings: integrationData.notificationSettings || this.getDefaultNotificationSettings(),
      botSettings: integrationData.botSettings || this.getDefaultBotSettings(),
      conversationReferences: new Map(),
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.setupTeamsBot(integration);
    
    this.integrations.set(integration.id, integration);

    this.emit('integration_created', integration);

    return integration;
  }

  private async setupTeamsBot(integration: TeamsIntegration): Promise<void> {
    const adapter = new BotFrameworkAdapter({
      appId: integration.appId,
      appPassword: integration.appPassword
    });

    adapter.onTurnError = async (context, error) => {
      console.error('Teams bot error:', error);
      await context.sendActivity('Sorry, an error occurred while processing your request.');
    };

    const bot = new TeamsBot(this, integration.id);
    
    this.botAdapters.set(integration.id, adapter);
    this.activityHandlers.set(integration.id, bot);

    console.log(`Teams bot initialized for team: ${integration.teamName}`);
  }

  async sendNotification(integrationId: string, notification: Omit<TeamsNotification, 'id' | 'sentAt' | 'acknowledged' | 'responses'>): Promise<TeamsNotification> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const adapter = this.botAdapters.get(integrationId);
    if (!adapter) {
      throw new Error('Teams adapter not initialized');
    }

    const fullNotification: TeamsNotification = {
      ...notification,
      id: this.generateId(),
      sentAt: new Date(),
      acknowledged: false,
      responses: []
    };

    const channelMapping = integration.channelMappings.find(
      mapping => mapping.notificationTypes.includes(notification.type)
    );

    const targetConversation = channelMapping?.conversationId || notification.conversationId;

    try {
      const conversationReference = integration.conversationReferences.get(targetConversation);
      if (!conversationReference) {
        throw new Error('Conversation reference not found');
      }

      await adapter.continueConversation(conversationReference, async (context) => {
        let activity;

        if (integration.notificationSettings.enableAdaptiveCards && notification.adaptiveCard) {
          activity = MessageFactory.attachment(CardFactory.adaptiveCard(notification.adaptiveCard));
        } else {
          const card = this.createNotificationCard(fullNotification);
          activity = MessageFactory.attachment(CardFactory.adaptiveCard(card));
        }

        if (notification.urgency === 'critical') {
          activity.text = `🚨 CRITICAL: ${notification.title}`;
        }

        await context.sendActivity(activity);
      });
      
      fullNotification.sentAt = new Date();
      this.notifications.set(fullNotification.id, fullNotification);

      this.emit('notification_sent', fullNotification);

      return fullNotification;
    } catch (error) {
      console.error('Failed to send Teams notification:', error);
      throw error;
    }
  }

  private createNotificationCard(notification: TeamsNotification): any {
    const urgencyColors = {
      critical: 'Attention',
      high: 'Warning', 
      medium: 'Good',
      low: 'Default'
    };

    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: urgencyColors[notification.urgency],
          items: [
            {
              type: 'TextBlock',
              text: notification.title,
              weight: 'Bolder',
              size: 'Medium'
            },
            {
              type: 'TextBlock',
              text: notification.message,
              wrap: true,
              spacing: 'Medium'
            }
          ]
        },
        {
          type: 'FactSet',
          facts: [
            {
              title: 'Type:',
              value: notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            },
            {
              title: 'Priority:',
              value: notification.urgency.toUpperCase()
            },
            {
              title: 'Time:',
              value: new Date().toLocaleString()
            }
          ]
        }
      ],
      actions: notification.actions?.map(action => ({
        type: action.type,
        title: action.title,
        data: action.data,
        url: action.url,
        style: action.style
      })) || [
        {
          type: 'Action.Submit',
          title: 'Acknowledge',
          data: { action: 'acknowledge', notificationId: notification.id }
        }
      ]
    };
  }

  async handleIncomingActivity(integrationId: string, req: any, res: any): Promise<void> {
    const adapter = this.botAdapters.get(integrationId);
    const bot = this.activityHandlers.get(integrationId);
    
    if (!adapter || !bot) {
      return res.status(404).send('Integration not found');
      return;
    }

    await adapter.processActivity(req, res, async (context) => {
      await bot.run(context);
    });
  }

  async generateAIResponse(integration: TeamsIntegration, context: TurnContext, text: string): Promise<AITeamsResponse> {
    try {
      const contextData = {
        channelId: context.activity.channelId,
        userId: context.activity.from?.id,
        conversationId: context.activity.conversation?.id,
        text: text,
        integration: integration.id,
        personality: integration.botSettings.aiPersonality,
        enableAdaptiveCards: integration.botSettings.enableAdaptiveCards
      };

      const aiRequest = {
        prompt: `As a ${integration.botSettings.aiPersonality} AI development assistant named ${integration.botSettings.botName}, respond to this Teams message: "${text}". Keep it concise and helpful for a development team.`,
        context: contextData,
        maxTokens: 600,
        temperature: 0.7
      };

      const routingDecision = await this.aiRouter.routeRequest(aiRequest);
      const response = await routingDecision.provider.generateResponse(aiRequest);

      const adaptiveCard = integration.botSettings.enableAdaptiveCards 
        ? this.createAIResponseCard(response.content, response.suggestions || [])
        : undefined;

      return {
        response: response.content,
        confidence: response.confidence || 0.8,
        suggestions: response.suggestions || [],
        adaptiveCard,
        actions: this.generateContextualActions(text),
        followUp: response.requiresFollowUp || false,
        context: contextData
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

  private createAIResponseCard(response: string, suggestions: string[]): any {
    const card: any = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'ColumnSet',
              columns: [
                {
                  type: 'Column',
                  width: 'auto',
                  items: [
                    {
                      type: 'Image',
                      url: 'https://cdn-icons-png.flaticon.com/512/4712/4712139.png',
                      size: 'Small',
                      style: 'Person'
                    }
                  ]
                },
                {
                  type: 'Column',
                  width: 'stretch',
                  items: [
                    {
                      type: 'TextBlock',
                      text: '🤖 AI Assistant',
                      weight: 'Bolder'
                    },
                    {
                      type: 'TextBlock',
                      text: response,
                      wrap: true,
                      spacing: 'Small'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    if (suggestions.length > 0) {
      card.body.push({
        type: 'Container',
        style: 'Emphasis',
        items: [
          {
            type: 'TextBlock',
            text: '💡 Suggestions:',
            weight: 'Bolder',
            size: 'Small'
          },
          ...suggestions.map(suggestion => ({
            type: 'TextBlock',
            text: `• ${suggestion}`,
            wrap: true,
            size: 'Small'
          }))
        ]
      });
    }

    return card;
  }

  private generateContextualActions(text: string): TeamsAction[] {
    const actions: TeamsAction[] = [];

    if (text.toLowerCase().includes('deploy')) {
      actions.push({
        type: 'Action.Submit',
        title: '🚀 Start Deployment',
        data: { action: 'deploy' },
        style: 'positive'
      });
    }

    if (text.toLowerCase().includes('review') || text.toLowerCase().includes('code')) {
      actions.push({
        type: 'Action.Submit',
        title: '👀 Request Review',
        data: { action: 'review' }
      });
    }

    if (text.toLowerCase().includes('meeting') || text.toLowerCase().includes('schedule')) {
      actions.push({
        type: 'Action.Submit',
        title: '📅 Schedule Meeting',
        data: { action: 'schedule_meeting' }
      });
    }

    actions.push({
      type: 'Action.Submit',
      title: '❓ Get Help',
      data: { action: 'help' }
    });

    return actions;
  }

  async handleCommand(integrationId: string, command: TeamsCommand): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration || !integration.botSettings.enableCommands) {
      return this.createSimpleCard('Commands are not enabled for this integration.', 'Error');
    }

    switch (command.commandName) {
      case 'status':
        return this.handleStatusCommand(integration, command);
      case 'deploy':
        return this.handleDeployCommand(integration, command);
      case 'review':
        return this.handleReviewCommand(integration, command);
      case 'meeting':
        return this.handleMeetingCommand(integration, command);
      case 'ai':
        return this.handleAICommand(integration, command);
      case 'help':
        return this.handleHelpCommand(integration, command);
      default:
        return this.createSimpleCard(`Unknown command: ${command.commandName}`, 'Error');
    }
  }

  private async handleStatusCommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: '📊 System Status',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'FactSet',
              facts: [
                { title: 'Server', value: '✅ Online' },
                { title: 'Database', value: '✅ Connected' },
                { title: 'AI Services', value: '✅ Active' },
                { title: 'Deployments', value: '✅ Ready' },
                { title: 'Last Updated', value: new Date().toLocaleString() }
              ]
            }
          ]
        }
      ]
    };
  }

  private async handleDeployCommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Warning',
          items: [
            {
              type: 'TextBlock',
              text: '🚀 Deployment Request',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: `Deployment initiated by ${command.userName}`,
              wrap: true
            },
            {
              type: 'TextBlock',
              text: 'This deployment will update the production environment. Please review before proceeding.',
              wrap: true,
              spacing: 'Medium'
            }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Approve Deployment',
          data: { action: 'approve_deployment', userId: command.userId },
          style: 'positive'
        },
        {
          type: 'Action.Submit',
          title: 'Cancel',
          data: { action: 'cancel_deployment' },
          style: 'destructive'
        },
        {
          type: 'Action.ShowCard',
          title: 'View Details',
          card: {
            type: 'AdaptiveCard',
            body: [
              {
                type: 'TextBlock',
                text: 'Deployment Details:',
                weight: 'Bolder'
              },
              {
                type: 'FactSet',
                facts: [
                  { title: 'Environment', value: 'Production' },
                  { title: 'Version', value: 'v3.0.0' },
                  { title: 'Estimated Time', value: '5-10 minutes' },
                  { title: 'Rollback Available', value: 'Yes' }
                ]
              }
            ]
          }
        }
      ]
    };
  }

  private async handleReviewCommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: '👀 Code Review Request',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: `Review requested by ${command.userName}`,
              wrap: true
            },
            {
              type: 'Input.Text',
              id: 'reviewDescription',
              placeholder: 'Describe what needs to be reviewed...',
              isMultiline: true
            }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Submit Review Request',
          data: { action: 'submit_review_request', userId: command.userId },
          style: 'positive'
        }
      ]
    };
  }

  private async handleMeetingCommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Emphasis',
          items: [
            {
              type: 'TextBlock',
              text: '📅 Schedule Meeting',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'Input.Text',
              id: 'meetingTitle',
              placeholder: 'Meeting title...'
            },
            {
              type: 'Input.Date',
              id: 'meetingDate'
            },
            {
              type: 'Input.Time',
              id: 'meetingTime'
            },
            {
              type: 'Input.Text',
              id: 'meetingDescription',
              placeholder: 'Meeting description...',
              isMultiline: true
            }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Schedule Meeting',
          data: { action: 'schedule_meeting', userId: command.userId },
          style: 'positive'
        }
      ]
    };
  }

  private async handleAICommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    const question = command.parameters.question;
    if (!question) {
      return this.createSimpleCard('Please provide a question for the AI assistant.', 'Error');
    }

    // This would be called from the bot handler with proper context
    return this.createSimpleCard('AI command needs to be processed with proper turn context.', 'Info');
  }

  private async handleHelpCommand(integration: TeamsIntegration, command: TeamsCommand): Promise<any> {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: `🤖 ${integration.botSettings.botName} - Help`,
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: 'Available Commands:',
              weight: 'Bolder',
              spacing: 'Medium'
            },
            {
              type: 'FactSet',
              facts: [
                { title: '@mention + question', value: 'Ask AI assistant' },
                { title: 'status', value: 'Check system status' },
                { title: 'deploy', value: 'Start deployment' },
                { title: 'review', value: 'Request code review' },
                { title: 'meeting', value: 'Schedule a meeting' },
                { title: 'help', value: 'Show this help' }
              ]
            }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: 'View Documentation',
          url: 'https://docs.claudecode.dev'
        }
      ]
    };
  }

  private createSimpleCard(message: string, style: 'Good' | 'Warning' | 'Attention' | 'Error' | 'Info' = 'Info'): any {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: style === 'Error' ? 'Attention' : style,
          items: [
            {
              type: 'TextBlock',
              text: message,
              wrap: true
            }
          ]
        }
      ]
    };
  }

  storeConversationReference(integrationId: string, conversationReference: any): void {
    const integration = this.integrations.get(integrationId);
    if (integration) {
      const key = conversationReference.conversation.id;
      integration.conversationReferences.set(key, conversationReference);
    }
  }

  async updateIntegration(integrationId: string, updates: Partial<TeamsIntegration>): Promise<TeamsIntegration> {
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

    this.botAdapters.delete(integrationId);
    this.activityHandlers.delete(integrationId);
    this.integrations.delete(integrationId);

    this.emit('integration_deleted', integration);
  }

  getIntegration(integrationId: string): TeamsIntegration | undefined {
    return this.integrations.get(integrationId);
  }

  getAllIntegrations(): TeamsIntegration[] {
    return Array.from(this.integrations.values());
  }

  private getDefaultNotificationSettings(): TeamsNotificationSettings {
    return {
      enableRealTime: true,
      enableAdaptiveCards: true,
      enableProactiveMessages: true,
      quietHours: {
        start: '22:00',
        end: '08:00',
        timezone: 'UTC'
      },
      urgencyLevels: {
        critical: {
          enabled: true,
          immediate: true,
          useAdaptiveCard: true,
          mentionChannel: true,
          mentionUsers: [],
          customTitle: '🚨 Critical Alert',
          customColor: 'Attention'
        },
        high: {
          enabled: true,
          immediate: true,
          useAdaptiveCard: true,
          mentionChannel: false,
          mentionUsers: [],
          customColor: 'Warning'
        },
        medium: {
          enabled: true,
          immediate: false,
          useAdaptiveCard: true,
          mentionChannel: false,
          mentionUsers: [],
          customColor: 'Good'
        },
        low: {
          enabled: false,
          immediate: false,
          useAdaptiveCard: false,
          mentionChannel: false,
          mentionUsers: []
        }
      }
    };
  }

  private getDefaultBotSettings(): TeamsBotSettings {
    return {
      botName: 'Claude Code Assistant',
      botIcon: 'https://cdn-icons-png.flaticon.com/512/4712/4712139.png',
      enableAI: true,
      aiPersonality: 'professional',
      enableCommands: true,
      enableAdaptiveCards: true,
      enableFileSharing: true,
      autoRespond: false,
      learningMode: true,
      enableMeetingIntegration: true
    };
  }

  private generateId(): string {
    return `teams_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      userEngagement: this.calculateUserEngagement(notifications),
      adaptiveCardUsage: notifications.filter(n => n.adaptiveCard).length / notifications.length
    };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateAverageResponseTime(notifications: TeamsNotification[]): number {
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

  private getTopChannels(notifications: TeamsNotification[]): Record<string, number> {
    return this.groupBy(notifications, 'channelId');
  }

  private calculateUserEngagement(notifications: TeamsNotification[]): any {
    const userResponses = notifications.flatMap(n => n.responses);
    const uniqueUsers = new Set(userResponses.map(r => r.userId));
    
    return {
      totalResponses: userResponses.length,
      uniqueUsers: uniqueUsers.size,
      averageResponsesPerUser: userResponses.length / uniqueUsers.size
    };
  }
}

class TeamsBot extends TeamsActivityHandler {
  private teamsService: TeamsIntegrationService;
  private integrationId: string;

  constructor(teamsService: TeamsIntegrationService, integrationId: string) {
    super();
    this.teamsService = teamsService;
    this.integrationId = integrationId;

    this.onMessage(async (context, next) => {
      await this.handleMessage(context);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      await this.handleMembersAdded(context);
      await next();
    });

    this.onTeamsCardAction(async (context, next) => {
      await this.handleCardAction(context);
      await next();
    });

    this.onTeamsMessagingExtensionQuery(async (context, next) => {
      await this.handleMessagingExtension(context);
      await next();
    });
  }

  private async handleMessage(context: TurnContext): Promise<void> {
    const integration = this.teamsService.getIntegration(this.integrationId);
    if (!integration) return;

    // Store conversation reference for proactive messages
    this.teamsService.storeConversationReference(this.integrationId, TurnContext.getConversationReference(context.activity));

    const text = context.activity.text?.replace(/<at[^>]*>.*?<\/at>/g, '').trim();
    if (!text) return;

    if (integration.botSettings.enableAI) {
      const aiResponse = await this.teamsService.generateAIResponse(integration, context, text);
      
      if (aiResponse.confidence > 0.7) {
        if (aiResponse.adaptiveCard) {
          const cardActivity = MessageFactory.attachment(CardFactory.adaptiveCard(aiResponse.adaptiveCard));
          await context.sendActivity(cardActivity);
        } else {
          await context.sendActivity(MessageFactory.text(aiResponse.response));
        }
      }
    }
  }

  private async handleMembersAdded(context: TurnContext): Promise<void> {
    const welcomeCard = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: 'Welcome to the team! 👋',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: "I'm Claude Code Assistant, your AI development companion. I can help you with deployments, code reviews, project updates, and much more!",
              wrap: true,
              spacing: 'Medium'
            }
          ]
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Get Started',
          data: { action: 'get_started' },
          style: 'positive'
        },
        {
          type: 'Action.Submit',
          title: 'View Commands',
          data: { action: 'view_commands' }
        }
      ]
    };

    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(welcomeCard));
    await context.sendActivity(activity);
  }

  private async handleCardAction(context: TurnContext): Promise<void> {
    const action = context.activity.value;
    
    switch (action.action) {
      case 'get_started':
        await this.sendGettingStartedCard(context);
        break;
      case 'view_commands':
        await this.sendCommandsCard(context);
        break;
      case 'acknowledge':
        await this.handleNotificationAcknowledge(context, action.notificationId);
        break;
      case 'approve_deployment':
        await this.handleDeploymentApproval(context, action.userId);
        break;
      default:
        await context.sendActivity(MessageFactory.text(`Action "${action.action}" completed successfully.`));
    }
  }

  private async sendGettingStartedCard(context: TurnContext): Promise<void> {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: '🚀 Getting Started',
              weight: 'Bolder',
              size: 'Large'
            },
            {
              type: 'TextBlock',
              text: 'Here\'s what I can help you with:',
              spacing: 'Medium'
            },
            {
              type: 'FactSet',
              facts: [
                { title: '🔔', value: 'Real-time project notifications' },
                { title: '🤖', value: 'AI-powered development assistance' },
                { title: '🚀', value: 'Deployment management' },
                { title: '👀', value: 'Code review coordination' },
                { title: '📊', value: 'Project insights and analytics' },
                { title: '📅', value: 'Meeting scheduling and reminders' }
              ]
            },
            {
              type: 'TextBlock',
              text: 'Try mentioning me (@Claude Code Assistant) with a question, or use commands to get started!',
              wrap: true,
              spacing: 'Medium'
            }
          ]
        }
      ]
    };

    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(card));
    await context.sendActivity(activity);
  }

  private async sendCommandsCard(context: TurnContext): Promise<void> {
    const integration = this.teamsService.getIntegration(this.integrationId);
    if (!integration) return;

    const commandsCard = await this.teamsService.handleCommand(this.integrationId, {
      commandId: 'help_card',
      commandName: 'help',
      parameters: {},
      userId: context.activity.from.id,
      userName: context.activity.from.name || 'Unknown',
      channelId: context.activity.channelId,
      conversationId: context.activity.conversation.id,
      context: {}
    });

    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(commandsCard));
    await context.sendActivity(activity);
  }

  private async handleNotificationAcknowledge(context: TurnContext, notificationId: string): Promise<void> {
    await context.sendActivity(MessageFactory.text('✅ Notification acknowledged. Thank you!'));
  }

  private async handleDeploymentApproval(context: TurnContext, userId: string): Promise<void> {
    const card = {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'Container',
          style: 'Good',
          items: [
            {
              type: 'TextBlock',
              text: '✅ Deployment Approved',
              weight: 'Bolder',
              size: 'Medium'
            },
            {
              type: 'TextBlock',
              text: `Deployment approved by <at>user</at>. Starting deployment process...`,
              wrap: true
            }
          ]
        }
      ]
    };

    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(card));
    await context.sendActivity(activity);
  }

  private async handleMessagingExtension(context: TurnContext): Promise<void> {
    // Handle messaging extension queries (search, action commands, etc.)
    const query = context.activity.value.queryOptions.searchTerm;
    
    // This would implement search functionality for the messaging extension
    // For now, return empty results
    const searchResults = [];
    
    await context.sendActivity(MessageFactory.text(`Searched for: ${query}`));
  }
}