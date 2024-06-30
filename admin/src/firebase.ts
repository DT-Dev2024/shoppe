import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBWFoGFye7LMScA9qxdq45ngOK5CH6TA38',
  authDomain: 'chatfirebase-91710.firebaseapp.com',
  databaseURL:
    'https://chatfirebase-91710-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chatfirebase-91710',
  storageBucket: 'chatfirebase-91710.appspot.com',
  messagingSenderId: '51282989735',
  appId: '1:51282989735:web:4acb695997cd112f170182',
  measurementId: 'G-SC06WW3W7F',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const firestoreDb = getFirestore(app);
