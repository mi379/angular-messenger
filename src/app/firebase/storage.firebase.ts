import { app } from './app.firebase'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

export const storage = getStorage(initializeApp({
  apiKey:'AIzaSyB1KmabzVdlP3Ggqhf9i6QAm6Z3W09ihUc',
  authDomain:'angular-messenger-88222.firebaseapp.com',
  projectId:'angular-messenger-88222',
  storageBucket:'angular-messenger-88222.appspot.com',
  messagingSenderId:'848611587001',
  appId:'1:848611587001:web:a686a8d95763342e0d7c68'
}))