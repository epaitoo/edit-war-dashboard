import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }


    render() {
        if (this.state.hasError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. Please try refreshing the page.
                </p>
                
                {import.meta.env.MODE === 'development' && (
                <details className="text-left mb-6">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Dev Mode)
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {this.state.error?.toString()}
                    </pre>
                </details>
                )}
                
                <div className="flex gap-3 justify-center">
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Refresh Page
                </button>
                <Link
                    to="/"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                >
                    Go Home
                </Link>
                </div>
            </div>
            </div>
        );
        }
        return this.props.children;
    }
}