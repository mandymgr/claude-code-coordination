import express from 'express';
import { NeuralArchitectureSearch } from '../services/ai-automation/automl/neuralArchitectureSearch';

// Lazy load TensorFlow.js only when needed
let tf: typeof import('@tensorflow/tfjs-node') | null = null;

async function ensureTensorFlow() {
  if (!tf) {
    console.log('🧠 Loading TensorFlow.js on-demand...');
    tf = await import('@tensorflow/tfjs-node');
    console.log('✅ TensorFlow.js loaded successfully');
  }
  return tf;
}

const router: express.Router = express.Router();

// Store active NAS instances
const nasInstances = new Map<string, NeuralArchitectureSearch>();

// Default NAS configuration
const defaultConfig = {
  searchSpace: {
    layers: {
      types: ['conv2d', 'dense', 'lstm'] as const,
      depths: [2, 3, 4, 5, 6],
      widths: [32, 64, 128, 256, 512]
    },
    optimizers: ['adam', 'sgd', 'rmsprop'] as const,
    activations: ['relu', 'sigmoid', 'tanh', 'swish'] as const,
    learningRates: [0.001, 0.01, 0.1],
    batchSizes: [16, 32, 64, 128]
  },
  searchStrategy: 'evolutionary' as const,
  populationSize: 20,
  generations: 10,
  evaluationMetric: 'accuracy' as const,
  earlyStoppingPatience: 5,
  resourceConstraints: {
    maxParams: 1000000,
    maxFLOPs: 1000000000,
    maxLatency: 100,
    maxMemory: 512
  }
};

// Create NAS instance
router.post('/create', async (req, res) => {
  try {
    const { sessionId, config = defaultConfig } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    if (nasInstances.has(sessionId)) {
      return res.status(400).json({ error: 'NAS session already exists' });
    }
    
    const nas = new NeuralArchitectureSearch(config);
    nasInstances.set(sessionId, nas);
    
    // Set up event listeners
    nas.on('search_started', (data) => {
      console.log(`🚀 NAS Search started for session ${sessionId}:`, data);
    });
    
    nas.on('generation_complete', (data) => {
      console.log(`🔄 Generation ${data.generation} complete for session ${sessionId}`);
    });
    
    nas.on('architecture_evaluated', (data) => {
      console.log(`⚡ Architecture evaluated for session ${sessionId}:`, data.architectureId);
    });
    
    nas.on('search_completed', (result) => {
      console.log(`✅ NAS Search completed for session ${sessionId}`);
    });
    
    nas.on('search_failed', (error) => {
      console.error(`❌ NAS Search failed for session ${sessionId}:`, error);
    });
    
    return res.json({ 
      success: true, 
      sessionId, 
      config,
      message: 'NAS session created successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to create NAS session', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Load dataset
router.post('/dataset', async (req, res) => {
  try {
    const { sessionId, dataset } = req.body;
    
    if (!sessionId || !dataset) {
      return res.status(400).json({ error: 'Session ID and dataset are required' });
    }
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    // Convert dataset arrays to tensors
    const processedDataset = {
      ...dataset,
      trainX: tf.tensor(dataset.trainX),
      trainY: tf.tensor(dataset.trainY),
      validX: tf.tensor(dataset.validX),
      validY: tf.tensor(dataset.validY),
      testX: dataset.testX ? tf.tensor(dataset.testX) : undefined,
      testY: dataset.testY ? tf.tensor(dataset.testY) : undefined
    };
    
    await nas.loadDataset(processedDataset);
    
    return res.json({ 
      success: true, 
      message: 'Dataset loaded successfully',
      dataset: {
        name: dataset.name,
        type: dataset.type,
        inputShape: dataset.inputShape,
        outputShape: dataset.outputShape
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to load dataset', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Start architecture search
router.post('/search', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    // Start search asynchronously
    nas.search().then((result) => {
      console.log(`✅ Search completed for session ${sessionId}`);
    }).catch((error) => {
      console.error(`❌ Search failed for session ${sessionId}:`, error);
    });
    
    return res.json({ 
      success: true, 
      message: 'Architecture search started',
      sessionId 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to start search', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get search progress
router.get('/progress/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    const progress = nas.getSearchProgress();
    
    return res.json({ 
      sessionId, 
      progress 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to get search progress', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Stop search
router.post('/stop', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    nas.stopSearch();
    
    return res.json({ 
      success: true, 
      message: 'Search stopped',
      sessionId 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to stop search', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get search results
router.get('/results/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    const progress = nas.getSearchProgress();
    
    if (progress.isSearching) {
      return res.status(202).json({ 
        message: 'Search still in progress',
        progress 
      });
    }
    
    // For now, return progress info. In a real implementation,
    // you would store and return the actual SearchResult
    return res.json({ 
      sessionId, 
      progress,
      message: 'Search results available'
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to get search results', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Export architecture
router.post('/export', async (req, res) => {
  try {
    const { sessionId, format = 'json' } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    // For this example, we'll export a mock architecture
    // In a real implementation, you would export the best found architecture
    const mockArchitecture = {
      id: 'best_arch',
      layers: [
        { type: 'conv2d', filters: 64, kernelSize: [3, 3], activation: 'relu' },
        { type: 'dense', units: 128, activation: 'relu' },
        { type: 'dense', units: 10, activation: 'softmax' }
      ],
      optimizer: 'adam',
      learningRate: 0.001,
      batchSize: 32,
      totalParams: 50000,
      flops: 1000000,
      performance: {
        accuracy: 0.92,
        loss: 0.08,
        trainingTime: 30000,
        inferenceLatency: 10,
        memoryUsage: 100
      },
      generation: 10
    };
    
    const exported = await nas.exportArchitecture(mockArchitecture, format as any);
    
    return res.json({ 
      sessionId, 
      format,
      architecture: exported 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to export architecture', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Generate sample dataset
router.post('/generate-dataset', async (req, res) => {
  try {
    const { 
      type = 'classification', 
      samples = 1000, 
      features = 10, 
      classes = 3,
      testSplit = 0.2,
      validSplit = 0.2 
    } = req.body;
    
    let trainX: number[][], trainY: number[][], validX: number[][], validY: number[][], testX: number[][], testY: number[][];
    
    if (type === 'classification') {
      // Generate random classification data
      const allX = Array.from({ length: samples }, () => 
        Array.from({ length: features }, () => Math.random() * 2 - 1)
      );
      const allY = Array.from({ length: samples }, () => {
        const classIndex = Math.floor(Math.random() * classes);
        const oneHot = new Array(classes).fill(0);
        oneHot[classIndex] = 1;
        return oneHot;
      });
      
      // Split data
      const testSize = Math.floor(samples * testSplit);
      const validSize = Math.floor(samples * validSplit);
      const trainSize = samples - testSize - validSize;
      
      trainX = allX.slice(0, trainSize);
      trainY = allY.slice(0, trainSize);
      validX = allX.slice(trainSize, trainSize + validSize);
      validY = allY.slice(trainSize, trainSize + validSize);
      testX = allX.slice(trainSize + validSize);
      testY = allY.slice(trainSize + validSize);
      
    } else if (type === 'regression') {
      // Generate random regression data
      const allX = Array.from({ length: samples }, () => 
        Array.from({ length: features }, () => Math.random() * 2 - 1)
      );
      const allY = allX.map(x => [x.reduce((sum, val) => sum + val * Math.random(), Math.random())]);
      
      // Split data
      const testSize = Math.floor(samples * testSplit);
      const validSize = Math.floor(samples * validSplit);
      const trainSize = samples - testSize - validSize;
      
      trainX = allX.slice(0, trainSize);
      trainY = allY.slice(0, trainSize);
      validX = allX.slice(trainSize, trainSize + validSize);
      validY = allY.slice(trainSize, trainSize + validSize);
      testX = allX.slice(trainSize + validSize);
      testY = allY.slice(trainSize + validSize);
      
    } else {
      return res.status(400).json({ error: 'Unsupported dataset type' });
    }
    
    const dataset = {
      name: `generated_${type}_${Date.now()}`,
      type,
      trainX,
      trainY,
      validX,
      validY,
      testX,
      testY,
      inputShape: [features],
      outputShape: type === 'classification' ? [classes] : [1],
      classes: type === 'classification' ? classes : undefined
    };
    
    return res.json({ 
      success: true, 
      dataset,
      statistics: {
        totalSamples: samples,
        trainingSamples: trainX.length,
        validationSamples: validX.length,
        testSamples: testX.length,
        features: features,
        classes: type === 'classification' ? classes : undefined
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to generate dataset', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete NAS session
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const nas = nasInstances.get(sessionId);
    if (!nas) {
      return res.status(404).json({ error: 'NAS session not found' });
    }
    
    // Stop any ongoing search
    nas.stopSearch();
    
    // Remove from instances
    nasInstances.delete(sessionId);
    
    return res.json({ 
      success: true, 
      message: 'NAS session deleted',
      sessionId 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to delete NAS session', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get all active sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = Array.from(nasInstances.keys()).map(sessionId => {
      const nas = nasInstances.get(sessionId)!;
      const progress = nas.getSearchProgress();
      
      return {
        sessionId,
        isSearching: progress.isSearching,
        currentGeneration: progress.currentGeneration,
        totalGenerations: progress.totalGenerations,
        bestPerformance: progress.bestPerformance
      };
    });
    
    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to get sessions', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get default configuration
router.get('/config/default', async (req, res) => {
  try {
    return res.json({ config: defaultConfig });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to get default config', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;