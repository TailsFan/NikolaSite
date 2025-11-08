import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff } from './Icons';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function AuthScreen({ onLogin, onRegister, showToast }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      if (!name.trim()) {
        showToast('Пожалуйста, введите ваше имя', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Пароль должен содержать минимум 6 символов', 'error');
        return;
      }
      onRegister(email, password, name);
      // Очищаем форму после успешной регистрации
      setEmail('');
      setPassword('');
      setName('');
      setIsLogin(true); // Переключаемся на вкладку входа
    }
  };

  const demoAccounts = [
    { email: 'admin@bookstore.com', password: 'admin123', role: 'Администратор' },
    { email: 'manager@bookstore.com', password: 'manager123', role: 'Менеджер' },
    { email: 'user@bookstore.com', password: 'user123', role: 'Пользователь' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <BookOpen className="text-blue-600" size={32} />
          </div>
          <h1 className="text-white text-2xl font-bold">Книгоед</h1>
          <p className="text-blue-100 text-sm">Ваш любимый книжный магазин</p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isLogin ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                !isLogin ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите ваше имя"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="Введите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>

        {/* Демо аккаунты */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white text-sm font-medium mb-3">Демо аккаунты:</h3>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                  setIsLogin(true);
                }}
                className="w-full text-left text-xs text-blue-100 bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
              >
                <div className="font-medium">{account.role}</div>
                <div>{account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}