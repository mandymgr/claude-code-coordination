import express from 'express';
import { Web3Service } from '../services/blockchain/web3Service';

const router: express.Router = express.Router();

// Configuration for different networks
const blockchainConfig = {
  networks: {
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_API_KEY',
      chainId: 1,
      nativeSymbol: 'ETH',
      explorerUrl: 'https://etherscan.io',
      gasPrice: '20000000000' // 20 gwei
    },
    polygon: {
      rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      chainId: 137,
      nativeSymbol: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
      gasPrice: '30000000000' // 30 gwei
    },
    bsc: {
      rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
      chainId: 56,
      nativeSymbol: 'BNB',
      explorerUrl: 'https://bscscan.com'
    },
    arbitrum: {
      rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      nativeSymbol: 'ETH',
      explorerUrl: 'https://arbiscan.io'
    },
    optimism: {
      rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
      chainId: 10,
      nativeSymbol: 'ETH',
      explorerUrl: 'https://optimistic.etherscan.io'
    },
    sepolia: {
      rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_API_KEY',
      chainId: 11155111,
      nativeSymbol: 'SepoliaETH',
      explorerUrl: 'https://sepolia.etherscan.io'
    }
  },
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
  ipfs: {
    gateway: process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud',
    apiKey: process.env.IPFS_API_KEY
  }
};

const web3Service = new Web3Service(blockchainConfig);

// Initialize Web3 service
router.post('/initialize', async (req, res) => {
  try {
    await web3Service.initialize();
    return res.json({ success: true, message: 'Blockchain service initialized' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to initialize blockchain service', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Network Operations
router.get('/networks', async (req, res) => {
  try {
    const networks = web3Service.getAvailableNetworks();
    const networkStatuses = await Promise.allSettled(
      networks.map(async (network) => ({
        name: network,
        status: await web3Service.getNetworkStatus(network)
      }))
    );

    const results = networkStatuses.map((result, index) => ({
      name: networks[index],
      ...(result.status === 'fulfilled' ? result.value.status : { error: 'Failed to fetch status' })
    }));

    return res.json({ networks: results });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get networks', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/networks/:networkName/status', async (req, res) => {
  try {
    const { networkName } = req.params;
    const status = await web3Service.getNetworkStatus(networkName);
    return res.json({ network: networkName, status });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get network status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Wallet Operations
router.post('/wallet/create', async (req, res) => {
  try {
    const wallet = await web3Service.createWallet();
    return res.json({ wallet: { address: wallet.address, mnemonic: wallet.mnemonic } });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create wallet', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/wallet/import', async (req, res) => {
  try {
    const { privateKey } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ error: 'Private key is required' });
    }

    const address = await web3Service.importWallet(privateKey);
    return res.json({ address });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to import wallet', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/wallet/:address/balance', async (req, res) => {
  try {
    const { address } = req.params;
    const { network = 'ethereum', tokenAddress } = req.query;
    
    if (!web3Service.validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const balance = await web3Service.getBalance(
      address, 
      network as string, 
      tokenAddress as string
    );
    
    return res.json({ address, network, balance, tokenAddress: tokenAddress || 'native' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get balance', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Transaction Operations
router.post('/transactions/send', async (req, res) => {
  try {
    const { to, amount, network = 'ethereum', gasLimit, gasPrice } = req.body;
    
    if (!to || !amount) {
      return res.status(400).json({ error: 'To address and amount are required' });
    }

    if (!web3Service.validateAddress(to)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    const hash = await web3Service.sendTransaction(to, amount, network, gasLimit, gasPrice);
    return res.json({ transactionHash: hash, network });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to send transaction', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/transactions/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const transaction = web3Service.getTransactionStatus(hash);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json({ transaction });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get transaction', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { address, network } = req.query;
    
    if (address && network) {
      const transactions = await web3Service.getTransactionHistory(
        address as string, 
        network as string
      );
      return res.json({ transactions, address, network });
    } else {
      const transactions = web3Service.getAllTransactions();
      return res.json({ transactions });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get transactions', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Smart Contract Operations
router.post('/contracts/load', async (req, res) => {
  try {
    const { name, address, abi, network } = req.body;
    
    if (!name || !address || !abi) {
      return res.status(400).json({ error: 'Name, address, and ABI are required' });
    }

    if (!web3Service.validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    await web3Service.loadContract(name, address, abi, network);
    return res.json({ success: true, message: `Contract ${name} loaded successfully` });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load contract', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/contracts/:contractName/call', async (req, res) => {
  try {
    const { contractName } = req.params;
    const { method, params = [], options = {} } = req.body;
    
    if (!method) {
      return res.status(400).json({ error: 'Method name is required' });
    }

    const result = await web3Service.callContract(contractName, method, params, options);
    return res.json({ result, method, contractName });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to call contract', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// DeFi Operations
router.get('/defi/positions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!web3Service.validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const positions = await web3Service.getDefiPositions(address);
    return res.json({ address, positions });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get DeFi positions', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/defi/swap', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amountIn, minAmountOut, network = 'ethereum' } = req.body;
    
    if (!tokenIn || !tokenOut || !amountIn || !minAmountOut) {
      return res.status(400).json({ error: 'All swap parameters are required' });
    }

    const hash = await web3Service.swapTokens(tokenIn, tokenOut, amountIn, minAmountOut, network);
    return res.json({ transactionHash: hash, swap: { tokenIn, tokenOut, amountIn, minAmountOut } });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to perform token swap', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// NFT Operations
router.post('/nfts/mint', async (req, res) => {
  try {
    const { contractName, recipient, tokenURI, metadata } = req.body;
    
    if (!contractName || !recipient || !tokenURI) {
      return res.status(400).json({ error: 'Contract name, recipient, and token URI are required' });
    }

    if (!web3Service.validateAddress(recipient)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    const hash = await web3Service.mintNFT(contractName, recipient, tokenURI, metadata);
    return res.json({ transactionHash: hash, nft: { recipient, tokenURI, metadata } });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to mint NFT', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/nfts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { network = 'ethereum' } = req.query;
    
    if (!web3Service.validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const nfts = await web3Service.getNFTs(address, network as string);
    return res.json({ address, network, nfts });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get NFTs', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// IPFS Operations
router.post('/ipfs/upload', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const hash = await web3Service.uploadToIPFS(data);
    return res.json({ hash, gateway: blockchainConfig.ipfs.gateway });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to upload to IPFS', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/ipfs/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const data = await web3Service.getFromIPFS(hash);
    return res.json({ hash, data });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch from IPFS', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Utility Operations
router.post('/utils/validate-address', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const isValid = web3Service.validateAddress(address);
    return res.json({ address, isValid });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to validate address', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/utils/estimate-gas', async (req, res) => {
  try {
    const { to, data = '0x', value = '0', network = 'ethereum' } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'To address is required' });
    }

    const gasEstimate = await web3Service.getGasEstimate(to, data, value, network);
    return res.json({ gasEstimate, network });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to estimate gas', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Service status
router.get('/status', async (req, res) => {
  try {
    const isInitialized = web3Service.isInitialized();
    const networks = web3Service.getAvailableNetworks();
    const transactionCount = web3Service.getAllTransactions().length;
    
    res.json({
      isInitialized,
      networks,
      transactionCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get service status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;