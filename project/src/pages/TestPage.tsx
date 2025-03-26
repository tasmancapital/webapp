import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Test Page</h1>
        <p className="mb-4">This is a test page to verify routing is working correctly.</p>
        <div className="flex flex-col gap-4">
          <a 
            href="/" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </a>
          <a 
            href="/login" 
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
