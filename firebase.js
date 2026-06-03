import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyAS4CZNSiKR2OkaIpZIqmGUmalUC-n1uNM",
  authDomain: "futsabadao-5513f.firebaseapp.com",
  databaseURL: "https://futsabadao-5513f-default-rtdb.firebaseio.com",
  projectId: "futsabadao-5513f",
  storageBucket: "futsabadao-5513f.firebasestorage.app",
  messagingSenderId: "788110524409",
  appId: "1:788110524409:web:8c0284c7637cce29258728"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
