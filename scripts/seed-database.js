"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCMRocWE6993JLgDqEWEFLP05BVwAJGK5Y",
    authDomain: "nikolabd-6c381.firebaseapp.com",
    projectId: "nikolabd-6c381",
    storageBucket: "nikolabd-6c381.appspot.com",
    messagingSenderId: "854795784761",
    appId: "1:854795784761:web:34434cd20d0c70ad95f3e8",
    measurementId: "G-5WMXG0Z2RZ"
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_1.getFirestore)(app);
// Демонстрационные данные
var demoBooks = [
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
var demoUsers = [
    { id: '1', email: 'admin@bookstore.com', name: 'Администратор', role: 'admin' },
    { id: '2', email: 'manager@bookstore.com', name: 'Менеджер', role: 'manager' },
    { id: '3', email: 'user@bookstore.com', name: 'Пользователь', role: 'user' }
];
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, demoBooks_1, book, e_1, _a, demoUsers_1, user, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Начало заполнения базы данных...');
                    // Добавление книг
                    console.log('Добавление книг...');
                    _i = 0, demoBooks_1 = demoBooks;
                    _b.label = 1;
                case 1:
                    if (!(_i < demoBooks_1.length)) return [3 /*break*/, 6];
                    book = demoBooks_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "books", book.id), book)];
                case 3:
                    _b.sent();
                    console.log("\u041A\u043D\u0438\u0433\u0430 \"".concat(book.title, "\" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430."));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u043A\u043D\u0438\u0433\u0438 \"".concat(book.title, "\": "), e_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    // Добавление пользователей
                    console.log('Добавление пользователей...');
                    _a = 0, demoUsers_1 = demoUsers;
                    _b.label = 7;
                case 7:
                    if (!(_a < demoUsers_1.length)) return [3 /*break*/, 12];
                    user = demoUsers_1[_a];
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "users", user.id), user)];
                case 9:
                    _b.sent();
                    console.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \"".concat(user.name, "\" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D."));
                    return [3 /*break*/, 11];
                case 10:
                    e_2 = _b.sent();
                    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \"".concat(user.name, "\": "), e_2);
                    return [3 /*break*/, 11];
                case 11:
                    _a++;
                    return [3 /*break*/, 7];
                case 12:
                    console.log('Заполнение базы данных завершено.');
                    return [2 /*return*/];
            }
        });
    });
}
seedDatabase().then(function () {
    console.log("Скрипт выполнен.");
    process.exit(0);
}).catch(function (error) {
    console.error("Произошла ошибка при выполнении скрипта:", error);
    process.exit(1);
});
