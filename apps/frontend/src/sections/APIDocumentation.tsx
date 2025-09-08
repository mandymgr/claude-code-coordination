import React from 'react';

interface APIDocumentationProps {
  isDarkTheme?: boolean;
  className?: string;
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({ className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">APIDocumentation</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Component content for APIDocumentation</p>
      </div>
    </div>
  );
};

export default APIDocumentation;
