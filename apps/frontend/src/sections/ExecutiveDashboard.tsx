import React from 'react';

interface ExecutiveDashboardProps {
  isDarkTheme?: boolean;
  className?: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">Executive Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">System Health</h3>
          <div className="text-2xl text-green-600">98%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Active Sessions</h3>
          <div className="text-2xl text-blue-600">12</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Agents</h3>
          <div className="text-2xl text-purple-600">3</div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;