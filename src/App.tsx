import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthGate } from './components/AuthGate';
import { LoginScreen } from './screens/LoginScreen';
import { AppLayout } from './components/AppLayout';
import { Notifications } from './components/Notifications';

function App() {
  return (
    <>
      <Notifications />
      <AuthGate>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthGate>
    </>
  );
}

export default App;
