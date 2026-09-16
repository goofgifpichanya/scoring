import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-slate-900 border border-red-500/50 rounded-2xl text-red-400 font-sans space-y-4">
          <h2 className="text-xl font-bold">เกิดข้อผิดพลาดในการโหลดระบบ (Application Error)</h2>
          <p className="text-sm text-slate-300">พบข้อผิดพลาดที่ไม่คาดคิดในการแสดงผล:</p>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs text-rose-300 overflow-x-auto border border-slate-800">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            รีเซ็ตแคชและโหลดหน้าเว็บใหม่
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
