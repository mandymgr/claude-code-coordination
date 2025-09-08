import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, WifiOff } from 'lucide-react';
import { getApiStatus } from '../services/api';

interface ApiStatusIndicatorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ 
  className = '', 
  showLabel = true,
  size = 'sm'
}) => {
  const [status, setStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');
  
  useEffect(() => {
    const checkStatus = () => {
      setStatus(getApiStatus());
    };
    
    // Check immediately
    checkStatus();
    
    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          label: 'API Online',
          description: 'Backend services are available'
        };
      case 'unavailable':
        return {
          icon: WifiOff,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          label: 'Mock Mode',
          description: 'Using demo data - backend offline'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          label: 'Checking...',
          description: 'Verifying backend availability'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  if (!showLabel) {
    return (
      <div className={`inline-flex items-center ${className}`} title={config.description}>
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full ${config.bgColor} ${className}`}>
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default ApiStatusIndicator;