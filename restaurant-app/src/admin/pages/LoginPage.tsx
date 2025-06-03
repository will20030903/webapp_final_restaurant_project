import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if (username === 'root' && password === 'admin') {
      setError('');
      // TODO: Implement actual session/token management
      console.log('登入成功');
      navigate('/admin'); // Navigate to admin dashboard on successful mock login
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] bg-gray-200">
      <div className="p-10 bg-white shadow-lg rounded-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8">餐廳管理系統 登入</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-base font-medium text-gray-800">
              帳號
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-800">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
              required
            />
          </div>
          {error && <p className="text-red-500 text-base">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
