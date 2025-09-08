import React from 'react';

interface PerformanceMetricsProps {
  isDarkTheme?: boolean;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">PerformanceMetrics</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Component content for PerformanceMetrics</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
