// IPFS Configuration and Service Integration
// This file contains configuration for various IPFS providers

export interface IPFSConfig {
  provider: 'pinata' | 'web3storage' | 'infura' | 'local';
  apiKey?: string;
  apiSecret?: string;
  gateway?: string;
}

export interface IPFSUploadResult {
  hash: string;
  name: string;
  size: number;
  url: string;
  timestamp: Date;
}

// Default configuration - replace with your actual IPFS provider credentials
export const IPFS_CONFIG: IPFSConfig = {
  provider: 'pinata', // Most popular choice for production apps
  apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || 'YOUR_PINATA_API_KEY',
  apiSecret: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || 'YOUR_PINATA_SECRET_KEY',
  gateway: 'https://gateway.pinata.cloud/ipfs/'
};

// Alternative configurations for different providers:

// For Web3.Storage (free tier available)
export const WEB3_STORAGE_CONFIG: IPFSConfig = {
  provider: 'web3storage',
  apiKey: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'YOUR_WEB3_STORAGE_TOKEN',
  gateway: 'https://w3s.link/ipfs/'
};

// For Infura IPFS
export const INFURA_CONFIG: IPFSConfig = {
  provider: 'infura',
  apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || 'YOUR_INFURA_PROJECT_ID',
  apiSecret: process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET || 'YOUR_INFURA_PROJECT_SECRET',
  gateway: 'https://ipfs.infura.io/ipfs/'
};

/**
 * Real IPFS Service Implementation
 * Replace the mock service with actual IPFS provider calls
 */
export class RealIPFSService {
  private config: IPFSConfig;

  constructor(config: IPFSConfig = IPFS_CONFIG) {
    this.config = config;
  }

  async uploadFile(file: File): Promise<IPFSUploadResult> {
    switch (this.config.provider) {
      case 'pinata':
        return this.uploadToPinata(file);
      case 'web3storage':
        return this.uploadToWeb3Storage(file);
      case 'infura':
        return this.uploadToInfura(file);
      default:
        throw new Error(`Unsupported IPFS provider: ${this.config.provider}`);
    }
  }

  private async uploadToPinata(file: File): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedBy: 'BlueMercantile',
        timestamp: new Date().toISOString(),
        fileType: file.type
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.config.apiKey!,
        'pinata_secret_api_key': this.config.apiSecret!,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      hash: result.IpfsHash,
      name: file.name,
      size: file.size,
      url: `${this.config.gateway}${result.IpfsHash}`,
      timestamp: new Date()
    };
  }

  private async uploadToWeb3Storage(file: File): Promise<IPFSUploadResult> {
    // Note: This requires the web3.storage package
    // Install with: npm install web3.storage
    
    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': file.type,
        'X-Name': file.name
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Web3.Storage upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      hash: result.cid,
      name: file.name,
      size: file.size,
      url: `${this.config.gateway}${result.cid}`,
      timestamp: new Date()
    };
  }

  private async uploadToInfura(file: File): Promise<IPFSUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const auth = btoa(`${this.config.apiKey}:${this.config.apiSecret}`);

    const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Infura upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      hash: result.Hash,
      name: file.name,
      size: file.size,
      url: `${this.config.gateway}${result.Hash}`,
      timestamp: new Date()
    };
  }

  getGatewayUrl(hash: string): string {
    return `${this.config.gateway}${hash}`;
  }
}

/**
 * Utility function to format IPFS hash for display
 */
export function formatIPFSHash(hash: string, maxLength: number = 16): string {
  if (hash.length <= maxLength) return hash;
  return `${hash.substring(0, maxLength/2)}...${hash.substring(hash.length - maxLength/2)}`;
}

/**
 * Utility function to validate IPFS hash format
 */
export function isValidIPFSHash(hash: string): boolean {
  // Basic validation for IPFS hash (CIDv0 and CIDv1)
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Regex = /^b[a-z2-7]{58}$/;
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
}

/**
 * Get file type icon based on file extension
 */
export function getFileTypeIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    case 'mp4':
    case 'avi':
    case 'mov': return '🎥';
    case 'mp3':
    case 'wav': return '🎵';
    default: return '📁';
  }
}