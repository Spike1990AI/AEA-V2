import React from 'react';

export default function RoleSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Alba Education App
          </h1>
          <p className="text-gray-600 text-lg">Who are you?</p>
        </div>

        <div className="space-y-4">
          {/* Alba Button */}
          <button
            onClick={() => onSelect('alba')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <div className="text-5xl mb-2">👧</div>
            <div>I am Alba</div>
          </button>

          {/* Parent Button */}
          <button
            onClick={() => onSelect('parent')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <div className="text-5xl mb-2">👨‍👩‍👧</div>
            <div>I am a Parent</div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Version 2.0.0
        </div>
      </div>
    </div>
  );
}
