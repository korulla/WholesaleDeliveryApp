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

// Assuming you have already initialized Firebase and have a reference to your Firestore as 'db'

// Assuming you have already initialized Firebase and have a reference to your Firestore as 'db'

// Define the truckDriverRef variable in the outer scope
const truckDriverRef = db.collection('truckDrivers').doc(); // You can initialize it with an empty document reference

const editTruckDriverButton = document.getElementById('editTdButton');
editTruckDriverButton.addEventListener('click', editTruckDriver);

function editTruckDriver() {
  // Get input values
  const idToEdit = document.getElementById('editTdId').value; // Custom ID provided by the user
  const updatedName = document.getElementById('editTdName').value;
  const updatedMobileNumber = document.getElementById('editTdMob').value;
  const updatedAddress = document.getElementById('editTdAdress').value;
  const updatedDrivingLicense = document.getElementById('editTdLicense').value;

  // Create a reference to the specific document using the custom ID
  const truckDriverRef = db.collection('truckDrivers').doc(idToEdit);

  // Check if the document exists
  truckDriverRef.get()
    .then((doc) => {
      if (doc.exists) {
        // Construct an object with the fields to update
        const updatedData = {};

        if (updatedName !== '') {
          updatedData.name = updatedName;
        }

        if (updatedMobileNumber !== '') {
          updatedData.mobileNumber = updatedMobileNumber;
        }

        if (updatedAddress !== '') {
          updatedData.address = updatedAddress;
        }

        if (updatedDrivingLicense !== '') {
          updatedData.drivingLicense = updatedDrivingLicense;
        }

        // Update the document with the new data
        return truckDriverRef.update(updatedData)
          .then(() => {
            console.log('Document successfully updated');
            // Clear the form after a successful update
            document.getElementById('editTruckDriverForm').reset();
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      } else {
        // Document doesn't exist
        console.log('Truck driver with the specified ID not found');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
}
