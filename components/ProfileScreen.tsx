import React from 'react';
import { LogOut, User, Mail, Shield, Crown, Settings, ChevronRight, Bell } from './Icons';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
}

export default function ProfileScreen({ user, onLogout, onEditProfile, onSettings, onNotifications }: ProfileScreenProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={20} className="text-purple-600" />;
      case 'manager': return <Shield size={20} className="text-blue-600" />;
      default: return <User size={20} className="text-gray-600" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      default: return 'Пользователь';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const menuItems = [
    { icon: User, label: 'Редактировать профиль', action: () => onEditProfile?.() },
    { icon: Settings, label: 'Настройки', action: () => onSettings?.() },
    { icon: Bell, label: 'Уведомления', action: () => onNotifications?.() }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок */}
      <div className="bg-card shadow-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Профиль</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Информация о пользователе */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getRoleColor(user.role)}`}>
                <div className="flex items-center space-x-1">
                  {getRoleIcon(user.role)}
                  <span>{getRoleName(user.role)}</span>
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Статистика */}
        {true && (
          <div className="bg-card rounded-xl shadow-sm border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4">Моя статистика</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">Заказов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0 ₽</div>
                <div className="text-sm text-muted-foreground">Потрачено</div>
              </div>
            </div>
          </div>
        )}

        {/* Меню */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className="text-muted-foreground" />
                <span className="text-foreground">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Информация о приложении */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">О приложении</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Версия:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Разработчик:</span>
              <span>Книгоед Team</span>
            </div>
            <div className="flex justify-between">
              <span>Поддержка:</span>
              <span>support@knigoyed.com</span>
            </div>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Выйти из аккаунта</span>
        </button>

        {/* Отступ для нижней навигации */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}