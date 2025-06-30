// src/pages/Index.jsx
import React from 'react';
import TodoApp from '../components/TodoApp';
import Header from '../components/Header';

const Index = ({ user, onLogin, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onLogout={onLogout} />
      <TodoApp />
    </div>
  );
};

export default Index;
