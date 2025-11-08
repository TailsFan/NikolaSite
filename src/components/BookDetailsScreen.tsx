import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Star, Package, User, Tag } from './Icons';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  image: string;
  genre: string;
  inStock: number;
}

interface BookDetailsScreenProps {
  book: Book;
  onBack: () => void;
  onAddToCart: (book: Book, quantity: number) => void;
  userRole: 'admin' | 'manager' | 'user';
}

export default function BookDetailsScreen({ book, onBack, onAddToCart, userRole }: BookDetailsScreenProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(book, quantity);
    // Можно добавить уведомление о добавлении в корзину
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Детали книги</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Изображение книги */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Основная информация */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-gray-600">
              <User size={16} className="mr-1" />
              <span className="text-sm">{book.author}</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Tag size={16} className="mr-1" />
              <span className="text-sm">{book.genre}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-green-600">{book.price} ₽</div>
            <div className="flex items-center text-gray-600">
              <Package size={16} className="mr-1" />
              <span className="text-sm">
                {book.inStock > 0 ? `В наличии: ${book.inStock}` : 'Нет в наличии'}
              </span>
            </div>
          </div>

          {/* Индикатор наличия */}
          <div className="mb-4">
            {book.inStock > 10 && (
              <div className="bg-green-100 text-green-800 text-sm px-3 py-2 rounded-lg inline-block">
                ✓ В наличии
              </div>
            )}
            {book.inStock <= 10 && book.inStock > 0 && (
              <div className="bg-orange-100 text-orange-800 text-sm px-3 py-2 rounded-lg inline-block">
                ⚠ Осталось мало
              </div>
            )}
            {book.inStock === 0 && (
              <div className="bg-red-100 text-red-800 text-sm px-3 py-2 rounded-lg inline-block">
                ✗ Нет в наличии
              </div>
            )}
          </div>

          {/* Рейтинг (демо) */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={16} className="fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600">4.8 (127 отзывов)</span>
          </div>
        </div>

        {/* Описание */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Описание</h3>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>

        {/* Дополнительная информация */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Дополнительная информация</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Автор:</span>
              <span className="text-gray-900">{book.author}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Жанр:</span>
              <span className="text-gray-900">{book.genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Формат:</span>
              <span className="text-gray-900">Печатная книга</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Язык:</span>
              <span className="text-gray-900">Русский</span>
            </div>
          </div>
        </div>

        {/* Кнопки действий для всех ролей */}
        {book.inStock > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">Количество:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(book.inStock, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Добавить в корзину • {(book.price * quantity).toLocaleString()} ₽</span>
            </button>
          </div>
        )}

        {/* Сообщение о недоступности */}
        {book.inStock === 0 && (
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-gray-600 mb-2">Книга временно недоступна</p>
            <button className="bg-gray-300 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed">
              Уведомить о поступлении
            </button>
          </div>
        )}
      </div>
    </div>
  );
}