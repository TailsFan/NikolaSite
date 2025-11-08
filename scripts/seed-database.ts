
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMRocWE6993JLgDqEWEFLP05BVwAJGK5Y",
  authDomain: "nikolabd-6c381.firebaseapp.com",
  projectId: "nikolabd-6c381",
  storageBucket: "nikolabd-6c381.appspot.com",
  messagingSenderId: "854795784761",
  appId: "1:854795784761:web:34434cd20d0c70ad95f3e8",
  measurementId: "G-5WMXG0Z2RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Демонстрационные данные
const demoBooks = [
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
    {
        id: '2',
        title: 'Война и мир',
        author: 'Лев Толстой',
        price: 799,
        description: 'Эпический роман-эпопея Льва Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805-1812 годах.',
        image: 'https://images.unsplash.com/photo-1645363167490-0d3337a3f477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzU4MzU3MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Классическая литература',
        inStock: 8
    },
    {
        id: '3',
        title: 'Дюна',
        author: 'Фрэнк Герберт',
        price: 699,
        description: 'Научно-фантастический роман о пустынной планете Арракис и борьбе за контроль над ней. Один из величайших романов в жанре научной фантастики.',
        image: 'https://images.unsplash.com/photo-1612570328404-fc96e7ba6d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTgzMTQ0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Научная фантастика',
        inStock: 12
    },
    {
        id: '4',
        title: 'Девушка с татуировкой дракона',
        author: 'Стиг Ларссон',
        price: 549,
        description: 'Детективный триллер о журналисте и хакере, которые расследуют исчезновение девушки из богатой семьи.',
        image: 'https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rfGVufDF8fHx8MTc1ODMwNjM4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Детектив',
        inStock: 6
    },
    {
        id: '5',
        title: 'Гордость и предубеждение',
        author: 'Джейн Остин',
        price: 459,
        description: 'Роман о любви и браке в высшем обществе Англии начала XIX века. История Элизабет Беннет и мистера Дарси.',
        image: 'https://images.unsplash.com/photo-1486821416551-68a65ef4d618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbm92ZWwlMjBjb3ZlcnxlbnwxfHx8fDE3NTgzNDMxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Романтика',
        inStock: 10
    },
    {
        id: '6',
        title: 'Думай медленно... решай быстро',
        author: 'Даниэль Канеман',
        price: 649,
        description: 'Книга о том, как мы принимаем решения, от лауреата Нобелевской премии по экономике.',
        image: 'https://images.unsplash.com/photo-1641154748135-8032a61a3f80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NTgzMzg3NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        genre: 'Бизнес',
        inStock: 20
    }
];

const demoUsers = [
    { id: '1', email: 'admin@bookstore.com', name: 'Администратор', role: 'admin' },
    { id: '2', email: 'manager@bookstore.com', name: 'Менеджер', role: 'manager' },
    { id: '3', email: 'user@bookstore.com', name: 'Пользователь', role: 'user' }
];

async function seedDatabase() {
  console.log('Начало заполнения базы данных...');

  // Добавление книг
  console.log('Добавление книг...');
  for (const book of demoBooks) {
    try {
      await setDoc(doc(db, "books", book.id), book);
      console.log(`Книга "${book.title}" успешно добавлена.`);
    } catch (e) {
      console.error(`Ошибка при добавлении книги "${book.title}": `, e);
    }
  }

  // Добавление пользователей
  console.log('Добавление пользователей...');
  for (const user of demoUsers) {
    try {
      await setDoc(doc(db, "users", user.id), user);
      console.log(`Пользователь "${user.name}" успешно добавлен.`);
    } catch (e) {
      console.error(`Ошибка при добавлении пользователя "${user.name}": `, e);
    }
  }

  console.log('Заполнение базы данных завершено.');
}

seedDatabase().then(() => {
    console.log("Скрипт выполнен.");
    process.exit(0);
}).catch(error => {
    console.error("Произошла ошибка при выполнении скрипта:", error);
    process.exit(1);
});
