// ...............USER LOGIN MOBILE CHECK............

document.addEventListener('DOMContentLoaded', function() {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const loginForm = document.getElementById('userLoginForm');

    // Regular expression to validate a phone number
    const phoneNumberPattern = /^\d{10}$/; // Adjust as needed for your specific phone number format

    loginForm.addEventListener('submit', function(event) {
        const phoneNumber = phoneNumberInput.value;

        if (!phoneNumberPattern.test(phoneNumber)) {
            alert('Please enter a valid phone number.');
            event.preventDefault(); // Prevent form submission
        }
    });
});

// ''''''''''''''''''''''''''''''''VENDOR HTML PRODUCT ADD AND REMOVE NUMBERS''''''''''''''''''''''
const plusButtons = document.querySelectorAll('.plusButton');
const minusButtons = document.querySelectorAll('.minusButton');
const counters = document.querySelectorAll('.noItems');

plusButtons.forEach((button, index) => {
    let count = 0;

    button.addEventListener('click', function () {
        count++;
        counters[index].textContent = count;
    });
});

minusButtons.forEach((button, index) => {
    let count = 0;

    button.addEventListener('click', function () {
        count = parseInt(counters[index].textContent);

        if (count > 0) {
            count--;
            counters[index].textContent = count;
        }
    });
});


// ''''''''''''''''''''''''''''''''''''''''VIEW TRUCK DRIVERS ONE BY ONE OR FULL''''''''''''''
const firebaseConfig = {
    apiKey: "AIzaSyCRP0v9HrdAK09hN4Znn2dYOSd4aZm8T80",
    authDomain: "wholesale-delivery-app-5327f.firebaseapp.com",
    projectId: "wholesale-delivery-app-5327f",
    storageBucket: "wholesale-delivery-app-5327f.appspot.com",
    messagingSenderId: "505301345310",
    appId: "1:505301345310:web:39090ed1bd798c91c63a0f",
    measurementId: "G-8LTQKYEJTE"
  };

  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 // Initialize firestore
 const db = firebase.firestore();

 const viewAllButton = document.getElementById('viewAllButton'); // Corrected variable name
 const viewByIdButton = document.getElementById('viewByIdButton');
 const viewByIdForm = document.getElementById('viewByIdForm');
 const truckDriverDetails = document.getElementById('truckDriverDetails');
 
 viewAllButton.addEventListener('click', () => {
     // Retrieve and display all truck driver details
     db.collection('truckDrivers')
         .get()
         .then((querySnapshot) => {
             let detailsHtml = '';
             querySnapshot.forEach((doc) => {
                 const data = doc.data();
                 detailsHtml += `
                     <p><strong>Name:</strong> ${data.name}</p>
                     <p><strong>Mobile:</strong> ${data.phoneNumber}</p>
                     <p><strong>Address:</strong> ${data.address}</p>
                     <p><strong>License:</strong> ${data.vehicleNumber}</p>
                     <hr>
                 `;
             });
             truckDriverDetails.innerHTML = detailsHtml;
         })
         .catch((error) => {
             console.error('Error getting documents:', error);
         });
 });
 
 viewByIdButton.addEventListener('click', () => {
     const idToView = document.getElementById('viewTdId').value;
 
     // Check if the document with the specified ID exists
     db.collection('truckDrivers')
         .doc(idToView)
         .get()
         .then((doc) => {
             if (doc.exists) {
                 const data = doc.data();
                 truckDriverDetails.innerHTML = `
                     <p><strong>ID:</strong> ${doc.id}</p>
                     <p><strong>Name:</strong> ${data.name}</p>
                     <p><strong>Mobile:</strong> ${data.mobileNumber}</p>
                     <p><strong>Address:</strong> ${data.address}</p>
                     <p><strong>License:</strong> ${data.drivingLicense}</p>
                 `;
             } else {
                 truckDriverDetails.innerHTML = '<p>Truck driver with the specified ID not found.</p>';
             }
         })
         .catch((error) => {
             console.error('Error getting document:', error);
         });
 });