import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { Upload, FileText, CheckCircle, ExternalLink, Copy } from 'lucide-react';

interface IPFSUploadResult {
  hash: string;
  name: string;
  size: number;
  url: string;
}

interface IPFSUploaderProps {
  onUploadComplete: (result: IPFSUploadResult) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  label?: string;
  required?: boolean;
}

// Mock IPFS service - replace with actual IPFS provider (Pinata, Web3.Storage, etc.)
class IPFSService {
  private static readonly MOCK_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
  
  static async uploadFile(file: File): Promise<IPFSUploadResult> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Generate mock IPFS hash (in real implementation, this comes from IPFS)
    const mockHash = this.generateMockHash();
    
    // In a real implementation, you would:
    // 1. Use Pinata SDK: const result = await pinata.pinFileToIPFS(file);
    // 2. Use Web3.Storage: const cid = await client.put([file]);
    // 3. Use Infura IPFS API
    
    return {
      hash: mockHash,
      name: file.name,
      size: file.size,
      url: `${this.MOCK_GATEWAY}${mockHash}`
    };
  }
  
  private static generateMockHash(): string {
    // Generate a realistic-looking IPFS hash (CIDv1)
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let hash = 'Qm';
    for (let i = 0; i < 44; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }
  
  static getGatewayUrl(hash: string): string {
    return `${this.MOCK_GATEWAY}${hash}`;
  }
}

export default function IPFSUploader({ 
  onUploadComplete, 
  acceptedTypes = '.pdf',
  maxSize = 10,
  label = 'Upload to IPFS',
  required = false 
}: IPFSUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<IPFSUploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (acceptedTypes && !acceptedTypes.split(',').some(type => 
      file.type.includes(type.replace('.', '')) || file.name.toLowerCase().endsWith(type)
    )) {
      toast.error(`Please upload a file of type: ${acceptedTypes}`);
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);

      const result = await IPFSService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResult(result);
      onUploadComplete(result);
      
      toast.success(`📁 File uploaded to IPFS successfully!`);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const resetUpload = () => {
    setUploadResult(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label} {required && '*'}</Label>
      
      {!uploadResult ? (
        <div className="space-y-4">
          <div
            className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-500'}`} />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedTypes.toUpperCase()} files only (MAX. {maxSize}MB)
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                🌐 Files will be stored on IPFS (decentralized storage)
              </p>
            </div>
            <Input
              type="file"
              accept={acceptedTypes}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading}
              required={required}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">📤 Uploading to IPFS...</span>
                <span className="text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-gray-500">
                ⏳ Uploading to decentralized network, this may take a moment...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">File uploaded to IPFS successfully!</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium">File:</span>
              <span className="text-gray-700">{uploadResult.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">IPFS Hash:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono break-all">
                {uploadResult.hash}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(uploadResult.hash)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Size:</span>
              <span className="text-gray-700">{(uploadResult.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(uploadResult.url, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View on IPFS
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(uploadResult.url)}
              className="flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy URL
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              className="text-blue-600"
            >
              Upload Different File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the service for use in other components
export { IPFSService };