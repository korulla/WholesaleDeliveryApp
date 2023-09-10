 // Your web app's Firebase configuration

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

// '''''''''GETTING DATA FROM ADMIN FOR TRUCK DRIVER DETAILS AND CREATING '''''''''''''''

const addTruckDriverButton = document.getElementById('addTdButton');
addTruckDriverButton.addEventListener('click', addTruckDriver);

function addTruckDriver() {
  // Get input values
  const name = document.getElementById('addTdName').value;
  const mobileNumber = document.getElementById('addTdMob').value;
  const address = document.getElementById('addTdAdress').value;
  const drivingLicense = document.getElementById('addTdLicense').value;
  const id = document.getElementById('addTdId').value;

  // Check if the ID already exists in the collection
  db.collection('truckDrivers')
    .where('id', '==', id)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Show an error if the ID is already in use
        alert('This ID is already in use. Please choose a different one.');
      } else {
        // Create a JavaScript object with the data
        const truckDriverData = {
          name: name,
          mobileNumber: mobileNumber,
          address: address,
          drivingLicense: drivingLicense,
          id: id
        };

        // Use the provided ID as the document ID
        db.collection('truckDrivers')
          .doc(id)
          .set(truckDriverData)
          .then(function () {
            console.log('Document written with ID: ', id);
            // Clear the form after successful submission
            document.getElementById('truckDriverForm').reset();
          })
          .catch(function (error) {
            console.error('Error adding document: ', error);
          });
      }
    })
    .catch(function (error) {
      console.error('Error checking for existing ID: ', error);
    });
}
