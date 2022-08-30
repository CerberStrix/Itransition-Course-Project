
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {

  apiKey: "AIzaSyCjNilwq-120capBQNLx3jnaSWBI4-2jA0",

  authDomain: "courseprojectitransition.firebaseapp.com",

  projectId: "courseprojectitransition",

  storageBucket: "courseprojectitransition.appspot.com",

  messagingSenderId: "820230561572",

  appId: "1:820230561572:web:bbbc0cdd3a16d36a461db1"

};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);