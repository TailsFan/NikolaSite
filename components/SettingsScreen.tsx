import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon, Globe, Palette } from './Icons';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

interface SettingsScreenProps {
  user: User;
  onBack: () => void;
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLanguageChange: (language: 'ru' | 'en') => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function SettingsScreen({ 
  user, 
  onBack, 
  theme, 
  language, 
  onThemeChange, 
  onLanguageChange, 
  showToast 
}: SettingsScreenProps) {
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempLanguage, setTempLanguage] = useState(language);

  const handleSaveSettings = () => {
    const themeChanged = tempTheme !== theme;
    const languageChanged = tempLanguage !== language;

    if (themeChanged) {
      onThemeChange(tempTheme);
    }
    
    if (languageChanged) {
      onLanguageChange(tempLanguage);
    }

    if (themeChanged || languageChanged) {
      showToast('Настройки успешно сохранены!');
    }
  };

  const getThemeDisplayName = (themeValue: 'light' | 'dark') => {
    if (language === 'en') {
      return themeValue === 'light' ? 'Light' : 'Dark';
    }
    return themeValue === 'light' ? 'Светлая' : 'Тёмная';
  };

  const getLanguageDisplayName = (langValue: 'ru' | 'en') => {
    if (language === 'en') {
      return langValue === 'ru' ? 'Russian' : 'English';
    }
    return langValue === 'ru' ? 'Русский' : 'Английский';
  };

  const texts = {
    ru: {
      title: 'Настройки',
      appearance: 'Внешний вид',
      themeLabel: 'Тема',
      language: 'Язык',
      languageLabel: 'Язык интерфейса',
      save: 'Сохранить',
      cancel: 'Отмена',
      roleInfo: `Роль: ${user.role === 'admin' ? 'Администратор' : user.role === 'manager' ? 'Менеджер' : 'Пользователь'}`
    },
    en: {
      title: 'Settings',
      appearance: 'Appearance',
      themeLabel: 'Theme',
      language: 'Language',
      languageLabel: 'Interface Language',
      save: 'Save',
      cancel: 'Cancel',
      roleInfo: `Role: ${user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Manager' : 'User'}`
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">{t.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{t.roleInfo}</p>
        </div>

        {/* Настройки внешнего вида */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Palette size={20} className="text-gray-600" />
              <h2 className="font-semibold">{t.appearance}</h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Тема */}
            <div>
              <label className="block text-sm font-medium mb-3">{t.themeLabel}</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTempTheme('light')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    tempTheme === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Sun size={20} />
                  <span>{getThemeDisplayName('light')}</span>
                  {tempTheme === 'light' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setTempTheme('dark')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    tempTheme === 'dark'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Moon size={20} />
                  <span>{getThemeDisplayName('dark')}</span>
                  {tempTheme === 'dark' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Язык */}
            <div>
              <label className="block text-sm font-medium mb-3">{t.languageLabel}</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTempLanguage('ru')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    tempLanguage === 'ru'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Globe size={20} />
                  <span>{getLanguageDisplayName('ru')}</span>
                  {tempLanguage === 'ru' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setTempLanguage('en')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    tempLanguage === 'en'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Globe size={20} />
                  <span>{getLanguageDisplayName('en')}</span>
                  {tempLanguage === 'en' && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}