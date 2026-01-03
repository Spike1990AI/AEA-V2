import React, { useState } from 'react';
import { CONFIG } from '../config';

export default function PINEntry({ role, onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const roleInfo = {
    alba: {
      emoji: '👧',
      name: 'Alba',
      color: 'from-purple-600 to-pink-600',
      expectedPin: CONFIG.ALBA_PIN,
      mode: 'learning',
    },
    parent: {
      emoji: '👨‍👩‍👧',
      name: 'Parent',
      color: 'from-blue-600 to-cyan-600',
      expectedPin: CONFIG.PARENT_PIN,
      mode: 'dashboard',
    },
  };

  const info = roleInfo[role];

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');

      // Auto-check when 4 digits entered
      if (newPin.length === 4) {
        checkPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const checkPin = (enteredPin) => {
    if (enteredPin === info.expectedPin) {
      // Correct PIN!
      onSuccess(info.mode);
    } else {
      // Wrong PIN
      setError('❌ Wrong PIN!');
      setTimeout(() => {
        setPin('');
        setError('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {info.name}
          </h2>
          <p className="text-gray-600">Enter your PIN</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                pin.length > i
                  ? `bg-gradient-to-r ${info.color} text-white border-transparent`
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {pin.length > i ? '●' : ''}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-600 font-bold mb-4">
            {error}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl p-6 text-2xl font-bold text-gray-800 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl p-6 text-xl font-bold text-gray-600 transition-colors"
          >
            ⌫
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl p-6 text-2xl font-bold text-gray-800 transition-colors"
          >
            0
          </button>
          <button
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl p-6 text-xl font-bold text-gray-600 transition-colors"
          >
            ↩
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          {role === 'alba' ? "Enter Alba's PIN" : "Enter Parent PIN"}
        </div>
      </div>
    </div>
  );
}
