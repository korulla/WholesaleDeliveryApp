import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
        
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

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth();
        const db = getFirestore();

        submit.addEventListener('click', (e) => {
          e.preventDefault();
          var email1 = document.getElementById('email').value;
          var pass = document.getElementById('pass').value;
          var rpass = document.getElementById('repass').value;
          var name = document.getElementById('name').value;
          var address = document.getElementById('add').value;
          var vnum = document.getElementById('vnumber').value;
          var phno = document.getElementById('phno').value;
        
          if (pass === rpass && phno.length == 10) {
            // Query the 'truckDrivers' collection to check if 'phoneNumber' already exists
            const truckDriversRef = collection(db, 'truckDrivers');
            const q = query(truckDriversRef, where('phoneNumber', '==', phno));
        
            getDocs(q)
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  // No document with the same phone number exists, proceed to add
                  createUserWithEmailAndPassword(auth, email1, pass)
                    .then((userCredential) => {
                      onAuthStateChanged(auth, (user) => {
                        if (user) {
                          const uid = user.uid;
                          const userData = {
                            email: email1,
                            name: name,
                            address: address,
                            vehicleNumber: vnum,
                            phoneNumber: phno,
                          };
        
                          // Add the new document to the 'truckDrivers' collection
                          addDoc(truckDriversRef, userData)
                            .then(() => {
                              alert('Sign up successful');
                              const user = userCredential.user;
                              location.href = 'user.html';
                            })
                            .catch((error) => {
                              // The write failed...
                            });
                        } else {
                          // User is signed out
                        }
                      });
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      alert(errorMessage);
                    });
                } else {
                  // A document with the same phone number already exists
                  alert('A user with the same phone number already exists.');
                }
              })
              .catch((error) => {
                console.error('Error checking phone number:', error);
              });
          } else {
            if (phno.length !== 10) {
              alert('Please enter a 10-digit phone number.');
            } else {
              alert('Please type the same password.');
            }
          }
        });