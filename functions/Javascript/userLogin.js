import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
 
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
  const auth = getAuth(app);

  const userLoginForm = document.getElementById("userLoginForm");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const sendVerificationCodeButton = document.getElementById("sendVerificationCode");
  const verificationCodeDiv = document.getElementById("verificationCodeDiv");
  const verificationCodeInput = document.getElementById("verificationCode");
  const verifyCodeButton = document.getElementById("verifyCode");
  const recaptchaContainer = document.getElementById("recaptcha-container");
  

  // Initialize the reCAPTCHA widget
  const appVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer);

  sendVerificationCodeButton.addEventListener("click", () => {
    const phoneNumber = phoneNumberInput.value;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // Prompt the user to enter the verification code
        verificationCodeDiv.style.display = "block";
        sendVerificationCodeButton.style.display = "none";
        verifyCodeButton.style.display = "block";
        console.log("Verification code sent");
      })
      .catch((error) => {
        console.error("Error sending verification code:", error);
      });
  });

  verifyCodeButton.addEventListener("click", () => {
    const verificationCode = verificationCodeInput.value;
    const confirmationResult = firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
    confirmationResult.confirm(verificationCode)
      .then((userCredential) => {
        // User is now authenticated
        const user = userCredential.user;
        console.log("Authenticated user:", user);
        // Redirect or perform other actions as needed
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
      });
  });