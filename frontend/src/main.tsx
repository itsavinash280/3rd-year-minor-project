import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Global Error Caught]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-white">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-agro-100 dark:bg-agro-950 text-agro-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              🌾
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              AsraVerse AI Platform
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The application encountered a reload event. Click below to continue to the main dashboard.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full py-3 px-4 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs transition shadow-lg shadow-agro-600/20 active:scale-95"
            >
              Continue to Login & Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
