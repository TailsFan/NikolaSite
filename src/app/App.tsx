'use client';
import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, User, BookOpen, Users, Bell } from '@/components/Icons';
import AuthScreen from '@/components/AuthScreen';
import HomeScreen from '@/components/HomeScreen';
import BookDetailsScreen from '@/components/BookDetailsScreen';
import CartScreen from '@/components/CartScreen';
import AdminPanel from '@/components/AdminPanel';
import ManagerPanel from '@/components/ManagerPanel';
import ProfileScreen from '@/components/ProfileScreen';
import EditProfileScreen from '@/components/EditProfileScreen';
import SettingsScreen from '@/components/SettingsScreen';
import NotificationsScreen from '@/components/NotificationsScreen';
import Toast from '@/components/Toast';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

// --- ИНТЕРФЕЙСЫ ---
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

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

interface CartItem {
  book: Book;
  quantity: number;
}

type Screen = 'home' | 'cart' | 'profile' | 'bookDetails' | 'admin' | 'manager' | 'editProfile' | 'settings' | 'notifications';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  id: number;
}

export default function App() {
  // --- СОСТОЯНИЯ ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);

  // --- TOAST УВЕДОМЛЕНИЯ ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // --- ЭФФЕКТ ДЛЯ АУТЕНТИФИКАЦИИ ---
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setFirebaseError(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
        } else {
          const newUser: User = {
            id: user.uid, email: user.email!, name: user.displayName || user.email!.split('@')[0], role: 'user'
          };
          await setDoc(userDocRef, newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
        setUsers([]); // Очищаем список пользователей при выходе
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Пустой массив зависимостей, чтобы запустить только один раз

  // --- ЭФФЕКТ ДЛЯ ЗАГРУЗКИ ДАННЫХ ---
  useEffect(() => {
    const fetchInitialData = async () => {
        if (!db) return;
        try {
            setLoading(true);
            // Загружаем книги для всех пользователей
            const booksCollection = collection(db, 'books');
            const booksSnapshot = await getDocs(booksCollection);
            const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
            setBooks(booksList);

            // Загружаем пользователей ТОЛЬКО если текущий пользователь - админ
            if (currentUser && currentUser.role === 'admin') {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersList);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных: ", error);
            showToast('Ошибка загрузки данных', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Запускаем загрузку данных, когда пользователь вошел в систему
    if (currentUser) {
        fetchInitialData();
    }
  }, [currentUser]); // Зависимость от currentUser


  // --- АУТЕНТИФИКАЦИЯ ---
  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Вход выполнен успешно!');
    } catch (error: any) {
      showToast('Неверный email или пароль.', 'error');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const newUser: User = { id: user.uid, email, name, role: 'user' };
      await setDoc(doc(db, 'users', user.uid), newUser);
      showToast(`Аккаунт создан! Теперь войдите.`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        showToast('Этот email уже используется.', 'error');
      } else {
        showToast('Ошибка при регистрации.', 'error');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    // Состояния будут сброшены автоматически благодаря useEffect
    setCurrentScreen('home');
    setCart([]);
  };

  // --- КОРЗИНА ---
  const addToCart = (book: Book, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.id === book.id);
      if (existingItem) {
        showToast(`${book.title} добавлена в корзину (${existingItem.quantity + quantity} шт.)`);
        return prevCart.map(item => item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        showToast(`${book.title} добавлена в корзину`);
        return [...prevCart, { book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    const removedItem = cart.find(item => item.book.id === bookId);
    if (removedItem) {
      showToast(`${removedItem.book.title} удалена из корзины`);
    }
    setCart(prevCart => prevCart.filter(item => item.book.id !== bookId));
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(bookId);
    } else {
      setCart(prevCart => prevCart.map(item => item.book.id === bookId ? { ...item, quantity } : item));
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  const getCartItemsCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  
  // --- НАСТРОЙКИ и ПРОФИЛЬ ---
  const handleUpdateUser = (updatedUser: User) => {
    // Обновление в Firebase
    const userDocRef = doc(db, 'users', updatedUser.id);
    setDoc(userDocRef, updatedUser, { merge: true });
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLanguageChange = (newLanguage: 'ru' | 'en') => setLanguage(newLanguage);

  // --- ЛОГИКА РЕНДЕРИНГА ---
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Загрузка...</p></div>;
  }

  if (firebaseError) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка Конфигурации Firebase</h1>
            <p className="mb-2">Приложение не может подключиться к Firebase.</p>
            <p>Убедитесь, что вы правильно заполнили учетные данные в <code>src/lib/firebase.ts</code>.</p>
        </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} showToast={showToast} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen books={books} onBookSelect={(book) => { setSelectedBook(book); setCurrentScreen('bookDetails'); }} onAddToCart={addToCart} userRole={currentUser.role} />;
      case 'bookDetails': return selectedBook ? <BookDetailsScreen book={selectedBook} onBack={() => setCurrentScreen('home')} onAddToCart={addToCart} userRole={currentUser.role} /> : null;
      case 'cart': return <CartScreen cartItems={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} total={getCartTotal()} />;
      case 'admin': return currentUser.role === 'admin' ? <AdminPanel users={users} onUpdateUsers={setUsers} currentUser={currentUser} showToast={showToast} /> : null;
      case 'manager': return (currentUser.role === 'admin' || currentUser.role === 'manager') ? <ManagerPanel books={books} onUpdateBooks={setBooks} currentUser={currentUser} showToast={showToast} /> : null;
      case 'profile': return <ProfileScreen user={currentUser} onLogout={handleLogout} onEditProfile={() => setCurrentScreen('editProfile')} onSettings={() => setCurrentScreen('settings')} onNotifications={() => setCurrentScreen('notifications')} />;
      case 'editProfile': return <EditProfileScreen user={currentUser} onBack={() => setCurrentScreen('profile')} onSave={handleUpdateUser} showToast={showToast} />;
      case 'settings': return <SettingsScreen user={currentUser} onBack={() => setCurrentScreen('profile')} theme={theme} language={language} onThemeChange={handleThemeChange} onLanguageChange={handleLanguageChange} showToast={showToast} />;
      case 'notifications': return <NotificationsScreen user={currentUser} onBack={() => setCurrentScreen('profile')} language={language} />;
      default: setCurrentScreen('home'); return null;
    }
  };

  const navText = { home: 'Главная', cart: 'Корзина', admin: 'Админ', catalog: 'Каталог', profile: 'Профиль', notifications: 'Уведомления' };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border pt-safe-top pb-safe-bottom">
      {toasts.map((toast) => <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />)}
      
      <div className="flex-1 pb-16">{renderScreen()}</div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border pb-safe-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg ${currentScreen === 'home' ? 'text-blue-600' : 'text-muted-foreground'}`}><Home size={18} /><span className="text-xs mt-1">{navText.home}</span></button>
          <button onClick={() => setCurrentScreen('cart')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg relative ${currentScreen === 'cart' ? 'text-blue-600' : 'text-muted-foreground'}`}><ShoppingCart size={18} />{getCartItemsCount() > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{getCartItemsCount()}</span>}<span className="text-xs mt-1">{navText.cart}</span></button>
          <button onClick={() => setCurrentScreen('notifications')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg ${currentScreen === 'notifications' ? 'text-blue-600' : 'text-muted-foreground'}`}><Bell size={18} /><span className="text-xs mt-1">{navText.notifications}</span></button>
          {currentUser.role === 'admin' && <button onClick={() => setCurrentScreen('admin')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg ${currentScreen === 'admin' ? 'text-blue-600' : 'text-muted-foreground'}`}><Users size={18} /><span className="text-xs mt-1">{navText.admin}</span></button>}
          {(currentUser.role === 'admin' || currentUser.role === 'manager') && <button onClick={() => setCurrentScreen('manager')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg ${currentScreen === 'manager' ? 'text-blue-600' : 'text-muted-foreground'}`}><BookOpen size={18} /><span className="text-xs mt-1">{navText.catalog}</span></button>}
          <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg ${['profile', 'editProfile', 'settings'].includes(currentScreen) ? 'text-blue-600' : 'text-muted-foreground'}`}><User size={18} /><span className="text-xs mt-1">{navText.profile}</span></button>
        </div>
      </div>
    </div>
  );
}
