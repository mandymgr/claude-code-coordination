import React from 'react';

interface AIAgentManagementProps {
  isDarkTheme?: boolean;
  className?: string;
}

const AIAgentManagement: React.FC<AIAgentManagementProps> = ({ className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">AI Agent Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Claude</h3>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <p className="text-sm text-gray-600">Frontend, Documentation</p>
          <div className="mt-2 text-sm">Load: 45%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">GPT-4</h3>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <p className="text-sm text-gray-600">Backend, Complex Logic</p>
          <div className="mt-2 text-sm">Load: 67%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Gemini</h3>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          </div>
          <p className="text-sm text-gray-600">DevOps, Optimization</p>
          <div className="mt-2 text-sm">Load: 23%</div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentManagement;