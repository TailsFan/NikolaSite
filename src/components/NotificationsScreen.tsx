import React from 'react';
import { ArrowLeft, Construction, Settings } from './Icons';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

interface NotificationsScreenProps {
  user: User;
  onBack: () => void;
  language: 'ru' | 'en';
}

export default function NotificationsScreen({ user, onBack, language }: NotificationsScreenProps) {
  const texts = {
    ru: {
      title: 'Уведомления',
      inDevelopment: 'В разработке',
      description: 'Функция уведомлений находится в разработке и будет доступна в следующих обновлениях.',
      features: [
        'Уведомления о новых поступлениях книг',
        'Персональные рекомендации',
        'Статус заказов',
        'Специальные предложения и скидки'
      ],
      comingSoon: 'Скоро в приложении!'
    },
    en: {
      title: 'Notifications',
      inDevelopment: 'In Development',
      description: 'The notifications feature is under development and will be available in upcoming updates.',
      features: [
        'New book arrivals notifications',
        'Personal recommendations',
        'Order status updates',
        'Special offers and discounts'
      ],
      comingSoon: 'Coming soon to the app!'
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

      <div className="p-4">
        {/* Главная карточка "В разработке" */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction size={32} className="text-orange-600" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2 text-gray-900">{t.inDevelopment}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{t.description}</p>

          {/* Планируемые функции */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3 text-gray-900">{t.comingSoon}</h3>
            <div className="space-y-2">
              {t.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Информация о пользователе */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              {language === 'ru' 
                ? `Пользователь: ${user.name} (${user.role === 'admin' ? 'Администратор' : user.role === 'manager' ? 'Менеджер' : 'Пользователь'})`
                : `User: ${user.name} (${user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Manager' : 'User'})`
              }
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                {language === 'ru' ? 'Настройки уведомлений' : 'Notification Settings'}
              </p>
              <p className="text-sm text-blue-700">
                {language === 'ru' 
                  ? 'После выхода этой функции вы сможете настроить типы уведомлений в разделе настроек.'
                  : 'Once this feature is released, you will be able to configure notification types in the settings section.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}