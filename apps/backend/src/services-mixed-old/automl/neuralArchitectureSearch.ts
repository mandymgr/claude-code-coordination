import { EventEmitter } from 'events';
import { globalMemoryManager } from '../performance/memoryManager';
import { globalLazyLoader, LazyTensorFlowService } from '../performance/lazyLoader';

interface NASConfig {
  searchSpace: {
    layers: {
      types: ('conv2d' | 'dense' | 'lstm' | 'gru' | 'attention' | 'transformer')[];
      depths: number[];
      widths: number[];
    };
    optimizers: ('adam' | 'sgd' | 'rmsprop' | 'adagrad')[];
    activations: ('relu' | 'sigmoid' | 'tanh' | 'swish' | 'gelu')[];
    learningRates: number[];
    batchSizes: number[];
  };
  searchStrategy: 'evolutionary' | 'reinforcement' | 'bayesian' | 'random';
  populationSize: number;
  generations: number;
  evaluationMetric: 'accuracy' | 'loss' | 'f1' | 'auc' | 'custom';
  earlyStoppingPatience: number;
  resourceConstraints: {
    maxParams: number;
    maxFLOPs: number;
    maxLatency: number; // milliseconds
    maxMemory: number; // MB
  };
}

interface Architecture {
  id: string;
  layers: LayerConfig[];
  optimizer: string;
  learningRate: number;
  batchSize: number;
  totalParams: number;
  flops: number;
  performance: {
    accuracy?: number;
    loss?: number;
    f1?: number;
    auc?: number;
    trainingTime: number;
    inferenceLatency: number;
    memoryUsage: number;
  };
  generation: number;
  parentIds?: string[];
}

interface LayerConfig {
  type: string;
  units?: number;
  filters?: number;
  kernelSize?: number[];
  strides?: number[];
  padding?: string;
  activation?: string;
  dropout?: number;
  batchNorm?: boolean;
  attention?: {
    heads: number;
    keyDim: number;
    dropout: number;
  };
}

interface Dataset {
  name: string;
  type: 'classification' | 'regression' | 'sequence' | 'image' | 'text';
  trainX: tf.Tensor;
  trainY: tf.Tensor;
  validX: tf.Tensor;
  validY: tf.Tensor;
  testX?: tf.Tensor;
  testY?: tf.Tensor;
  inputShape: number[];
  outputShape: number[];
  classes?: number;
}

interface SearchResult {
  bestArchitecture: Architecture;
  allArchitectures: Architecture[];
  searchHistory: {
    generation: number;
    bestPerformance: number;
    avgPerformance: number;
    diversity: number;
  }[];
  totalSearchTime: number;
  evaluatedArchitectures: number;
}

export class NeuralArchitectureSearch extends EventEmitter {
  private config: NASConfig;
  private dataset: Dataset | null = null;
  private population: Architecture[] = [];
  private currentGeneration = 0;
  private searchHistory: SearchResult['searchHistory'] = [];
  private bestArchitecture: Architecture | null = null;
  private isSearching = false;
  private searchStartTime = 0;
  private tfService: LazyTensorFlowService | null = null;

  constructor(config: NASConfig) {
    super();
    this.config = config;
    
    // Initialize TensorFlow service lazily
    this.initializeTensorFlowService();
  }

  private async initializeTensorFlowService(): Promise<void> {
    try {
      this.tfService = await globalLazyLoader.load<LazyTensorFlowService>('tensorflow');
      console.log('[NAS] TensorFlow service initialized');
    } catch (error) {
      console.error('[NAS] Failed to initialize TensorFlow service:', error);
      throw error;
    }
  }

  // Dataset Management
  async loadDataset(dataset: Dataset): Promise<void> {
    console.log(`📊 Loading dataset: ${dataset.name}`);
    
    // Validate dataset
    this.validateDataset(dataset);
    
    this.dataset = dataset;
    this.emit('dataset_loaded', { name: dataset.name, type: dataset.type });
    
    console.log(`✅ Dataset loaded: ${dataset.name} (${dataset.type})`);
  }

  private validateDataset(dataset: Dataset): void {
    if (!dataset.trainX || !dataset.trainY || !dataset.validX || !dataset.validY) {
      throw new Error('Dataset must include training and validation sets');
    }
    
    if (dataset.trainX.shape[0] !== dataset.trainY.shape[0]) {
      throw new Error('Training features and labels must have same number of samples');
    }
    
    if (dataset.validX.shape[0] !== dataset.validY.shape[0]) {
      throw new Error('Validation features and labels must have same number of samples');
    }
  }

  // Architecture Generation
  private generateRandomArchitecture(): Architecture {
    const id = `arch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const layers: LayerConfig[] = [];
    
    // Generate random number of layers
    const numLayers = Math.floor(Math.random() * 6) + 2; // 2-7 layers
    
    for (let i = 0; i < numLayers; i++) {
      const layerType = this.config.searchSpace.layers.types[
        Math.floor(Math.random() * this.config.searchSpace.layers.types.length)
      ];
      
      const layer = this.generateLayerConfig(layerType, i === 0, i === numLayers - 1);
      layers.push(layer);
    }
    
    const optimizer = this.config.searchSpace.optimizers[
      Math.floor(Math.random() * this.config.searchSpace.optimizers.length)
    ];
    
    const learningRate = this.config.searchSpace.learningRates[
      Math.floor(Math.random() * this.config.searchSpace.learningRates.length)
    ];
    
    const batchSize = this.config.searchSpace.batchSizes[
      Math.floor(Math.random() * this.config.searchSpace.batchSizes.length)
    ];
    
    return {
      id,
      layers,
      optimizer,
      learningRate,
      batchSize,
      totalParams: this.estimateParams(layers),
      flops: this.estimateFLOPs(layers),
      performance: {
        trainingTime: 0,
        inferenceLatency: 0,
        memoryUsage: 0
      },
      generation: this.currentGeneration
    };
  }

  private generateLayerConfig(type: string, isFirst: boolean, isLast: boolean): LayerConfig {
    const config: LayerConfig = { type };
    
    switch (type) {
      case 'conv2d':
        config.filters = this.config.searchSpace.layers.widths[
          Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
        ];
        config.kernelSize = [3, 3]; // Fixed for simplicity
        config.strides = [1, 1];
        config.padding = 'same';
        config.activation = this.config.searchSpace.activations[
          Math.floor(Math.random() * this.config.searchSpace.activations.length)
        ];
        config.batchNorm = Math.random() > 0.5;
        break;
        
      case 'dense':
        config.units = isLast && this.dataset ? 
          this.dataset.outputShape[0] :
          this.config.searchSpace.layers.widths[
            Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
          ];
        config.activation = isLast ? 
          (this.dataset?.type === 'classification' ? 'softmax' : 'linear') :
          this.config.searchSpace.activations[
            Math.floor(Math.random() * this.config.searchSpace.activations.length)
          ];
        config.dropout = Math.random() * 0.5;
        break;
        
      case 'lstm':
      case 'gru':
        config.units = this.config.searchSpace.layers.widths[
          Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
        ];
        config.dropout = Math.random() * 0.3;
        break;
        
      case 'attention':
      case 'transformer':
        config.attention = {
          heads: Math.pow(2, Math.floor(Math.random() * 4) + 1), // 2, 4, 8, 16
          keyDim: this.config.searchSpace.layers.widths[
            Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
          ],
          dropout: Math.random() * 0.3
        };
        break;
    }
    
    return config;
  }

  private estimateParams(layers: LayerConfig[]): number {
    // Simplified parameter estimation
    let totalParams = 0;
    
    for (const layer of layers) {
      switch (layer.type) {
        case 'conv2d':
          totalParams += (layer.kernelSize?.[0] || 3) * 
                        (layer.kernelSize?.[1] || 3) * 
                        (layer.filters || 32) * 32; // Assume input channels
          break;
        case 'dense':
          totalParams += (layer.units || 128) * 128; // Assume input size
          break;
        case 'lstm':
        case 'gru':
          totalParams += (layer.units || 128) * 4 * 128; // 4 gates
          break;
      }
    }
    
    return totalParams;
  }

  private estimateFLOPs(layers: LayerConfig[]): number {
    // Simplified FLOP estimation
    let totalFLOPs = 0;
    
    for (const layer of layers) {
      switch (layer.type) {
        case 'conv2d':
          totalFLOPs += (layer.filters || 32) * 28 * 28 * 9; // Assume 28x28 feature map
          break;
        case 'dense':
          totalFLOPs += (layer.units || 128) * 128 * 2; // Multiply-add
          break;
      }
    }
    
    return totalFLOPs;
  }

  // Architecture Evaluation
  private async evaluateArchitecture(architecture: Architecture): Promise<Architecture> {
    if (!this.dataset) {
      throw new Error('Dataset not loaded');
    }

    if (!this.tfService) {
      throw new Error('TensorFlow service not initialized');
    }

    return await globalMemoryManager.withMemoryManagement(
      async () => {
        console.log(`⚡ Evaluating architecture: ${architecture.id}`);
        const startTime = Date.now();

        try {
          // Check resource constraints
          if (!this.meetsResourceConstraints(architecture)) {
            console.log(`❌ Architecture ${architecture.id} violates resource constraints`);
            architecture.performance = {
              accuracy: 0,
              loss: Infinity,
              trainingTime: 0,
              inferenceLatency: Infinity,
              memoryUsage: Infinity
            };
            return architecture;
          }

          // Build TensorFlow model using memory-managed scope
          const model = await globalMemoryManager.createTensorScope(async () => {
            return await this.buildTensorFlowModel(architecture);
          });
          
          // Train model
          const history = await this.trainModel(model, architecture);
          
          // Evaluate performance
          const metrics = await this.evaluateModel(model, architecture);
          
          architecture.performance = {
            ...metrics,
            trainingTime: Date.now() - startTime,
            inferenceLatency: await this.measureInferenceLatency(model),
            memoryUsage: this.estimateMemoryUsage(architecture)
          };

          // Cleanup
          model.dispose();

          this.emit('architecture_evaluated', {
            architectureId: architecture.id,
            performance: architecture.performance,
            generation: architecture.generation
          });

          console.log(`✅ Architecture ${architecture.id} evaluated - Accuracy: ${architecture.performance.accuracy?.toFixed(4)}`);
          
          return architecture;
        } catch (error) {
          console.error(`❌ Error evaluating architecture ${architecture.id}:`, error);
          architecture.performance = {
            accuracy: 0,
            loss: Infinity,
            trainingTime: Date.now() - startTime,
            inferenceLatency: Infinity,
            memoryUsage: Infinity
          };
          return architecture;
        }
      },
      `evaluate-architecture-${architecture.id}`
    );
  }

  private meetsResourceConstraints(architecture: Architecture): boolean {
    const constraints = this.config.resourceConstraints;
    
    return architecture.totalParams <= constraints.maxParams &&
           architecture.flops <= constraints.maxFLOPs;
  }

  private async buildTensorFlowModel(architecture: Architecture): Promise<any> {
    if (!this.dataset) {
      throw new Error('Dataset not loaded');
    }

    if (!this.tfService) {
      throw new Error('TensorFlow service not initialized');
    }

    const tf = this.tfService.getTensorFlow();
    const model = tf.sequential();
    
    for (let i = 0; i < architecture.layers.length; i++) {
      const layer = architecture.layers[i];
      const isFirst = i === 0;
      
      switch (layer.type) {
        case 'conv2d':
          model.add(tf.layers.conv2d({
            filters: layer.filters || 32,
            kernelSize: layer.kernelSize || [3, 3],
            strides: layer.strides || [1, 1],
            padding: layer.padding as any || 'same',
            activation: layer.activation as any || 'relu',
            inputShape: isFirst ? this.dataset.inputShape : undefined
          }));
          if (layer.batchNorm) {
            model.add(tf.layers.batchNormalization());
          }
          break;
          
        case 'dense':
          if (isFirst) {
            model.add(tf.layers.flatten({ inputShape: this.dataset.inputShape }));
          }
          model.add(tf.layers.dense({
            units: layer.units || 128,
            activation: layer.activation as any || 'relu'
          }));
          if (layer.dropout && layer.dropout > 0) {
            model.add(tf.layers.dropout({ rate: layer.dropout }));
          }
          break;
          
        case 'lstm':
          model.add(tf.layers.lstm({
            units: layer.units || 64,
            returnSequences: i < architecture.layers.length - 1,
            dropout: layer.dropout || 0,
            inputShape: isFirst ? this.dataset.inputShape : undefined
          }));
          break;
      }
    }
    
    // Compile model
    model.compile({
      optimizer: architecture.optimizer,
      loss: this.dataset.type === 'classification' ? 'categoricalCrossentropy' : 'meanSquaredError',
      metrics: ['accuracy']
    });
    
    return model;
  }

  private async trainModel(
    model: tf.LayersModel, 
    architecture: Architecture
  ): Promise<tf.History> {
    if (!this.dataset) {
      throw new Error('Dataset not loaded');
    }

    return await model.fit(this.dataset.trainX, this.dataset.trainY, {
      epochs: 10, // Limited for NAS speed
      batchSize: architecture.batchSize,
      validationData: [this.dataset.validX, this.dataset.validY],
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.emit('training_progress', {
            architectureId: architecture.id,
            epoch: epoch + 1,
            loss: logs?.loss,
            accuracy: logs?.acc || logs?.accuracy,
            valLoss: logs?.val_loss,
            valAccuracy: logs?.val_acc || logs?.val_accuracy
          });
        }
      }
    });
  }

  private async evaluateModel(
    model: tf.LayersModel, 
    architecture: Architecture
  ): Promise<{ accuracy?: number; loss?: number }> {
    if (!this.dataset) {
      throw new Error('Dataset not loaded');
    }

    const evaluation = model.evaluate(this.dataset.validX, this.dataset.validY) as tf.Scalar[];
    const loss = await evaluation[0].data();
    const accuracy = evaluation.length > 1 ? await evaluation[1].data() : undefined;
    
    // Cleanup tensors
    evaluation.forEach(tensor => tensor.dispose());
    
    return {
      loss: loss[0],
      accuracy: accuracy ? accuracy[0] : undefined
    };
  }

  private async measureInferenceLatency(model: tf.LayersModel): Promise<number> {
    if (!this.dataset) return 0;
    
    // Create a single sample for timing
    const sampleInput = this.dataset.validX.slice([0, 0], [1, -1]);
    
    const iterations = 100;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const prediction = model.predict(sampleInput) as tf.Tensor;
      prediction.dispose();
    }
    
    const endTime = performance.now();
    const avgLatency = (endTime - startTime) / iterations;
    
    sampleInput.dispose();
    return avgLatency;
  }

  private estimateMemoryUsage(architecture: Architecture): number {
    // Simplified memory usage estimation in MB
    return (architecture.totalParams * 4) / (1024 * 1024); // 4 bytes per parameter
  }

  // Search Strategies
  private async evolutionarySearch(): Promise<SearchResult> {
    console.log('🧬 Starting Evolutionary Architecture Search');
    
    // Initialize population
    this.population = [];
    for (let i = 0; i < this.config.populationSize; i++) {
      this.population.push(this.generateRandomArchitecture());
    }
    
    for (this.currentGeneration = 0; this.currentGeneration < this.config.generations; this.currentGeneration++) {
      console.log(`🔄 Generation ${this.currentGeneration + 1}/${this.config.generations}`);
      
      // Evaluate population
      const evaluatedPopulation = await Promise.all(
        this.population.map(arch => this.evaluateArchitecture(arch))
      );
      
      // Sort by performance
      evaluatedPopulation.sort((a, b) => {
        const aPerf = this.getPerformanceMetric(a);
        const bPerf = this.getPerformanceMetric(b);
        return this.config.evaluationMetric === 'loss' ? aPerf - bPerf : bPerf - aPerf;
      });
      
      // Update best architecture
      if (!this.bestArchitecture || 
          this.getPerformanceMetric(evaluatedPopulation[0]) > this.getPerformanceMetric(this.bestArchitecture)) {
        this.bestArchitecture = { ...evaluatedPopulation[0] };
      }
      
      // Record generation statistics
      const performances = evaluatedPopulation.map(arch => this.getPerformanceMetric(arch));
      this.searchHistory.push({
        generation: this.currentGeneration,
        bestPerformance: Math.max(...performances),
        avgPerformance: performances.reduce((sum, p) => sum + p, 0) / performances.length,
        diversity: this.calculateDiversity(evaluatedPopulation)
      });
      
      this.emit('generation_complete', {
        generation: this.currentGeneration,
        bestPerformance: this.searchHistory[this.searchHistory.length - 1].bestPerformance,
        avgPerformance: this.searchHistory[this.searchHistory.length - 1].avgPerformance
      });
      
      // Create next generation
      if (this.currentGeneration < this.config.generations - 1) {
        this.population = await this.createNextGeneration(evaluatedPopulation);
      } else {
        this.population = evaluatedPopulation;
      }
    }
    
    return this.createSearchResult();
  }

  private async createNextGeneration(currentPopulation: Architecture[]): Promise<Architecture[]> {
    const nextGeneration: Architecture[] = [];
    
    // Keep top 20% (elitism)
    const eliteSize = Math.floor(this.config.populationSize * 0.2);
    nextGeneration.push(...currentPopulation.slice(0, eliteSize));
    
    // Generate remaining through crossover and mutation
    while (nextGeneration.length < this.config.populationSize) {
      // Tournament selection
      const parent1 = this.tournamentSelection(currentPopulation);
      const parent2 = this.tournamentSelection(currentPopulation);
      
      // Crossover
      const child = this.crossover(parent1, parent2);
      
      // Mutation
      this.mutate(child);
      
      child.generation = this.currentGeneration + 1;
      nextGeneration.push(child);
    }
    
    return nextGeneration;
  }

  private tournamentSelection(population: Architecture[], tournamentSize = 3): Architecture {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    
    return tournament.reduce((best, current) => {
      const bestPerf = this.getPerformanceMetric(best);
      const currentPerf = this.getPerformanceMetric(current);
      return (this.config.evaluationMetric === 'loss') ? 
        (currentPerf < bestPerf ? current : best) :
        (currentPerf > bestPerf ? current : best);
    });
  }

  private crossover(parent1: Architecture, parent2: Architecture): Architecture {
    const child = this.generateRandomArchitecture();
    
    // Mix layers from both parents
    const minLayers = Math.min(parent1.layers.length, parent2.layers.length);
    const crossoverPoint = Math.floor(Math.random() * minLayers);
    
    child.layers = [
      ...parent1.layers.slice(0, crossoverPoint),
      ...parent2.layers.slice(crossoverPoint)
    ];
    
    // Mix hyperparameters
    child.optimizer = Math.random() > 0.5 ? parent1.optimizer : parent2.optimizer;
    child.learningRate = Math.random() > 0.5 ? parent1.learningRate : parent2.learningRate;
    child.batchSize = Math.random() > 0.5 ? parent1.batchSize : parent2.batchSize;
    
    child.parentIds = [parent1.id, parent2.id];
    child.totalParams = this.estimateParams(child.layers);
    child.flops = this.estimateFLOPs(child.layers);
    
    return child;
  }

  private mutate(architecture: Architecture, mutationRate = 0.1): void {
    // Layer mutations
    architecture.layers.forEach(layer => {
      if (Math.random() < mutationRate) {
        switch (layer.type) {
          case 'conv2d':
            if (Math.random() > 0.5) {
              layer.filters = this.config.searchSpace.layers.widths[
                Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
              ];
            }
            break;
          case 'dense':
            if (Math.random() > 0.5) {
              layer.units = this.config.searchSpace.layers.widths[
                Math.floor(Math.random() * this.config.searchSpace.layers.widths.length)
              ];
            }
            break;
        }
      }
    });
    
    // Hyperparameter mutations
    if (Math.random() < mutationRate) {
      architecture.learningRate = this.config.searchSpace.learningRates[
        Math.floor(Math.random() * this.config.searchSpace.learningRates.length)
      ];
    }
    
    // Update estimates after mutation
    architecture.totalParams = this.estimateParams(architecture.layers);
    architecture.flops = this.estimateFLOPs(architecture.layers);
  }

  private getPerformanceMetric(architecture: Architecture): number {
    switch (this.config.evaluationMetric) {
      case 'accuracy':
        return architecture.performance.accuracy || 0;
      case 'loss':
        return architecture.performance.loss || Infinity;
      case 'f1':
        return architecture.performance.f1 || 0;
      case 'auc':
        return architecture.performance.auc || 0;
      default:
        return architecture.performance.accuracy || 0;
    }
  }

  private calculateDiversity(population: Architecture[]): number {
    // Simple diversity metric based on architecture differences
    let totalDifferences = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const arch1 = population[i];
        const arch2 = population[j];
        
        // Compare number of layers
        let differences = Math.abs(arch1.layers.length - arch2.layers.length);
        
        // Compare layer types
        const minLayers = Math.min(arch1.layers.length, arch2.layers.length);
        for (let k = 0; k < minLayers; k++) {
          if (arch1.layers[k].type !== arch2.layers[k].type) {
            differences++;
          }
        }
        
        totalDifferences += differences;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalDifferences / comparisons : 0;
  }

  private createSearchResult(): SearchResult {
    return {
      bestArchitecture: this.bestArchitecture!,
      allArchitectures: [...this.population],
      searchHistory: [...this.searchHistory],
      totalSearchTime: Date.now() - this.searchStartTime,
      evaluatedArchitectures: this.population.length * this.config.generations
    };
  }

  // Public API
  async search(): Promise<SearchResult> {
    if (!this.dataset) {
      throw new Error('Dataset must be loaded before starting search');
    }
    
    if (this.isSearching) {
      throw new Error('Search is already in progress');
    }
    
    this.isSearching = true;
    this.searchStartTime = Date.now();
    this.currentGeneration = 0;
    this.searchHistory = [];
    this.bestArchitecture = null;
    
    try {
      console.log('🚀 Starting Neural Architecture Search');
      this.emit('search_started', {
        strategy: this.config.searchStrategy,
        populationSize: this.config.populationSize,
        generations: this.config.generations
      });
      
      let result: SearchResult;
      
      switch (this.config.searchStrategy) {
        case 'evolutionary':
          result = await this.evolutionarySearch();
          break;
        case 'random':
          result = await this.randomSearch();
          break;
        default:
          throw new Error(`Search strategy ${this.config.searchStrategy} not implemented`);
      }
      
      this.emit('search_completed', result);
      console.log(`✅ Neural Architecture Search completed in ${result.totalSearchTime}ms`);
      
      return result;
    } catch (error) {
      this.emit('search_failed', error);
      throw error;
    } finally {
      this.isSearching = false;
    }
  }

  private async randomSearch(): Promise<SearchResult> {
    console.log('🎲 Starting Random Architecture Search');
    
    const allArchitectures: Architecture[] = [];
    const totalEvaluations = this.config.populationSize * this.config.generations;
    
    for (let i = 0; i < totalEvaluations; i++) {
      const architecture = this.generateRandomArchitecture();
      const evaluatedArch = await this.evaluateArchitecture(architecture);
      allArchitectures.push(evaluatedArch);
      
      if (!this.bestArchitecture || 
          this.getPerformanceMetric(evaluatedArch) > this.getPerformanceMetric(this.bestArchitecture)) {
        this.bestArchitecture = { ...evaluatedArch };
      }
      
      if (i % this.config.populationSize === 0) {
        const generation = Math.floor(i / this.config.populationSize);
        const genArchs = allArchitectures.slice(-this.config.populationSize);
        const performances = genArchs.map(arch => this.getPerformanceMetric(arch));
        
        this.searchHistory.push({
          generation,
          bestPerformance: Math.max(...performances),
          avgPerformance: performances.reduce((sum, p) => sum + p, 0) / performances.length,
          diversity: this.calculateDiversity(genArchs)
        });
        
        this.emit('generation_complete', {
          generation,
          bestPerformance: this.searchHistory[this.searchHistory.length - 1].bestPerformance,
          avgPerformance: this.searchHistory[this.searchHistory.length - 1].avgPerformance
        });
      }
    }
    
    this.population = allArchitectures.slice(-this.config.populationSize);
    return this.createSearchResult();
  }

  // Export best architecture
  async exportArchitecture(architecture: Architecture, format: 'json' | 'tensorflowjs' | 'onnx' = 'json'): Promise<any> {
    switch (format) {
      case 'json':
        return {
          architecture,
          metadata: {
            searchConfig: this.config,
            dataset: this.dataset ? {
              name: this.dataset.name,
              type: this.dataset.type,
              inputShape: this.dataset.inputShape,
              outputShape: this.dataset.outputShape
            } : null,
            exportedAt: new Date().toISOString()
          }
        };
      
      case 'tensorflowjs':
        if (!this.dataset) {
          throw new Error('Dataset required for TensorFlow.js export');
        }
        const model = await this.buildTensorFlowModel(architecture);
        return model.toJSON();
        
      default:
        throw new Error(`Export format ${format} not supported`);
    }
  }

  // Utility methods
  getSearchProgress(): { isSearching: boolean; currentGeneration: number; totalGenerations: number; bestPerformance?: number } {
    return {
      isSearching: this.isSearching,
      currentGeneration: this.currentGeneration,
      totalGenerations: this.config.generations,
      bestPerformance: this.bestArchitecture ? this.getPerformanceMetric(this.bestArchitecture) : undefined
    };
  }

  stopSearch(): void {
    if (this.isSearching) {
      this.isSearching = false;
      this.emit('search_stopped');
    }
  }
}