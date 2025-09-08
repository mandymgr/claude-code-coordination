import React from 'react';

interface CollaborationDashboardProps {
  isDarkTheme?: boolean;
  className?: string;
}

const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({ className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">Collaboration Dashboard</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Active Collaborations</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Project Alpha - Claude + GPT-4</span>
              <span className="text-green-600 text-sm">Active</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Bug Fix Task - Gemini</span>
              <span className="text-yellow-600 text-sm">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDashboard;