import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from './Icons';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
}

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  total: number;
}

export default function CartScreen({ cartItems, onUpdateQuantity, onRemoveItem, total }: CartScreenProps) {
  const handleCheckout = () => {
    // В реальном приложении здесь была бы интеграция с платежной системой
    alert('Функция оформления заказа будет доступна в полной версии приложения');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Корзина пуста</h2>
          <p className="text-gray-600 mb-6">Добавьте книги в корзину, чтобы оформить заказ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">Корзина</h1>
        <p className="text-sm text-gray-600">{cartItems.length} товар(ов)</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Товары в корзине */}
        {cartItems.map(item => (
          <div key={item.book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex space-x-4">
              <img
                src={item.book.image}
                alt={item.book.title}
                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                <p className="font-medium text-green-600">{item.book.price} ₽</p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => onRemoveItem(item.book.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.book.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Итого за товар:</span>
                <span className="font-semibold text-gray-900">
                  {(item.book.price * item.quantity).toLocaleString()} ₽
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Итоговая информация */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Сумма заказа</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
              <span>{total.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Доставка:</span>
              <span className="text-green-600">Бесплатно</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Итого:</span>
                <span className="text-green-600">{total.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard size={20} />
            <span>Оформить заказ</span>
          </button>
        </div>

        {/* Информация о доставке */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-2">Информация о доставке</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Бесплатная доставка при заказе от 500 ₽</p>
            <p>• Доставка по Москве: 1-2 дня</p>
            <p>• Доставка по России: 3-7 дней</p>
            <p>• Самовывоз из магазина: сегодня</p>
          </div>
        </div>
      </div>
    </div>
  );
}