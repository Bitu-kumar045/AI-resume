import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-8 shadow-xl">
        <span className="text-6xl font-black text-blue-500">404</span>
        <h1 className="text-2xl font-bold text-white mt-3 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-400 mb-6">
          The page or route you requested could not be located.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/30"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
