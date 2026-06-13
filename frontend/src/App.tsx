import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Trading } from './pages/Trading';
import { Portfolio } from './pages/Portfolio';
import { useStore } from './store/useStore';

function App() {
  const { isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/trading" /> : <Login />}
        />
        <Route
          path="/trading"
          element={isAuthenticated ? <Trading /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio"
          element={isAuthenticated ? <Portfolio /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
