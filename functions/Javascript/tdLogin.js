import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCRP0v9HrdAK09hN4Znn2dYOSd4aZm8T80",
    authDomain: "wholesale-delivery-app-5327f.firebaseapp.com",
    databaseURL: "https://wholesale-delivery-app-5327f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wholesale-delivery-app-5327f",
    storageBucket: "wholesale-delivery-app-5327f.appspot.com",
    messagingSenderId: "505301345310",
    appId: "1:505301345310:web:39090ed1bd798c91c63a0f",
    measurementId: "G-8LTQKYEJTE"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

submit.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;

  // Query the "truckDrivers" collection to find a matching phone number
  const driversRef = collection(db, "truckDrivers");
  const q = query(driversRef, where("phoneNumber", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert("Phone number not found in the truckDrivers collection");
    return;
  }

  // Attempt to sign in with the first matching phone number found
  signInWithEmailAndPassword(auth, querySnapshot.docs[0].data().email, pass)
    .then((userCredential) => {
      // Signed in successfully
      location.href = "userProduct.html";
      const user = userCredential.user;
      alert("Log-In Successful");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});