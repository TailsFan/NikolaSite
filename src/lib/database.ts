
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

// Users
export const getUsers = async () => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const updateUser = async (userId, data) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, data);
};

export const addUser = async (data) => {
    const usersCol = collection(db, 'users');
    const docRef = await addDoc(usersCol, data);
    return docRef.id;
};

export const deleteUser = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
};

// Books
export const getBooks = async () => {
    const booksCol = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCol);
    return bookSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const updateBook = async (bookId, data) => {
    const bookDoc = doc(db, 'books', bookId);
    await updateDoc(bookDoc, data);
};

export const addBook = async (data) => {
    const booksCol = collection(db, 'books');
    const docRef = await addDoc(booksCol, data);
    return docRef.id;
};

export const deleteBook = async (bookId) => {
    const bookDoc = doc(db, 'books', bookId);
    await deleteDoc(bookDoc);
};
