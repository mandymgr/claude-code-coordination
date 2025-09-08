import { EventEmitter } from 'events';

// Lazy load ethers.js only when needed
let ethers: typeof import('ethers') | null = null;

async function ensureEthers() {
  if (!ethers) {
    console.log('⛓️ Loading Ethers.js on-demand...');
    ethers = await import('ethers');
    console.log('✅ Ethers.js loaded successfully');
  }
  return ethers;
}

// Type aliases for better intellisense
type Contract = import('ethers').Contract;
type JsonRpcProvider = import('ethers').JsonRpcProvider;
type Wallet = import('ethers').Wallet;
type TransactionResponse = import('ethers').TransactionResponse;
type TransactionReceipt = import('ethers').TransactionReceipt;

interface BlockchainConfig {
  networks: {
    [key: string]: {
      rpcUrl: string;
      chainId: number;
      nativeSymbol: string;
      explorerUrl: string;
      gasPrice?: string;
      gasLimit?: number;
    };
  };
  privateKey?: string;
  walletAddress?: string;
  contracts?: {
    [name: string]: {
      address: string;
      abi: any[];
    };
  };
  ipfs?: {
    gateway: string;
    apiKey?: string;
  };
}

interface SmartContract {
  name: string;
  address: string;
  abi: any[];
  network: string;
  instance?: Contract;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
  external_url?: string;
}

interface DeFiPosition {
  protocol: string;
  position: string;
  token: string;
  amount: string;
  value: number;
  apr: number;
  network: string;
}

interface Web3Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  network: string;
  type: 'transfer' | 'contract' | 'defi' | 'nft';
}

export class Web3Service extends EventEmitter {
  private config: BlockchainConfig;
  private providers: Map<string, JsonRpcProvider> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private contracts: Map<string, SmartContract> = new Map();
  private transactions: Map<string, Web3Transaction> = new Map();
  private initialized = false;

  constructor(config: BlockchainConfig) {
    super();
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔗 Initializing Web3 Service...');

      // Initialize network providers
      for (const [networkName, networkConfig] of Object.entries(this.config.networks)) {
        const provider = new JsonRpcProvider(networkConfig.rpcUrl);
        this.providers.set(networkName, provider);

        // Initialize wallet for this network if private key is provided
        if (this.config.privateKey) {
          const wallet = new Wallet(this.config.privateKey, provider);
          this.wallets.set(networkName, wallet);
        }

        console.log(`✅ Connected to ${networkName} (Chain ID: ${networkConfig.chainId})`);
      }

      // Initialize smart contracts
      if (this.config.contracts) {
        for (const [contractName, contractConfig] of Object.entries(this.config.contracts)) {
          await this.loadContract(contractName, contractConfig.address, contractConfig.abi);
        }
      }

      this.initialized = true;
      this.emit('initialized');
      console.log('🚀 Web3 Service initialized successfully');

    } catch (error) {
      console.error('❌ Web3 Service initialization failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Network Operations
  async switchNetwork(networkName: string): Promise<void> {
    if (!this.providers.has(networkName)) {
      throw new Error(`Network ${networkName} not configured`);
    }

    this.emit('network_switched', { network: networkName });
  }

  async getNetworkStatus(networkName: string): Promise<{
    blockNumber: number;
    gasPrice: string;
    chainId: number;
    isConnected: boolean;
  }> {
    const provider = this.providers.get(networkName);
    if (!provider) {
      throw new Error(`Provider for ${networkName} not found`);
    }

    try {
      const [blockNumber, gasPrice, network] = await Promise.all([
        provider.getBlockNumber(),
        provider.getFeeData(),
        provider.getNetwork()
      ]);

      return {
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        chainId: Number(network.chainId),
        isConnected: true
      };
    } catch (error) {
      return {
        blockNumber: 0,
        gasPrice: '0',
        chainId: 0,
        isConnected: false
      };
    }
  }

  // Wallet Operations
  async createWallet(): Promise<{ address: string; privateKey: string; mnemonic: string }> {
    const wallet = Wallet.createRandom();
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || ''
    };
  }

  async importWallet(privateKey: string): Promise<string> {
    try {
      const wallet = new Wallet(privateKey);
      
      // Add to all networks
      for (const [networkName, provider] of this.providers) {
        const connectedWallet = wallet.connect(provider);
        this.wallets.set(networkName, connectedWallet);
      }

      this.emit('wallet_imported', { address: wallet.address });
      return wallet.address;
    } catch (error) {
      throw new Error(`Invalid private key: ${error}`);
    }
  }

  async getBalance(address: string, networkName: string, tokenAddress?: string): Promise<string> {
    const provider = this.providers.get(networkName);
    if (!provider) {
      throw new Error(`Provider for ${networkName} not found`);
    }

    try {
      if (tokenAddress) {
        // ERC-20 token balance
        const tokenContract = new Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );
        const balance = await tokenContract.balanceOf(address);
        return ethers.formatEther(balance);
      } else {
        // Native token balance
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
      }
    } catch (error) {
      console.error(`Error getting balance:`, error);
      return '0';
    }
  }

  // Transaction Operations
  async sendTransaction(
    to: string,
    amount: string,
    networkName: string,
    gasLimit?: number,
    gasPrice?: string
  ): Promise<string> {
    const wallet = this.wallets.get(networkName);
    if (!wallet) {
      throw new Error(`Wallet for ${networkName} not found`);
    }

    try {
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        gasLimit: gasLimit || 21000,
        gasPrice: gasPrice ? ethers.parseUnits(gasPrice, 'gwei') : undefined
      });

      // Store transaction
      const transaction: Web3Transaction = {
        hash: tx.hash,
        from: wallet.address,
        to,
        value: amount,
        gasUsed: 0,
        gasPrice: tx.gasPrice?.toString() || '0',
        status: 'pending',
        timestamp: Date.now(),
        network: networkName,
        type: 'transfer'
      };

      this.transactions.set(tx.hash, transaction);
      this.emit('transaction_sent', transaction);

      // Wait for confirmation
      this.waitForTransaction(tx.hash, networkName);

      return tx.hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  private async waitForTransaction(hash: string, networkName: string): Promise<void> {
    const provider = this.providers.get(networkName);
    if (!provider) return;

    try {
      const receipt = await provider.waitForTransaction(hash);
      const transaction = this.transactions.get(hash);
      
      if (transaction && receipt) {
        transaction.status = receipt.status === 1 ? 'confirmed' : 'failed';
        transaction.gasUsed = Number(receipt.gasUsed);
        this.transactions.set(hash, transaction);
        
        this.emit('transaction_confirmed', transaction);
      }
    } catch (error) {
      const transaction = this.transactions.get(hash);
      if (transaction) {
        transaction.status = 'failed';
        this.transactions.set(hash, transaction);
        this.emit('transaction_failed', transaction);
      }
    }
  }

  // Smart Contract Operations
  async loadContract(name: string, address: string, abi: any[], networkName?: string): Promise<void> {
    const network = networkName || Object.keys(this.config.networks)[0];
    const provider = this.providers.get(network);
    
    if (!provider) {
      throw new Error(`Provider for ${network} not found`);
    }

    const contract: SmartContract = {
      name,
      address,
      abi,
      network,
      instance: new Contract(address, abi, provider)
    };

    this.contracts.set(name, contract);
    this.emit('contract_loaded', { name, address, network });
  }

  async callContract(
    contractName: string,
    method: string,
    params: any[] = [],
    options: { value?: string; gasLimit?: number } = {}
  ): Promise<any> {
    const contract = this.contracts.get(contractName);
    if (!contract || !contract.instance) {
      throw new Error(`Contract ${contractName} not found`);
    }

    try {
      const wallet = this.wallets.get(contract.network);
      const contractWithSigner = wallet ? contract.instance.connect(wallet) : contract.instance;

      if (options.value || options.gasLimit) {
        // Write operation
        const tx = await contractWithSigner[method](...params, {
          value: options.value ? ethers.parseEther(options.value) : undefined,
          gasLimit: options.gasLimit
        });

        const transaction: Web3Transaction = {
          hash: tx.hash,
          from: wallet?.address || '',
          to: contract.address,
          value: options.value || '0',
          gasUsed: 0,
          gasPrice: tx.gasPrice?.toString() || '0',
          status: 'pending',
          timestamp: Date.now(),
          network: contract.network,
          type: 'contract'
        };

        this.transactions.set(tx.hash, transaction);
        this.emit('contract_transaction', transaction);

        return tx;
      } else {
        // Read operation
        return await contractWithSigner[method](...params);
      }
    } catch (error) {
      console.error(`Contract call failed:`, error);
      throw error;
    }
  }

  // DeFi Operations
  async getDefiPositions(address: string): Promise<DeFiPosition[]> {
    const positions: DeFiPosition[] = [];

    // This would integrate with various DeFi protocols
    // For now, return mock data structure
    try {
      // Example: Uniswap LP positions, Aave lending, etc.
      // This would be implemented with actual protocol integrations
      
      this.emit('defi_positions_updated', { address, positions });
      return positions;
    } catch (error) {
      console.error('Error fetching DeFi positions:', error);
      return [];
    }
  }

  async swapTokens(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: string,
    networkName: string
  ): Promise<string> {
    // This would integrate with DEXs like Uniswap, SushiSwap, etc.
    const wallet = this.wallets.get(networkName);
    if (!wallet) {
      throw new Error(`Wallet for ${networkName} not found`);
    }

    try {
      // Mock implementation - would use actual DEX router contracts
      const tx = await wallet.sendTransaction({
        to: '0x...', // DEX router address
        data: '0x...', // Encoded swap data
        gasLimit: 300000
      });

      const transaction: Web3Transaction = {
        hash: tx.hash,
        from: wallet.address,
        to: '0x...',
        value: '0',
        gasUsed: 0,
        gasPrice: tx.gasPrice?.toString() || '0',
        status: 'pending',
        timestamp: Date.now(),
        network: networkName,
        type: 'defi'
      };

      this.transactions.set(tx.hash, transaction);
      this.emit('token_swap', { tokenIn, tokenOut, amountIn, transaction });

      return tx.hash;
    } catch (error) {
      console.error('Token swap failed:', error);
      throw error;
    }
  }

  // NFT Operations
  async mintNFT(
    contractName: string,
    recipient: string,
    tokenURI: string,
    metadata: NFTMetadata
  ): Promise<string> {
    try {
      const tx = await this.callContract(
        contractName,
        'mint',
        [recipient, tokenURI],
        { gasLimit: 200000 }
      );

      this.emit('nft_minted', {
        contract: contractName,
        recipient,
        metadata,
        transaction: tx.hash
      });

      return tx.hash;
    } catch (error) {
      console.error('NFT minting failed:', error);
      throw error;
    }
  }

  async getNFTs(address: string, networkName: string): Promise<any[]> {
    // This would integrate with NFT marketplaces and indexers
    try {
      // Mock implementation - would use OpenSea API, Alchemy NFT API, etc.
      const nfts: any[] = [];
      
      this.emit('nfts_fetched', { address, nfts });
      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }

  // IPFS Operations
  async uploadToIPFS(data: any): Promise<string> {
    if (!this.config.ipfs) {
      throw new Error('IPFS not configured');
    }

    try {
      // Mock implementation - would use Pinata, Infura, or direct IPFS node
      const hash = `Qm${Math.random().toString(36).substring(2, 15)}`;
      
      this.emit('ipfs_uploaded', { hash, data });
      return hash;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
  }

  async getFromIPFS(hash: string): Promise<any> {
    if (!this.config.ipfs) {
      throw new Error('IPFS not configured');
    }

    try {
      const url = `${this.config.ipfs.gateway}/ipfs/${hash}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`IPFS fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.emit('ipfs_fetched', { hash, data });
      return data;
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw error;
    }
  }

  // Analytics and Monitoring
  async getTransactionHistory(address: string, networkName: string): Promise<Web3Transaction[]> {
    const provider = this.providers.get(networkName);
    if (!provider) {
      throw new Error(`Provider for ${networkName} not found`);
    }

    try {
      // This would fetch from blockchain explorer APIs
      const transactions = Array.from(this.transactions.values())
        .filter(tx => tx.from === address || tx.to === address)
        .filter(tx => tx.network === networkName);

      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  async getGasEstimate(
    to: string,
    data: string,
    value: string,
    networkName: string
  ): Promise<string> {
    const provider = this.providers.get(networkName);
    if (!provider) {
      throw new Error(`Provider for ${networkName} not found`);
    }

    try {
      const gasEstimate = await provider.estimateGas({
        to,
        data,
        value: ethers.parseEther(value)
      });

      return gasEstimate.toString();
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return '21000'; // Default gas limit
    }
  }

  // Security and Validation
  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  validatePrivateKey(privateKey: string): boolean {
    try {
      new Wallet(privateKey);
      return true;
    } catch {
      return false;
    }
  }

  // Utility Methods
  getTransactionStatus(hash: string): Web3Transaction | undefined {
    return this.transactions.get(hash);
  }

  getAllTransactions(): Web3Transaction[] {
    return Array.from(this.transactions.values());
  }

  getAvailableNetworks(): string[] {
    return Object.keys(this.config.networks);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async destroy(): Promise<void> {
    this.providers.clear();
    this.wallets.clear();
    this.contracts.clear();
    this.transactions.clear();
    this.initialized = false;
    this.emit('destroyed');
  }
}