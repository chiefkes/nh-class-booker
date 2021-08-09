import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyASG-jgd-snFVWFRSBlMuJM2qOHP1kUEBM",
  authDomain: "nuffield-health-class-booker.firebaseapp.com",
  projectId: "nuffield-health-class-booker",
  storageBucket: "nuffield-health-class-booker.appspot.com",
  messagingSenderId: "394308086863",
  appId: "1:394308086863:web:a7c20b14475264b1b4ce3a",
  measurementId: "G-X6C3LRDBQJ",
};
const fire = firebase.initializeApp(firebaseConfig);

export default fire;
