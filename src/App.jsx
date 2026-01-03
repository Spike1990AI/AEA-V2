import { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import PINEntry from './components/PINEntry';

function App() {
  const [step, setStep] = useState('select'); // 'select' | 'pin' | 'app'
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState(null);

  // Step 1: Role Selection
  if (step === 'select') {
    return (
      <RoleSelector
        onSelect={(role) => {
          setSelectedRole(role);
          setStep('pin');
        }}
      />
    );
  }

  // Step 2: PIN Entry
  if (step === 'pin') {
    return (
      <PINEntry
        role={selectedRole}
        onSuccess={(appMode) => {
          setMode(appMode);
          setStep('app');
        }}
        onBack={() => {
          setSelectedRole(null);
          setStep('select');
        }}
      />
    );
  }

  // Step 3: App Mode (Learning or Dashboard)
  if (step === 'app') {
    if (mode === 'learning') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">👧</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Learning Mode
            </h1>
            <p className="text-gray-600 mb-6">
              Alba's learning interface will go here
            </p>
            <button
              onClick={() => {
                setStep('select');
                setMode(null);
                setSelectedRole(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold text-gray-800"
            >
              Log Out
            </button>
          </div>
        </div>
      );
    }

    if (mode === 'dashboard') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">👨‍👩‍👧</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Parent Dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Parent dashboard will go here
            </p>
            <button
              onClick={() => {
                setStep('select');
                setMode(null);
                setSelectedRole(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold text-gray-800"
            >
              Log Out
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default App;
