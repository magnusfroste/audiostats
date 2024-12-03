'use client';

import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-100 rounded-lg p-6 m-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Något gick fel</h2>
          <p className="text-sm text-red-600">
            {this.state.error?.message || 'Ett oväntat fel uppstod'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            Ladda om sidan
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
