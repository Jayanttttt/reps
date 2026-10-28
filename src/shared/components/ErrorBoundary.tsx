import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './index';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    // Clear potentially corrupted weekly plan or bad key if necessary
    try {
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  public handleClearStorage = () => {
    if (confirm('Clear local app cache to recover? (Your workout logs can be backed up)')) {
      window.localStorage.removeItem('reps_weekly_plan');
      this.setState({ hasError: false, error: null });
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-black/80 backdrop-blur-xl border border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Something went wrong</h2>
            <p className="text-xs text-slate-300 mt-1 mb-5">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="secondary" onClick={this.handleReset}>
                Reload Page
              </Button>
              <Button size="sm" variant="danger" onClick={this.handleClearStorage}>
                Reset Cache
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
