
import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, User, BookOpen, Users, Bell } from './components/Icons';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import BookDetailsScreen from './components/BookDetailsScreen';
import CartScreen from './components/CartScreen';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import ProfileScreen from './components/ProfileScreen';
import EditProfileScreen from './components/EditProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import NotificationsScreen from './components/NotificationsScreen';
import Toast from './components/Toast';
import { auth, db } from './lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// --- Interfaces --- 
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  useEffect(() => {
    const demoBooks: Book[] = [
      {
        id: '1',
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        price: 599,
        description: 'Роман Михаила Булгакова, который считается одним из лучших произведений русской литературы XX века. История о дьяволе, посетившем советскую Москву.',
        image: 'https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4MzU4ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Классическая литература',
        inStock: 15
      },
    ];
    setBooks(demoBooks);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentUser({ id: docSnap.id, ...docSnap.data() } as User);
        showToast(`Добро пожаловать, ${docSnap.data().name}!`);
      } else {
        showToast('Не удалось найти данные пользователя.', 'error');
        await signOut(auth);
      }
    } catch (error) {
      showToast(String(error), 'error');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const newUser: User = { id: user.uid, email, name, role: 'user' };
      await setDoc(doc(db, "users", user.uid), newUser);
      showToast(`Аккаунт успешно создан! Теперь войдите в систему.`);
    } catch (error) {
      showToast(String(error), 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentScreen('home');
      setCart([]);
      showToast('Вы успешно вышли из системы.');
    } catch (error) {
      showToast(String(error), 'error');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLanguageChange = (newLanguage: 'ru' | 'en') => {
    setLanguage(newLanguage);
  };

  const hasAccessTo = (screen: Screen): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && screen !== 'admin') return true;
    if (currentUser.role === 'user' && !['admin', 'manager'].includes(screen)) return true;
    return screen === 'home' || screen === 'cart' || screen === 'profile' || screen === 'bookDetails' || screen === 'editProfile' || screen === 'settings' || screen === 'notifications';
  };

  const addToCart = (book: Book, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.id === book.id);
      if (existingItem) {
        showToast(`${book.title} добавлена в корзину (${existingItem.quantity + quantity} шт.)`);
        return prevCart.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToast(`${book.title} добавлена в корзину`);
      return [...prevCart, { book, quantity }];
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
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.book.id === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  const getCartItemsCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} showToast={showToast} />;
  }

  const renderScreen = () => {
    if (!hasAccessTo(currentScreen)) {
      setCurrentScreen('home');
      showToast('У вас нет доступа к этому разделу', 'error');
      return <HomeScreen books={books} onBookSelect={(book) => { setSelectedBook(book); setCurrentScreen('bookDetails'); }} onAddToCart={addToCart} userRole={currentUser.role} />;
    }
    switch (currentScreen) {
      case 'home':
        return <HomeScreen books={books} onBookSelect={(book) => { setSelectedBook(book); setCurrentScreen('bookDetails'); }} onAddToCart={addToCart} userRole={currentUser.role} />;
      case 'bookDetails':
        return selectedBook ? <BookDetailsScreen book={selectedBook} onBack={() => setCurrentScreen('home')} onAddToCart={addToCart} userRole={currentUser.role} /> : null;
      case 'cart':
        return <CartScreen cartItems={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} total={getCartTotal()} />;
      case 'admin':
        return <AdminPanel users={users} onUpdateUsers={setUsers} currentUser={currentUser} showToast={showToast} />;
      case 'manager':
        return <ManagerPanel books={books} onUpdateBooks={setBooks} currentUser={currentUser} showToast={showToast} />;
      case 'profile':
        return <ProfileScreen user={currentUser} onLogout={handleLogout} onEditProfile={() => setCurrentScreen('editProfile')} onSettings={() => setCurrentScreen('settings')} onNotifications={() => setCurrentScreen('notifications')} />;
      case 'editProfile':
        return <EditProfileScreen user={currentUser} onBack={() => setCurrentScreen('profile')} onSave={handleUpdateUser} showToast={showToast} />;
      case 'settings':
        return <SettingsScreen user={currentUser} onBack={() => setCurrentScreen('profile')} theme={theme} language={language} onThemeChange={handleThemeChange} onLanguageChange={handleLanguageChange} showToast={showToast} />;
      case 'notifications':
        return <NotificationsScreen user={currentUser} onBack={() => setCurrentScreen('profile')} language={language} />;
      default:
        return <HomeScreen books={books} onBookSelect={(book) => { setSelectedBook(book); setCurrentScreen('bookDetails'); }} onAddToCart={addToCart} userRole={currentUser.role} />;
    }
  };

  const getNavigationText = () => ({
    home: language === 'ru' ? 'Главная' : 'Home',
    cart: language === 'ru' ? 'Корзина' : 'Cart',
    admin: language === 'ru' ? 'Админ' : 'Admin',
    catalog: language === 'ru' ? 'Каталог' : 'Catalog',
    profile: language === 'ru' ? 'Профиль' : 'Profile',
    notifications: language === 'ru' ? 'Уведомления' : 'Notifications',
    settings: language === 'ru' ? 'Настройки' : 'Settings'
  });

  const navText = getNavigationText();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto border-x border-border">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
      <div className="flex-1 pb-16">
        {renderScreen()}
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
        <div className="flex justify-around items-center h-16 px-2">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'home' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
            <Home size={18} />
            <span className="text-xs mt-1">{navText.home}</span>
          </button>
          <button onClick={() => setCurrentScreen('cart')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors relative ${currentScreen === 'cart' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
            <ShoppingCart size={18} />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
            <span className="text-xs mt-1">{navText.cart}</span>
          </button>
          
          {currentUser.role === 'user' && (
            <button onClick={() => setCurrentScreen('notifications')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'notifications' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
              <Bell size={18} />
              <span className="text-xs mt-1">{navText.notifications}</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button onClick={() => setCurrentScreen('notifications')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'notifications' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
                <Bell size={18} />
                <span className="text-xs mt-1">{navText.notifications}</span>
              </button>
              <button onClick={() => setCurrentScreen('admin')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'admin' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
                <Users size={18} />
                <span className="text-xs mt-1">{navText.admin}</span>
              </button>
            </>
          )}
          {currentUser.role === 'manager' && (
             <>
              <button onClick={() => setCurrentScreen('notifications')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'notifications' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
                <Bell size={18} />
                <span className="text-xs mt-1">{navText.notifications}</span>
              </button>
              <button onClick={() => setCurrentScreen('manager')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'manager' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
                <BookOpen size={18} />
                <span className="text-xs mt-1">{navText.catalog}</span>
              </button>
            </>
          )}
          <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg transition-colors ${currentScreen === 'profile' || currentScreen === 'editProfile' || currentScreen === 'settings' ? 'bg-blue-100 text-blue-600' : 'text-muted-foreground'}`}>
            <User size={18} />
            <span className="text-xs mt-1">{navText.profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
