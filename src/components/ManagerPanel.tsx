
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle, ImageIcon } from './Icons';
import { addBook, updateBook, deleteBook } from '../lib/database'; // Import database functions

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  image: string;
  genre: string;
  inStock: number;
  managerId?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

interface ManagerPanelProps {
  books: Book[];
  onUpdateBooks: (books: Book[]) => void;
  currentUser: User;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function ManagerPanel({ books, onUpdateBooks, currentUser, showToast }: ManagerPanelProps) {
  // Проверка прав доступа
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-red-600 mb-4">
            <Package size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600">У вас нет прав для доступа к этой панели</p>
        </div>
      </div>
    );
  }
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    image: '',
    genre: '',
    inStock: ''
  });

  const handleAddBook = async () => {
    if (newBook.title && newBook.author && newBook.price) {
      try {
        const newBookData = {
          title: newBook.title,
          author: newBook.author,
          price: parseFloat(newBook.price),
          description: newBook.description,
          image: newBook.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
          genre: newBook.genre,
          inStock: parseInt(newBook.inStock) || 0,
          managerId: currentUser.id
        };
        const newBookId = await addBook(newBookData);
        const bookWithId = { ...newBookData, id: newBookId };
        onUpdateBooks([...books, bookWithId]);
        setNewBook({
          title: '',
          author: '',
          price: '',
          description: '',
          image: '',
          genre: '',
          inStock: ''
        });
        setShowAddBookModal(false);
        showToast(`Книга "${newBook.title}" добавлена в каталог`);
      } catch (error) {
        showToast('Ошибка при добавлении книги', 'error');
        console.error("Error adding book: ", error);
      }
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handleUpdateBook = async () => {
    if (editingBook) {
      try {
        await updateBook(editingBook.id, {
          title: editingBook.title,
          author: editingBook.author,
          price: editingBook.price,
          description: editingBook.description,
          image: editingBook.image,
          genre: editingBook.genre,
          inStock: editingBook.inStock,
        });
        onUpdateBooks(books.map(b => b.id === editingBook.id ? editingBook : b));
        showToast(`Книга "${editingBook.title}" обновлена`);
        setEditingBook(null);
      } catch (error) {
        showToast('Ошибка при обновлении книги', 'error');
        console.error("Error updating book: ", error);
      }
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        await deleteBook(bookId);
        onUpdateBooks(books.filter(b => b.id !== bookId));
        showToast(`Книга "${bookToDelete?.title}" удалена из каталога`);
      } catch (error) {
        showToast('Ошибка при удалении книги', 'error');
        console.error("Error deleting book: ", error);
      }
    }
  };

  const getTotalBooks = () => books.length;
  const getLowStockBooks = () => books.filter(book => book.inStock <= 5 && book.inStock > 0).length;
  const getOutOfStockBooks = () => books.filter(book => book.inStock === 0).length;
  const getTotalValue = () => books.reduce((sum, book) => sum + (book.price * book.inStock), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Панель менеджера</h1>
            <p className="text-sm text-gray-600">Управление каталогом книг</p>
          </div>
          <button
            onClick={() => setShowAddBookModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Добавить книгу</span>
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего книг</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalBooks()}</p>
              </div>
              <Package size={32} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Стоимость склада</p>
                <p className="text-2xl font-bold text-green-600">{getTotalValue().toLocaleString()} ₽</p>
              </div>
              <TrendingUp size={32} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Заканчиваются</p>
                <p className="text-2xl font-bold text-orange-600">{getLowStockBooks()}</p>
              </div>
              <AlertTriangle size={32} className="text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Нет в наличии</p>
                <p className="text-2xl font-bold text-red-600">{getOutOfStockBooks()}</p>
              </div>
              <Package size={32} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Список книг */}
        <div className="space-y-3">
          {books.map(book => (
            <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex space-x-4">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                  <p className="text-sm text-blue-600 mb-2">{book.genre}</p>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-green-600">{book.price} ₽</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      book.inStock === 0 
                        ? 'bg-red-100 text-red-800' 
                        : book.inStock <= 5 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {book.inStock === 0 ? 'Нет в наличии' : `${book.inStock} шт.`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Каталог пуст</h3>
            <p className="text-gray-600 mb-4">Добавьте первую книгу в каталог</p>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Добавить книгу
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно добавления книги */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Добавить книгу</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите название книги"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Автор</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите автора"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Жанр</label>
                <input
                  type="text"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите жанр"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Количество</label>
                  <input
                    type="number"
                    value={newBook.inStock}
                    onChange={(e) => setNewBook({ ...newBook, inStock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Описание</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Описание книги"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">URL изображения</label>
                <input
                  type="url"
                  value={newBook.image}
                  onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Оставьте пустым для изображения по умолчанию</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddBook}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования книги */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Редактировать книгу</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Название</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Автор</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Жанр</label>
                <input
                  type="text"
                  value={editingBook.genre}
                  onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Количество</label>
                  <input
                    type="number"
                    value={editingBook.inStock}
                    onChange={(e) => setEditingBook({ ...editingBook, inStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Описание</label>
                <textarea
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">URL изображения</label>
                <input
                  type="url"
                  value={editingBook.image}
                  onChange={(e) => setEditingBook({ ...editingBook, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingBook(null)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateBook}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
