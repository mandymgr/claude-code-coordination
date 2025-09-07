import { EventEmitter } from 'events';

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'time-series' | 'classification' | 'regression' | 'anomaly-detection' | 'clustering' | 'reinforcement';
  domain: 'performance' | 'security' | 'user-behavior' | 'system-health' | 'cost' | 'deployment' | 'quality';
  algorithm: 'linear-regression' | 'random-forest' | 'neural-network' | 'lstm' | 'arima' | 'isolation-forest' | 'kmeans' | 'svm';
  features: {
    name: string;
    type: 'numerical' | 'categorical' | 'boolean' | 'timestamp' | 'text';
    importance: number;
    description: string;
  }[];
  hyperparameters: Record<string, any>;
  training: {
    dataset: string;
    sampleSize: number;
    trainingDate: Date;
    validationScore: number;
    testScore: number;
    crossValidationScore?: number;
    featureImportance: Record<string, number>;
  };
  performance: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mse?: number;
    mae?: number;
    r2Score?: number;
    auc?: number;
  };
  deployment: {
    status: 'training' | 'validating' | 'deployed' | 'retired' | 'failed';
    version: string;
    deploymentDate?: Date;
    endpointUrl?: string;
    batchSize?: number;
    latency: number; // ms
    throughput: number; // predictions/second
  };
  monitoring: {
    driftDetection: boolean;
    performanceDegradation: boolean;
    lastCheck: Date;
    alertThresholds: {
      accuracy: number;
      latency: number;
      errorRate: number;
    };
  };
  metadata: {
    creator: string;
    description: string;
    tags: string[];
    businessValue: string;
    updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Prediction {
  id: string;
  modelId: string;
  input: Record<string, any>;
  output: {
    prediction: any;
    confidence: number;
    probability?: number[];
    explanation?: {
      topFeatures: { feature: string; importance: number }[];
      reasoning: string;
    };
  };
  metadata: {
    timestamp: Date;
    latency: number;
    version: string;
    batchId?: string;
  };
  feedback?: {
    actualOutcome?: any;
    accuracy?: number;
    userRating?: number;
    comments?: string;
    timestamp?: Date;
  };
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  category: 'trend' | 'anomaly' | 'pattern' | 'forecast' | 'recommendation' | 'alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: {
    scope: 'system' | 'service' | 'user' | 'business';
    magnitude: 'minor' | 'moderate' | 'major' | 'severe';
    timeframe: string;
    affectedComponents: string[];
  };
  data: {
    source: string;
    period: { start: Date; end: Date };
    metrics: Record<string, number>;
    visualizations: {
      type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge';
      config: Record<string, any>;
      data: any[];
    }[];
  };
  recommendations: {
    action: string;
    priority: number;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    timeline: string;
    resources: string[];
  }[];
  status: 'new' | 'investigating' | 'acknowledged' | 'resolved' | 'dismissed';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataPipeline {
  id: string;
  name: string;
  description: string;
  sources: {
    id: string;
    type: 'database' | 'api' | 'file' | 'stream' | 'webhook';
    connection: string;
    query?: string;
    schedule?: string;
    format: 'json' | 'csv' | 'xml' | 'parquet' | 'avro';
  }[];
  transformations: {
    id: string;
    type: 'filter' | 'aggregate' | 'join' | 'normalize' | 'enrich' | 'validate';
    config: Record<string, any>;
    order: number;
  }[];
  destinations: {
    id: string;
    type: 'warehouse' | 'lake' | 'cache' | 'api' | 'model';
    connection: string;
    format: 'json' | 'csv' | 'parquet' | 'avro';
  }[];
  schedule: {
    type: 'realtime' | 'batch' | 'streaming';
    frequency?: string; // cron expression
    batchSize?: number;
    parallelism?: number;
  };
  monitoring: {
    healthCheck: boolean;
    dataQuality: boolean;
    performance: boolean;
    alerting: boolean;
    retention: number; // days
  };
  status: 'draft' | 'running' | 'paused' | 'failed' | 'completed';
  metrics: {
    recordsProcessed: number;
    recordsSkipped: number;
    recordsErrored: number;
    averageLatency: number;
    throughput: number;
    lastRun?: Date;
    nextRun?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MLExperiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  type: 'a-b-test' | 'multivariate' | 'feature-flag' | 'model-comparison' | 'parameter-tuning';
  configuration: {
    variants: {
      name: string;
      description: string;
      allocation: number; // percentage
      parameters: Record<string, any>;
    }[];
    targetMetric: string;
    successCriteria: {
      metric: string;
      operator: '>' | '<' | '=' | '>=' | '<=';
      value: number;
      confidence: number;
    };
    duration: number; // days
    sampleSize: number;
    audience: {
      criteria: Record<string, any>;
      percentage: number;
    };
  };
  status: 'draft' | 'running' | 'paused' | 'completed' | 'failed';
  results?: {
    winner?: string;
    significance: number;
    confidence: number;
    metrics: {
      variant: string;
      metric: string;
      value: number;
      standardError: number;
    }[];
    recommendation: string;
    insights: string[];
  };
  timeline: {
    plannedStart: Date;
    plannedEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class PredictiveIntelligenceService extends EventEmitter {
  private models: Map<string, PredictiveModel> = new Map();
  private predictions: Map<string, Prediction[]> = new Map();
  private insights: Map<string, AnalyticsInsight> = new Map();
  private pipelines: Map<string, DataPipeline> = new Map();
  private experiments: Map<string, MLExperiment> = new Map();
  private modelTrainingQueue: string[] = [];
  private predictionCache: Map<string, Prediction> = new Map();

  constructor() {
    super();
    this.setupDefaultModels();
    this.startModelMonitoring();
    this.startInsightGeneration();
  }

  private setupDefaultModels(): void {
    // Performance Prediction Model
    const performanceModel: PredictiveModel = {
      id: 'performance-predictor',
      name: 'System Performance Predictor',
      type: 'time-series',
      domain: 'performance',
      algorithm: 'lstm',
      features: [
        { name: 'cpu_usage', type: 'numerical', importance: 0.8, description: 'CPU utilization percentage' },
        { name: 'memory_usage', type: 'numerical', importance: 0.7, description: 'Memory utilization percentage' },
        { name: 'request_rate', type: 'numerical', importance: 0.9, description: 'Requests per second' },
        { name: 'hour_of_day', type: 'numerical', importance: 0.6, description: 'Hour of the day' },
        { name: 'day_of_week', type: 'categorical', importance: 0.5, description: 'Day of the week' }
      ],
      hyperparameters: {
        sequenceLength: 24,
        hiddenUnits: 128,
        learningRate: 0.001,
        epochs: 100,
        batchSize: 32
      },
      training: {
        dataset: 'performance_metrics_30days',
        sampleSize: 720000,
        trainingDate: new Date(),
        validationScore: 0.92,
        testScore: 0.89,
        crossValidationScore: 0.91,
        featureImportance: {
          request_rate: 0.9,
          cpu_usage: 0.8,
          memory_usage: 0.7,
          hour_of_day: 0.6,
          day_of_week: 0.5
        }
      },
      performance: {
        mse: 0.08,
        mae: 0.12,
        r2Score: 0.89
      },
      deployment: {
        status: 'deployed',
        version: 'v1.2.0',
        deploymentDate: new Date(),
        endpointUrl: '/api/predict/performance',
        batchSize: 1000,
        latency: 45,
        throughput: 500
      },
      monitoring: {
        driftDetection: true,
        performanceDegradation: false,
        lastCheck: new Date(),
        alertThresholds: {
          accuracy: 0.8,
          latency: 100,
          errorRate: 0.05
        }
      },
      metadata: {
        creator: 'claude-coordination-ai',
        description: 'Predicts system performance metrics 1-6 hours ahead',
        tags: ['performance', 'time-series', 'lstm', 'production'],
        businessValue: 'Enables proactive scaling and performance optimization',
        updateFrequency: 'daily'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Security Threat Detection Model
    const securityModel: PredictiveModel = {
      id: 'security-threat-detector',
      name: 'Security Threat Detection',
      type: 'anomaly-detection',
      domain: 'security',
      algorithm: 'isolation-forest',
      features: [
        { name: 'request_frequency', type: 'numerical', importance: 0.9, description: 'Requests per minute' },
        { name: 'error_rate', type: 'numerical', importance: 0.8, description: 'Error rate percentage' },
        { name: 'unique_ips', type: 'numerical', importance: 0.7, description: 'Number of unique IPs' },
        { name: 'response_size', type: 'numerical', importance: 0.6, description: 'Average response size' },
        { name: 'geographic_diversity', type: 'numerical', importance: 0.5, description: 'Geographic spread score' }
      ],
      hyperparameters: {
        nEstimators: 100,
        contamination: 0.1,
        maxFeatures: 1.0,
        bootstrap: false
      },
      training: {
        dataset: 'security_logs_90days',
        sampleSize: 2160000,
        trainingDate: new Date(),
        validationScore: 0.95,
        testScore: 0.93,
        featureImportance: {
          request_frequency: 0.9,
          error_rate: 0.8,
          unique_ips: 0.7,
          response_size: 0.6,
          geographic_diversity: 0.5
        }
      },
      performance: {
        accuracy: 0.93,
        precision: 0.91,
        recall: 0.89,
        f1Score: 0.90,
        auc: 0.94
      },
      deployment: {
        status: 'deployed',
        version: 'v2.1.0',
        deploymentDate: new Date(),
        endpointUrl: '/api/predict/security',
        batchSize: 500,
        latency: 25,
        throughput: 800
      },
      monitoring: {
        driftDetection: true,
        performanceDegradation: false,
        lastCheck: new Date(),
        alertThresholds: {
          accuracy: 0.85,
          latency: 50,
          errorRate: 0.03
        }
      },
      metadata: {
        creator: 'claude-coordination-ai',
        description: 'Detects potential security threats and anomalous behavior',
        tags: ['security', 'anomaly-detection', 'real-time', 'production'],
        businessValue: 'Prevents security breaches and reduces incident response time',
        updateFrequency: 'hourly'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // User Behavior Analysis Model
    const behaviorModel: PredictiveModel = {
      id: 'user-behavior-analyzer',
      name: 'User Behavior Analysis',
      type: 'clustering',
      domain: 'user-behavior',
      algorithm: 'kmeans',
      features: [
        { name: 'session_duration', type: 'numerical', importance: 0.8, description: 'Average session duration' },
        { name: 'page_views', type: 'numerical', importance: 0.7, description: 'Pages viewed per session' },
        { name: 'feature_usage', type: 'numerical', importance: 0.9, description: 'Feature usage frequency' },
        { name: 'error_encounters', type: 'numerical', importance: 0.6, description: 'Errors encountered' },
        { name: 'time_to_value', type: 'numerical', importance: 0.8, description: 'Time to achieve value' }
      ],
      hyperparameters: {
        nClusters: 5,
        maxIter: 300,
        algorithm: 'auto',
        randomState: 42
      },
      training: {
        dataset: 'user_behavior_60days',
        sampleSize: 150000,
        trainingDate: new Date(),
        validationScore: 0.87,
        testScore: 0.85,
        featureImportance: {
          feature_usage: 0.9,
          session_duration: 0.8,
          time_to_value: 0.8,
          page_views: 0.7,
          error_encounters: 0.6
        }
      },
      performance: {
        // Clustering metrics
        accuracy: 0.85
      },
      deployment: {
        status: 'deployed',
        version: 'v1.5.0',
        deploymentDate: new Date(),
        endpointUrl: '/api/predict/behavior',
        batchSize: 200,
        latency: 35,
        throughput: 300
      },
      monitoring: {
        driftDetection: true,
        performanceDegradation: false,
        lastCheck: new Date(),
        alertThresholds: {
          accuracy: 0.75,
          latency: 80,
          errorRate: 0.05
        }
      },
      metadata: {
        creator: 'claude-coordination-ai',
        description: 'Analyzes user behavior patterns and segments users',
        tags: ['user-behavior', 'clustering', 'segmentation', 'production'],
        businessValue: 'Improves user experience and product development decisions',
        updateFrequency: 'weekly'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.models.set(performanceModel.id, performanceModel);
    this.models.set(securityModel.id, securityModel);
    this.models.set(behaviorModel.id, behaviorModel);
  }

  private startModelMonitoring(): void {
    setInterval(async () => {
      await this.monitorModelHealth();
      await this.detectModelDrift();
      await this.updateModelMetrics();
    }, 300000); // Every 5 minutes
  }

  private startInsightGeneration(): void {
    setInterval(async () => {
      await this.generateInsights();
      await this.detectAnomalies();
      await this.updateTrends();
    }, 600000); // Every 10 minutes
  }

  async createModel(modelData: Omit<PredictiveModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const model: PredictiveModel = {
      ...modelData,
      id: modelId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.models.set(modelId, model);

    this.emit('modelCreated', {
      modelId,
      timestamp: new Date(),
      model
    });

    // Add to training queue if not deployed
    if (model.deployment.status === 'training') {
      this.modelTrainingQueue.push(modelId);
    }

    return modelId;
  }

  async trainModel(modelId: string, trainingData?: any): Promise<void> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    model.deployment.status = 'training';
    model.updatedAt = new Date();

    this.emit('modelTrainingStarted', {
      modelId,
      timestamp: new Date(),
      model
    });

    try {
      // Simulate model training
      await this.simulateModelTraining(model);

      model.deployment.status = 'validating';
      model.training.trainingDate = new Date();
      
      // Simulate validation
      await this.simulateModelValidation(model);

      model.deployment.status = 'deployed';
      model.deployment.deploymentDate = new Date();
      model.deployment.version = `v${Date.now()}`;

      this.emit('modelTrainingCompleted', {
        modelId,
        timestamp: new Date(),
        model,
        performance: model.performance
      });

    } catch (error) {
      model.deployment.status = 'failed';
      
      this.emit('modelTrainingFailed', {
        modelId,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  private async simulateModelTraining(model: PredictiveModel): Promise<void> {
    // Simulate training time based on model complexity
    const trainingTime = model.training.sampleSize / 10000 * 1000; // ms
    await new Promise(resolve => setTimeout(resolve, Math.min(trainingTime, 5000)));

    // Simulate training metrics
    model.training.validationScore = Math.random() * 0.3 + 0.7; // 0.7-1.0
    model.training.testScore = model.training.validationScore - Math.random() * 0.05;
    
    // Update performance metrics based on algorithm
    switch (model.algorithm) {
      case 'linear-regression':
      case 'random-forest':
      case 'neural-network':
      case 'lstm':
        model.performance.mse = Math.random() * 0.2;
        model.performance.mae = model.performance.mse! * 0.8;
        model.performance.r2Score = model.training.testScore;
        break;
      
      case 'isolation-forest':
      case 'svm':
        model.performance.accuracy = model.training.testScore;
        model.performance.precision = Math.random() * 0.2 + 0.8;
        model.performance.recall = Math.random() * 0.2 + 0.8;
        model.performance.f1Score = 2 * (model.performance.precision * model.performance.recall) / (model.performance.precision + model.performance.recall);
        model.performance.auc = Math.random() * 0.2 + 0.8;
        break;
      
      case 'kmeans':
        model.performance.accuracy = model.training.testScore;
        break;
    }
  }

  private async simulateModelValidation(model: PredictiveModel): Promise<void> {
    // Simulate validation time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validation passed if test score is above threshold
    if (model.training.testScore < 0.7) {
      throw new Error('Model validation failed: performance below threshold');
    }
  }

  async makePrediction(modelId: string, input: Record<string, any>): Promise<Prediction> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    if (model.deployment.status !== 'deployed') {
      throw new Error(`Model ${modelId} is not deployed`);
    }

    const predictionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(modelId, input);
    const cachedPrediction = this.predictionCache.get(cacheKey);
    if (cachedPrediction) {
      return cachedPrediction;
    }

    try {
      // Simulate prediction latency
      await new Promise(resolve => setTimeout(resolve, model.deployment.latency));

      const prediction = await this.executePrediction(model, input);
      const latency = Date.now() - startTime;

      const result: Prediction = {
        id: predictionId,
        modelId,
        input,
        output: prediction,
        metadata: {
          timestamp: new Date(),
          latency,
          version: model.deployment.version
        }
      };

      // Cache prediction
      this.predictionCache.set(cacheKey, result);

      // Store prediction
      if (!this.predictions.has(modelId)) {
        this.predictions.set(modelId, []);
      }
      this.predictions.get(modelId)!.push(result);

      this.emit('predictionMade', {
        predictionId,
        modelId,
        timestamp: new Date(),
        latency,
        confidence: prediction.confidence
      });

      return result;

    } catch (error) {
      this.emit('predictionFailed', {
        modelId,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  private generateCacheKey(modelId: string, input: Record<string, any>): string {
    return `${modelId}:${Buffer.from(JSON.stringify(input)).toString('base64')}`;
  }

  private async executePrediction(model: PredictiveModel, input: Record<string, any>): Promise<{
    prediction: any;
    confidence: number;
    probability?: number[];
    explanation?: {
      topFeatures: { feature: string; importance: number }[];
      reasoning: string;
    };
  }> {
    // Simulate different prediction types
    switch (model.type) {
      case 'time-series':
        return {
          prediction: this.simulateTimeSeriesPrediction(model, input),
          confidence: Math.random() * 0.3 + 0.7,
          explanation: this.generateExplanation(model, input)
        };
      
      case 'classification':
        const classProbs = this.simulateClassificationPrediction(model, input);
        return {
          prediction: classProbs.indexOf(Math.max(...classProbs)),
          confidence: Math.max(...classProbs),
          probability: classProbs,
          explanation: this.generateExplanation(model, input)
        };
      
      case 'regression':
        return {
          prediction: this.simulateRegressionPrediction(model, input),
          confidence: Math.random() * 0.3 + 0.7,
          explanation: this.generateExplanation(model, input)
        };
      
      case 'anomaly-detection':
        const anomalyScore = Math.random();
        return {
          prediction: anomalyScore > 0.8 ? 'anomaly' : 'normal',
          confidence: Math.abs(anomalyScore - 0.5) * 2,
          explanation: this.generateExplanation(model, input)
        };
      
      case 'clustering':
        return {
          prediction: Math.floor(Math.random() * 5), // Cluster 0-4
          confidence: Math.random() * 0.3 + 0.7,
          explanation: this.generateExplanation(model, input)
        };
      
      default:
        throw new Error(`Unsupported model type: ${model.type}`);
    }
  }

  private simulateTimeSeriesPrediction(model: PredictiveModel, input: Record<string, any>): number[] {
    // Generate future values based on current input
    const baseValue = Object.values(input)[0] as number || 100;
    const predictions = [];
    
    for (let i = 0; i < 6; i++) { // Predict next 6 time steps
      const trend = (Math.random() - 0.5) * 0.1;
      const seasonal = Math.sin((Date.now() / 1000 + i * 3600) * 2 * Math.PI / 86400) * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      
      predictions.push(baseValue * (1 + trend + seasonal + noise));
    }
    
    return predictions;
  }

  private simulateClassificationPrediction(model: PredictiveModel, input: Record<string, any>): number[] {
    // Generate class probabilities
    const numClasses = 3;
    const probs = Array.from({ length: numClasses }, () => Math.random());
    const sum = probs.reduce((a, b) => a + b, 0);
    return probs.map(p => p / sum);
  }

  private simulateRegressionPrediction(model: PredictiveModel, input: Record<string, any>): number {
    // Simple linear combination of features
    let prediction = 0;
    for (const feature of model.features) {
      const value = input[feature.name] || 0;
      prediction += value * feature.importance * (Math.random() * 0.4 + 0.8);
    }
    return prediction;
  }

  private generateExplanation(model: PredictiveModel, input: Record<string, any>): {
    topFeatures: { feature: string; importance: number }[];
    reasoning: string;
  } {
    const topFeatures = model.features
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map(f => ({
        feature: f.name,
        importance: f.importance * (Math.random() * 0.3 + 0.85)
      }));

    const reasoning = `Prediction based primarily on ${topFeatures[0].feature} (${(topFeatures[0].importance * 100).toFixed(1)}% importance) and ${topFeatures[1].feature} (${(topFeatures[1].importance * 100).toFixed(1)}% importance).`;

    return { topFeatures, reasoning };
  }

  private async monitorModelHealth(): Promise<void> {
    for (const [modelId, model] of this.models) {
      if (model.deployment.status !== 'deployed') continue;

      // Check model performance
      const recentPredictions = this.predictions.get(modelId)?.slice(-100) || [];
      if (recentPredictions.length === 0) continue;

      const avgLatency = recentPredictions.reduce((sum, p) => sum + p.metadata.latency, 0) / recentPredictions.length;
      const errorRate = recentPredictions.filter(p => p.feedback?.accuracy === 0).length / recentPredictions.length;

      // Update deployment metrics
      model.deployment.latency = avgLatency;

      // Check alert thresholds
      let alertTriggered = false;

      if (avgLatency > model.monitoring.alertThresholds.latency) {
        this.emit('modelAlert', {
          modelId,
          type: 'latency',
          current: avgLatency,
          threshold: model.monitoring.alertThresholds.latency,
          timestamp: new Date()
        });
        alertTriggered = true;
      }

      if (errorRate > model.monitoring.alertThresholds.errorRate) {
        this.emit('modelAlert', {
          modelId,
          type: 'errorRate',
          current: errorRate,
          threshold: model.monitoring.alertThresholds.errorRate,
          timestamp: new Date()
        });
        alertTriggered = true;
      }

      model.monitoring.lastCheck = new Date();
      model.updatedAt = new Date();

      if (alertTriggered) {
        this.emit('modelHealthDegraded', {
          modelId,
          model,
          metrics: { avgLatency, errorRate },
          timestamp: new Date()
        });
      }
    }
  }

  private async detectModelDrift(): Promise<void> {
    for (const [modelId, model] of this.models) {
      if (!model.monitoring.driftDetection || model.deployment.status !== 'deployed') continue;

      const recentPredictions = this.predictions.get(modelId)?.slice(-1000) || [];
      if (recentPredictions.length < 100) continue;

      // Simple drift detection based on confidence distribution
      const recentConfidences = recentPredictions.slice(-100).map(p => p.output.confidence);
      const historicalConfidences = recentPredictions.slice(-500, -100).map(p => p.output.confidence);

      const recentMean = recentConfidences.reduce((a, b) => a + b, 0) / recentConfidences.length;
      const historicalMean = historicalConfidences.reduce((a, b) => a + b, 0) / historicalConfidences.length;

      const driftMagnitude = Math.abs(recentMean - historicalMean) / historicalMean;

      if (driftMagnitude > 0.15) { // 15% change threshold
        model.monitoring.performanceDegradation = true;
        
        this.emit('modelDriftDetected', {
          modelId,
          driftMagnitude,
          recentMean,
          historicalMean,
          timestamp: new Date()
        });

        // Suggest retraining
        this.emit('modelRetrainingRequired', {
          modelId,
          reason: 'drift_detected',
          urgency: driftMagnitude > 0.3 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }
    }
  }

  private async updateModelMetrics(): Promise<void> {
    for (const [modelId, model] of this.models) {
      const predictions = this.predictions.get(modelId) || [];
      const recentPredictions = predictions.slice(-1000);

      if (recentPredictions.length > 0) {
        // Calculate throughput
        const timeSpan = Date.now() - recentPredictions[0].metadata.timestamp.getTime();
        model.deployment.throughput = (recentPredictions.length / timeSpan) * 1000; // per second

        // Update other metrics
        model.updatedAt = new Date();
      }
    }
  }

  private async generateInsights(): Promise<void> {
    // Performance insights
    await this.generatePerformanceInsights();
    
    // Security insights
    await this.generateSecurityInsights();
    
    // Business insights
    await this.generateBusinessInsights();
  }

  private async generatePerformanceInsights(): Promise<void> {
    const performanceModel = this.models.get('performance-predictor');
    if (!performanceModel) return;

    const predictions = this.predictions.get('performance-predictor') || [];
    const recentPredictions = predictions.slice(-100);

    if (recentPredictions.length < 10) return;

    // Analyze performance trends
    const avgPredicted = recentPredictions.map(p => p.output.prediction[0] as number);
    const trend = this.calculateTrend(avgPredicted);

    if (trend > 0.1) { // 10% increase trend
      const insight: AnalyticsInsight = {
        id: `insight_perf_${Date.now()}`,
        title: 'Performance Degradation Trend Detected',
        description: 'System performance metrics show an upward trend indicating potential resource constraints',
        category: 'trend',
        severity: trend > 0.3 ? 'high' : 'medium',
        confidence: 0.85,
        impact: {
          scope: 'system',
          magnitude: trend > 0.3 ? 'major' : 'moderate',
          timeframe: '2-4 hours',
          affectedComponents: ['api-server', 'database', 'cache']
        },
        data: {
          source: 'performance-predictor',
          period: {
            start: new Date(Date.now() - 3600000),
            end: new Date()
          },
          metrics: {
            trendMagnitude: trend,
            avgLatency: avgPredicted.reduce((a, b) => a + b, 0) / avgPredicted.length,
            predictionCount: recentPredictions.length
          },
          visualizations: [{
            type: 'line',
            config: { title: 'Performance Trend', xAxis: 'Time', yAxis: 'Latency (ms)' },
            data: avgPredicted.map((value, index) => ({ x: index, y: value }))
          }]
        },
        recommendations: [
          {
            action: 'Increase server capacity',
            priority: 1,
            effort: 'medium',
            impact: 'high',
            timeline: '1-2 hours',
            resources: ['devops-team', 'cloud-resources']
          },
          {
            action: 'Optimize database queries',
            priority: 2,
            effort: 'high',
            impact: 'medium',
            timeline: '1-2 days',
            resources: ['database-team', 'development-team']
          }
        ],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.insights.set(insight.id, insight);

      this.emit('insightGenerated', {
        insightId: insight.id,
        category: 'performance',
        severity: insight.severity,
        timestamp: new Date()
      });
    }
  }

  private async generateSecurityInsights(): Promise<void> {
    const securityModel = this.models.get('security-threat-detector');
    if (!securityModel) return;

    const predictions = this.predictions.get('security-threat-detector') || [];
    const recentAnomalies = predictions
      .filter(p => p.output.prediction === 'anomaly')
      .slice(-50);

    if (recentAnomalies.length > 10) { // More than 10 anomalies recently
      const insight: AnalyticsInsight = {
        id: `insight_sec_${Date.now()}`,
        title: 'Increased Security Anomaly Activity',
        description: `Detected ${recentAnomalies.length} security anomalies in the last hour, indicating potential security threats`,
        category: 'alert',
        severity: recentAnomalies.length > 25 ? 'critical' : 'high',
        confidence: 0.92,
        impact: {
          scope: 'system',
          magnitude: 'major',
          timeframe: 'immediate',
          affectedComponents: ['api-gateway', 'authentication', 'user-data']
        },
        data: {
          source: 'security-threat-detector',
          period: {
            start: new Date(Date.now() - 3600000),
            end: new Date()
          },
          metrics: {
            anomalyCount: recentAnomalies.length,
            avgConfidence: recentAnomalies.reduce((sum, p) => sum + p.output.confidence, 0) / recentAnomalies.length,
            timeSpan: 3600 // seconds
          },
          visualizations: [{
            type: 'bar',
            config: { title: 'Anomaly Detection Over Time', xAxis: 'Hour', yAxis: 'Anomaly Count' },
            data: this.groupAnomaliesByHour(recentAnomalies)
          }]
        },
        recommendations: [
          {
            action: 'Investigate suspicious IP addresses',
            priority: 1,
            effort: 'low',
            impact: 'high',
            timeline: 'immediate',
            resources: ['security-team']
          },
          {
            action: 'Temporarily increase rate limiting',
            priority: 2,
            effort: 'low',
            impact: 'medium',
            timeline: '15 minutes',
            resources: ['devops-team']
          }
        ],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.insights.set(insight.id, insight);

      this.emit('insightGenerated', {
        insightId: insight.id,
        category: 'security',
        severity: insight.severity,
        timestamp: new Date()
      });
    }
  }

  private async generateBusinessInsights(): Promise<void> {
    const behaviorModel = this.models.get('user-behavior-analyzer');
    if (!behaviorModel) return;

    const predictions = this.predictions.get('user-behavior-analyzer') || [];
    const recentPredictions = predictions.slice(-200);

    if (recentPredictions.length < 50) return;

    // Analyze user segments
    const segmentDistribution = this.analyzeUserSegments(recentPredictions);
    const dominantSegment = Object.entries(segmentDistribution)
      .sort(([,a], [,b]) => b - a)[0];

    const insight: AnalyticsInsight = {
      id: `insight_biz_${Date.now()}`,
      title: 'User Behavior Pattern Shift',
      description: `Segment ${dominantSegment[0]} now represents ${dominantSegment[1].toFixed(1)}% of users, indicating changing user behavior`,
      category: 'pattern',
      severity: 'medium',
      confidence: 0.78,
      impact: {
        scope: 'business',
        magnitude: 'moderate',
        timeframe: '1-2 weeks',
        affectedComponents: ['user-experience', 'product-features', 'revenue']
      },
      data: {
        source: 'user-behavior-analyzer',
        period: {
          start: new Date(Date.now() - 7 * 24 * 3600000), // 7 days
          end: new Date()
        },
        metrics: segmentDistribution,
        visualizations: [{
          type: 'pie',
          config: { title: 'User Segment Distribution' },
          data: Object.entries(segmentDistribution).map(([segment, percentage]) => ({
            label: `Segment ${segment}`,
            value: percentage
          }))
        }]
      },
      recommendations: [
        {
          action: 'Analyze dominant segment characteristics',
          priority: 1,
          effort: 'medium',
          impact: 'high',
          timeline: '2-3 days',
          resources: ['analytics-team', 'product-team']
        },
        {
          action: 'Optimize features for dominant segment',
          priority: 2,
          effort: 'high',
          impact: 'high',
          timeline: '1-2 weeks',
          resources: ['development-team', 'ux-team']
        }
      ],
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.insights.set(insight.id, insight);

    this.emit('insightGenerated', {
      insightId: insight.id,
      category: 'business',
      severity: insight.severity,
      timestamp: new Date()
    });
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / (sumY / n); // Normalized slope
  }

  private groupAnomaliesByHour(anomalies: Prediction[]): Array<{ x: number; y: number }> {
    const hourGroups: Record<number, number> = {};
    const currentHour = new Date().getHours();

    for (let i = 0; i < 24; i++) {
      hourGroups[i] = 0;
    }

    anomalies.forEach(anomaly => {
      const hour = anomaly.metadata.timestamp.getHours();
      hourGroups[hour]++;
    });

    return Object.entries(hourGroups).map(([hour, count]) => ({
      x: parseInt(hour),
      y: count
    }));
  }

  private analyzeUserSegments(predictions: Prediction[]): Record<string, number> {
    const segments: Record<string, number> = {};
    
    predictions.forEach(prediction => {
      const segment = `${prediction.output.prediction}`;
      segments[segment] = (segments[segment] || 0) + 1;
    });

    const total = predictions.length;
    Object.keys(segments).forEach(segment => {
      segments[segment] = (segments[segment] / total) * 100;
    });

    return segments;
  }

  private async detectAnomalies(): Promise<void> {
    // Detect anomalies in system metrics
    const systemMetrics = this.getSystemMetrics();
    const anomalies = this.detectSystemAnomalies(systemMetrics);

    if (anomalies.length > 0) {
      const insight: AnalyticsInsight = {
        id: `insight_anom_${Date.now()}`,
        title: 'System Anomalies Detected',
        description: `Detected ${anomalies.length} system anomalies requiring investigation`,
        category: 'anomaly',
        severity: anomalies.some(a => a.severity === 'critical') ? 'critical' : 'high',
        confidence: 0.89,
        impact: {
          scope: 'system',
          magnitude: 'major',
          timeframe: 'immediate',
          affectedComponents: anomalies.map(a => a.component)
        },
        data: {
          source: 'system-monitoring',
          period: {
            start: new Date(Date.now() - 900000), // 15 minutes
            end: new Date()
          },
          metrics: {
            anomalyCount: anomalies.length,
            criticalCount: anomalies.filter(a => a.severity === 'critical').length
          },
          visualizations: [{
            type: 'scatter',
            config: { title: 'Anomaly Distribution', xAxis: 'Time', yAxis: 'Severity' },
            data: anomalies.map((a, i) => ({ x: i, y: a.severity === 'critical' ? 3 : 2 }))
          }]
        },
        recommendations: [
          {
            action: 'Investigate critical anomalies immediately',
            priority: 1,
            effort: 'medium',
            impact: 'high',
            timeline: 'immediate',
            resources: ['sre-team', 'devops-team']
          }
        ],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.insights.set(insight.id, insight);

      this.emit('anomaliesDetected', {
        count: anomalies.length,
        critical: anomalies.filter(a => a.severity === 'critical').length,
        timestamp: new Date()
      });
    }
  }

  private getSystemMetrics(): any[] {
    // Simulate system metrics
    return [
      { name: 'cpu_usage', value: Math.random() * 100, timestamp: new Date() },
      { name: 'memory_usage', value: Math.random() * 100, timestamp: new Date() },
      { name: 'disk_usage', value: Math.random() * 100, timestamp: new Date() },
      { name: 'response_time', value: Math.random() * 1000, timestamp: new Date() },
      { name: 'error_rate', value: Math.random() * 10, timestamp: new Date() }
    ];
  }

  private detectSystemAnomalies(metrics: any[]): Array<{ component: string; severity: 'high' | 'critical'; value: number }> {
    const anomalies: Array<{ component: string; severity: 'high' | 'critical'; value: number }> = [];

    metrics.forEach(metric => {
      let isAnomaly = false;
      let severity: 'high' | 'critical' = 'high';

      switch (metric.name) {
        case 'cpu_usage':
          if (metric.value > 90) {
            isAnomaly = true;
            severity = metric.value > 95 ? 'critical' : 'high';
          }
          break;
        case 'memory_usage':
          if (metric.value > 85) {
            isAnomaly = true;
            severity = metric.value > 95 ? 'critical' : 'high';
          }
          break;
        case 'response_time':
          if (metric.value > 500) {
            isAnomaly = true;
            severity = metric.value > 1000 ? 'critical' : 'high';
          }
          break;
        case 'error_rate':
          if (metric.value > 5) {
            isAnomaly = true;
            severity = metric.value > 10 ? 'critical' : 'high';
          }
          break;
      }

      if (isAnomaly) {
        anomalies.push({
          component: metric.name,
          severity,
          value: metric.value
        });
      }
    });

    return anomalies;
  }

  private async updateTrends(): Promise<void> {
    // Update trends based on historical data
    const trends = this.calculateSystemTrends();

    this.emit('trendsUpdated', {
      trends,
      timestamp: new Date()
    });
  }

  private calculateSystemTrends(): Record<string, { direction: 'up' | 'down' | 'stable'; magnitude: number }> {
    // Simulate trend calculation
    return {
      performance: {
        direction: Math.random() > 0.5 ? 'up' : 'down',
        magnitude: Math.random() * 0.2
      },
      security: {
        direction: 'stable',
        magnitude: Math.random() * 0.1
      },
      usage: {
        direction: 'up',
        magnitude: Math.random() * 0.3
      }
    };
  }

  // Public API methods

  async getModels(): Promise<PredictiveModel[]> {
    return Array.from(this.models.values());
  }

  async getModel(modelId: string): Promise<PredictiveModel | null> {
    return this.models.get(modelId) || null;
  }

  async getInsights(filters?: {
    category?: AnalyticsInsight['category'];
    severity?: AnalyticsInsight['severity'];
    status?: AnalyticsInsight['status'];
    limit?: number;
  }): Promise<AnalyticsInsight[]> {
    let insights = Array.from(this.insights.values());

    if (filters) {
      if (filters.category) {
        insights = insights.filter(i => i.category === filters.category);
      }
      if (filters.severity) {
        insights = insights.filter(i => i.severity === filters.severity);
      }
      if (filters.status) {
        insights = insights.filter(i => i.status === filters.status);
      }
      if (filters.limit) {
        insights = insights.slice(0, filters.limit);
      }
    }

    return insights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInsight(insightId: string): Promise<AnalyticsInsight | null> {
    return this.insights.get(insightId) || null;
  }

  async getPredictions(modelId: string, limit = 100): Promise<Prediction[]> {
    const predictions = this.predictions.get(modelId) || [];
    return predictions.slice(-limit);
  }

  async provideFeedback(predictionId: string, feedback: Prediction['feedback']): Promise<void> {
    // Find prediction and update with feedback
    for (const predictions of this.predictions.values()) {
      const prediction = predictions.find(p => p.id === predictionId);
      if (prediction) {
        prediction.feedback = {
          ...feedback,
          timestamp: new Date()
        };

        this.emit('feedbackReceived', {
          predictionId,
          feedback,
          timestamp: new Date()
        });

        return;
      }
    }

    throw new Error(`Prediction ${predictionId} not found`);
  }

  getMetrics(): {
    totalModels: number;
    deployedModels: number;
    totalPredictions: number;
    totalInsights: number;
    criticalInsights: number;
    averageModelAccuracy: number;
    averagePredictionLatency: number;
  } {
    const models = Array.from(this.models.values());
    const deployedModels = models.filter(m => m.deployment.status === 'deployed');
    
    const totalPredictions = Array.from(this.predictions.values())
      .reduce((sum, predictions) => sum + predictions.length, 0);
    
    const insights = Array.from(this.insights.values());
    const criticalInsights = insights.filter(i => i.severity === 'critical');
    
    const averageAccuracy = models
      .filter(m => m.performance.accuracy !== undefined)
      .reduce((sum, m) => sum + (m.performance.accuracy || 0), 0) / 
      Math.max(models.filter(m => m.performance.accuracy !== undefined).length, 1);
    
    const averageLatency = deployedModels
      .reduce((sum, m) => sum + m.deployment.latency, 0) / 
      Math.max(deployedModels.length, 1);

    return {
      totalModels: models.length,
      deployedModels: deployedModels.length,
      totalPredictions,
      totalInsights: insights.length,
      criticalInsights: criticalInsights.length,
      averageModelAccuracy: Math.round(averageAccuracy * 100) / 100,
      averagePredictionLatency: Math.round(averageLatency)
    };
  }

  destroy(): void {
    this.removeAllListeners();
    this.predictionCache.clear();
  }
}