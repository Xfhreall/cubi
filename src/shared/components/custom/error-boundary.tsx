"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-2">
                Terjadi Kesalahan
              </h2>
              <p className="text-muted-foreground mb-4">
                Maaf, terjadi kesalahan yang tidak terduga.
              </p>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
