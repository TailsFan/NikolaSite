import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart, Plus } from './Icons';

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

interface HomeScreenProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  userRole: 'admin' | 'manager' | 'user';
}

export default function HomeScreen({ books, onBookSelect, onAddToCart, userRole }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  const genres = ['all', ...Array.from(new Set(books.map(book => book.genre)))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Книгоед</h1>
        
        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск книг..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Фильтр по жанрам */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="text-gray-500 flex-shrink-0" size={20} />
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre === 'all' ? 'Все' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Список книг */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentBooks.map(book => (
            <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => onBookSelect(book)}
                />
                {book.inStock <= 5 && book.inStock > 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Осталось {book.inStock}
                  </div>
                )}
                {book.inStock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Нет в наличии
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 
                  className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
                  onClick={() => onBookSelect(book)}
                >
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                <p className="text-xs text-blue-600 mb-2">{book.genre}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{book.price} ₽</span>
                  {book.inStock > 0 && (
                    <button
                      onClick={() => onAddToCart(book)}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Назад
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Далее
            </button>
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">Книги не найдены</p>
            <p className="text-sm text-gray-500">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}