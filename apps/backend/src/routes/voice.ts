import express from 'express';
import multer from 'multer';
import { VoiceInterface } from '../services/voice/voiceInterface';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Default voice configuration
const defaultVoiceConfig = {
  speechToText: {
    provider: 'whisper' as const,
    model: 'whisper-1',
    language: 'en',
    enableRealtime: false
  },
  textToSpeech: {
    provider: 'azure' as const,
    voice: 'en-US-AriaNeural',
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0
  },
  naturalLanguage: {
    provider: 'openai' as const,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150
  },
  wakeWord: {
    enabled: false,
    word: 'claude',
    sensitivity: 0.8
  },
  audioProcessing: {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    noiseReduction: true,
    echoCancel: true
  }
};

const voiceInterface = new VoiceInterface(defaultVoiceConfig);

// Initialize voice interface
router.post('/initialize', async (req, res) => {
  try {
    const { config = defaultVoiceConfig } = req.body;
    
    // Create new instance with custom config if provided
    let voiceService = voiceInterface;
    if (req.body.config) {
      voiceService = new VoiceInterface(config);
    }
    
    await voiceService.initialize();
    res.json({ success: true, message: 'Voice interface initialized' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to initialize voice interface', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Speech-to-Text
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const audioData = {
      buffer: req.file.buffer,
      format: req.file.mimetype.includes('wav') ? 'wav' : 
              req.file.mimetype.includes('mp3') ? 'mp3' : 'ogg',
      sampleRate: parseInt(req.body.sampleRate) || 16000,
      channels: parseInt(req.body.channels) || 1,
      duration: parseFloat(req.body.duration) || 0
    };

    const transcription = await voiceInterface.transcribeAudio(audioData);
    
    res.json({
      transcription: {
        text: transcription.text,
        confidence: transcription.confidence,
        language: transcription.language,
        processing_time: transcription.processing_time
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to transcribe audio', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Text-to-Speech
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const synthesis = await voiceInterface.synthesizeSpeech(text, voice);
    
    // Set appropriate headers for audio response
    res.set({
      'Content-Type': `audio/${synthesis.format}`,
      'Content-Length': synthesis.audioBuffer.length.toString(),
      'X-Audio-Duration': synthesis.duration.toString(),
      'X-Processing-Time': synthesis.processing_time.toString()
    });
    
    return res.send(synthesis.audioBuffer);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to synthesize speech', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Natural Language Processing
router.post('/process', async (req, res) => {
  try {
    const { text, sessionId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const context = sessionId ? voiceInterface.getConversation(sessionId) : undefined;
    const result = await voiceInterface.processNaturalLanguage(text, context);
    
    res.json({
      response: result.response,
      intent: result.intent,
      actions: result.actions
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process natural language', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Complete Voice Interaction
router.post('/interact', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { sessionId, responseFormat = 'json' } = req.body;
    
    const audioData = {
      buffer: req.file.buffer,
      format: req.file.mimetype.includes('wav') ? 'wav' : 
              req.file.mimetype.includes('mp3') ? 'mp3' : 'ogg',
      sampleRate: parseInt(req.body.sampleRate) || 16000,
      channels: parseInt(req.body.channels) || 1,
      duration: parseFloat(req.body.duration) || 0
    };

    const interaction = await voiceInterface.handleVoiceInteraction(audioData, sessionId);
    
    if (responseFormat === 'audio') {
      // Return audio response
      res.set({
        'Content-Type': `audio/${interaction.audioResponse.format}`,
        'X-Transcription': encodeURIComponent(interaction.transcription.text),
        'X-Response-Text': encodeURIComponent(interaction.response)
      });
      return res.send(interaction.audioResponse.audioBuffer);
    } else {
      // Return JSON response
      res.json({
        transcription: {
          text: interaction.transcription.text,
          confidence: interaction.transcription.confidence
        },
        response: interaction.response,
        audioResponse: {
          format: interaction.audioResponse.format,
          duration: interaction.audioResponse.duration,
          size: interaction.audioResponse.audioBuffer.length
        },
        actions: interaction.actions
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process voice interaction', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Conversation Management
router.post('/conversation/create', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const sessionId = voiceInterface.createConversation(userId, preferences);
    
    res.json({
      sessionId,
      userId,
      preferences,
      message: 'Conversation created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create conversation', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = voiceInterface.getConversation(sessionId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      sessionId,
      conversation: {
        userId: conversation.userId,
        preferences: conversation.preferences,
        metadata: conversation.metadata,
        historyCount: conversation.history.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get conversation', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/conversation/:sessionId/history', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;
    
    const conversation = voiceInterface.getConversation(sessionId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const history = conversation.history
      .slice(-Number(limit))
      .map(entry => ({
        role: entry.role,
        content: entry.content,
        timestamp: entry.timestamp,
        hasAudio: !!entry.audio
      }));

    res.json({
      sessionId,
      history,
      totalEntries: conversation.history.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get conversation history', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Voice Commands
router.get('/commands', async (req, res) => {
  try {
    const commands = voiceInterface.getVoiceCommands();
    
    res.json({
      commands: commands.map(cmd => ({
        trigger: cmd.trigger,
        action: cmd.action,
        description: cmd.description,
        confirmation: cmd.confirmation
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get voice commands', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/commands', async (req, res) => {
  try {
    const { trigger, action, description, confirmation = false, parameters } = req.body;
    
    if (!trigger || !action || !description) {
      return res.status(400).json({ error: 'Trigger, action, and description are required' });
    }

    const command = {
      trigger,
      action,
      description,
      confirmation,
      parameters
    };

    voiceInterface.addVoiceCommand(command);
    
    res.json({
      success: true,
      command,
      message: 'Voice command added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to add voice command', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.delete('/commands/:trigger', async (req, res) => {
  try {
    const { trigger } = req.params;
    
    voiceInterface.removeVoiceCommand(decodeURIComponent(trigger));
    
    res.json({
      success: true,
      message: 'Voice command removed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to remove voice command', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Available Voices
router.get('/voices', async (req, res) => {
  try {
    const voices = voiceInterface.getAvailableVoices();
    
    res.json({ voices });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get available voices', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Active Sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = voiceInterface.getActiveSessions();
    
    const sessionDetails = sessions.map(sessionId => {
      const conversation = voiceInterface.getConversation(sessionId);
      return {
        sessionId,
        userId: conversation?.userId,
        lastActivity: conversation?.metadata.lastActivity,
        totalInteractions: conversation?.metadata.totalInteractions
      };
    });
    
    res.json({ sessions: sessionDetails });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get active sessions', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Service Status
router.get('/status', async (req, res) => {
  try {
    const isInitialized = voiceInterface.isInitialized();
    const activeSessions = voiceInterface.getActiveSessions().length;
    const availableVoices = voiceInterface.getAvailableVoices().length;
    const commandCount = voiceInterface.getVoiceCommands().length;
    
    res.json({
      isInitialized,
      activeSessions,
      availableVoices,
      commandCount,
      config: {
        sttProvider: defaultVoiceConfig.speechToText.provider,
        ttsProvider: defaultVoiceConfig.textToSpeech.provider,
        nlpProvider: defaultVoiceConfig.naturalLanguage.provider,
        wakeWordEnabled: defaultVoiceConfig.wakeWord.enabled
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get service status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Configuration
router.get('/config', async (req, res) => {
  try {
    res.json({ config: defaultVoiceConfig });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get configuration', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/config', async (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config) {
      return res.status(400).json({ error: 'Configuration is required' });
    }

    // In a real implementation, you would validate and update the config
    res.json({
      success: true,
      message: 'Configuration updated (note: requires restart to take effect)',
      config
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update configuration', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;