# IPFS Integration for BlueMercantile

## Overview

BlueMercantile now includes full IPFS (InterPlanetary File System) integration for decentralized file storage. This ensures that all uploaded documents (ownership certificates, plantation records, etc.) are stored on a distributed network, providing:

- **Immutability**: Files cannot be altered once uploaded
- **Decentralization**: No single point of failure
- **Permanent Storage**: Files remain accessible as long as they're pinned
- **Verification**: Cryptographic hashes ensure file integrity
- **Transparency**: Perfect for carbon credit verification systems

## Features

✅ **IPFS File Upload** - Drag & drop or click to upload  
✅ **Multiple Provider Support** - Pinata, Web3.Storage, Infura  
✅ **Progress Tracking** - Real-time upload progress  
✅ **File Validation** - Type and size checking  
✅ **Hash Display** - Show IPFS hash and gateway URLs  
✅ **Copy/Share Functions** - Easy sharing of IPFS links  
✅ **Admin Dashboard** - View IPFS details for all uploads  

## IPFS Providers Supported

### 1. Pinata (Recommended)
- **Best for**: Production applications
- **Free tier**: 1GB storage, 100GB bandwidth
- **Setup**: Get API keys from [pinata.cloud](https://pinata.cloud)

### 2. Web3.Storage
- **Best for**: Web3 projects  
- **Free tier**: Generous free storage
- **Setup**: Get token from [web3.storage](https://web3.storage)

### 3. Infura IPFS
- **Best for**: Enterprise applications
- **Setup**: Get project ID from [infura.io](https://infura.io)

## Setup Instructions

### Step 1: Choose an IPFS Provider

**For Pinata (Recommended):**
1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create a new API key with admin permissions
4. Save your API Key and API Secret

**For Web3.Storage:**
1. Sign up at [web3.storage](https://web3.storage)
2. Create a new API token
3. Save your token

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Pinata Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Web3.Storage Configuration (alternative)
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# Infura Configuration (alternative)
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id_here
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret_here
```

### Step 3: Switch from Mock to Real IPFS

In `/components/IPFSUploader.tsx`, replace the mock service:

```typescript
// Replace this import
import { IPFSService } from './IPFSUploader';

// With this
import { RealIPFSService } from '../utils/ipfs';

// And replace the upload call
const result = await new RealIPFSService().uploadFile(file);
```

### Step 4: Install Additional Dependencies (if needed)

For Web3.Storage:
```bash
npm install web3.storage
```

For enhanced IPFS features:
```bash
npm install ipfs-http-client
```

## How It Works

### File Upload Process

1. **User selects file** → File validation (type, size)
2. **Upload to IPFS** → File sent to chosen provider
3. **Receive IPFS hash** → Unique content identifier returned
4. **Store metadata** → Hash and details saved to application
5. **Display result** → User sees IPFS hash and gateway URL

### File Storage Structure

```json
{
  "hash": "QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
  "name": "farm_ownership_certificate.pdf",
  "size": 245760,
  "url": "https://gateway.pinata.cloud/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Gateway URLs

Files can be accessed through multiple IPFS gateways:

- **Pinata**: `https://gateway.pinata.cloud/ipfs/{hash}`
- **IPFS.io**: `https://ipfs.io/ipfs/{hash}`
- **Cloudflare**: `https://cloudflare-ipfs.com/ipfs/{hash}`
- **Dweb**: `https://dweb.link/ipfs/{hash}`

## Benefits for Carbon Credit Management

### 🌍 **Transparency**
- All documents publicly verifiable
- Immutable record of plantation certificates
- Audit trail for carbon credit verification

### 🔒 **Security**
- Cryptographic hash verification
- Decentralized storage prevents tampering
- No single point of failure

### 🌱 **Environmental Alignment**
- Decentralized storage supports sustainability goals
- Reduced reliance on centralized data centers
- Permanent preservation of environmental records

### 📊 **Compliance**
- Immutable records for regulatory compliance
- Timestamped uploads for audit purposes
- Verifiable document integrity

## Usage in BlueMercantile

### For Patrons (Farmers/NGOs)
- Upload ownership documents to IPFS
- Receive permanent IPFS hash for records
- Share verifiable documents with stakeholders

### For Admins
- View IPFS details for all uploaded documents
- Verify document integrity using IPFS hashes
- Access documents through multiple gateways

### For Credit Clients
- Verify authenticity of plantation documents
- Access immutable records of carbon projects
- Trust in decentralized verification system

## Advanced Features

### Custom Metadata
Files are uploaded with metadata:
```json
{
  "name": "farm_certificate.pdf",
  "keyvalues": {
    "uploadedBy": "BlueMercantile",
    "userType": "patron",
    "userId": "ptrn1001",
    "timestamp": "2024-01-15T10:30:00Z",
    "fileType": "application/pdf"
  }
}
```

### File Pinning
- Files are automatically pinned to ensure persistence
- Multiple pinning services can be used for redundancy
- Automatic renewal of pinning services

### Content Addressing
- Files identified by content, not location
- Same file = same hash (deduplication)
- Verifiable file integrity

## Troubleshooting

### Common Issues

**Upload fails with "CORS error":**
- Ensure your IPFS provider supports browser uploads
- Check API key permissions

**File not accessible through gateway:**
- Wait a few minutes for IPFS propagation
- Try alternative gateways
- Verify the hash is correct

**Large file upload timeout:**
- Increase timeout settings in provider config
- Consider file compression
- Use chunked uploads for large files

### Performance Tips

- **Optimize file sizes** before upload
- **Use PDF compression** for documents
- **Batch multiple files** when possible
- **Cache IPFS hashes** to avoid re-uploads

## Security Considerations

### File Privacy
- ⚠️ **All IPFS files are public by default**
- Consider encryption for sensitive documents
- Use private IPFS networks for confidential data

### Hash Verification
- Always verify file integrity using IPFS hash
- Store hashes securely in your database
- Implement hash validation in your application

### Access Control
- IPFS provides content addressing, not access control
- Implement application-level permissions
- Consider hybrid storage for sensitive data

## Future Enhancements

### Planned Features
- 🔄 **File versioning** with IPFS
- 🔐 **Encrypted uploads** for sensitive documents
- 📊 **IPFS analytics** and usage tracking
- 🌐 **Custom IPFS gateway** configuration
- 📱 **Mobile app** IPFS integration

### Integration Possibilities
- **Smart contracts** for automated verification
- **Blockchain integration** for immutable records
- **Decentralized identity** for user verification
- **Carbon token** minting with IPFS proofs

## Support

For issues with IPFS integration:
1. Check provider documentation
2. Verify API keys and permissions
3. Test with smaller files first
4. Monitor provider status pages

## Cost Considerations

### Free Tiers
- **Pinata**: 1GB storage, 100GB bandwidth/month
- **Web3.Storage**: Generous free tier
- **Infura**: 5GB storage, 100GB bandwidth/month

### Scaling Costs
- Storage costs typically $0.10-0.50 per GB/month
- Bandwidth costs vary by provider
- Consider usage patterns and growth projections

---

*This integration makes BlueMercantile a truly decentralized carbon credit platform, ensuring transparency, immutability, and trust in the carbon credit verification process.*