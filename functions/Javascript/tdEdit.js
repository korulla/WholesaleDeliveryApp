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

// Function to check truck driver details by ID
function checkTruckDriverById() {
  const idToCheck = document.getElementById('checkTdId').value;
  const truckDriverResult = document.getElementById('truckDriverResult');

  db.collection('truckDrivers').doc(idToCheck).get()
      .then((doc) => {
          if (doc.exists) {
              const truckDriverData = doc.data();
              document.getElementById('tdName').textContent = truckDriverData.name || '';
              document.getElementById('tdId').textContent = idToCheck;
              document.getElementById('tdMobileNumber').textContent = truckDriverData.mobileNumber || '';
              document.getElementById('tdDrivingLicense').textContent = truckDriverData.drivingLicense || '';
              document.getElementById('tdAddress').textContent = truckDriverData.address || '';
              truckDriverResult.style.display = 'block';
          } else {
              alert('Truck driver with the specified ID not found');
          }
      })
      .catch((error) => {
          console.error('Error getting truck driver document:', error);
      });
}

// Function to toggle the display of all truck driver details
function toggleAllTruckDrivers() {
  const allTruckDrivers = document.getElementById('allTruckDrivers');
  const showAllTdButton = document.getElementById('showAllTdButton');

  if (allTruckDrivers.style.display === 'none' || allTruckDrivers.style.display === '') {
      showAllTruckDrivers(); // Calling the function to populate the list
      allTruckDrivers.style.display = 'block';
      showAllTdButton.textContent = 'Hide All Details';
  } else {
      allTruckDrivers.style.display = 'none';
      showAllTdButton.textContent = 'Show All Details';
  }
}

// Function to populate the list of all truck drivers
function showAllTruckDrivers() {
  const allTruckDrivers = document.getElementById('allTruckDrivers');
  const truckDriverList = document.getElementById('truckDriverList');

  // Clear previous list
  truckDriverList.innerHTML = '';

  db.collection('truckDrivers').get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              const truckDriverData = doc.data();
              // Create list item with all details
              const listItem = document.createElement('li');
              listItem.innerHTML = `<strong>Name:</strong> ${truckDriverData.name || ''}<br>` +
                                  `<strong>ID:</strong> ${doc.id}<br>` +
                                  `<strong>Mobile Number:</strong> ${truckDriverData.mobileNumber || ''}<br>` +
                                  `<strong>Driving License:</strong> ${truckDriverData.drivingLicense || ''}<br>` +
                                  `<strong>Address:</strong> ${truckDriverData.address || ''}`;
              truckDriverList.appendChild(listItem);
          });
      })
      .catch((error) => {
          console.error('Error getting truck drivers:', error);
      });
}

// Event listener for the "Edit Truck Driver" button
const editTdButton = document.getElementById('editTdButton');
editTdButton.addEventListener('click', () => {
  document.getElementById('editTruckDriverForm').style.display = 'block';
});

// Function to edit truck driver details
function editTruckDriverDetails() {
  const updatedName = document.getElementById('editTdName').value;
  const updatedMobileNumber = document.getElementById('editTdMobileNumber').value;
  const updatedDrivingLicense = document.getElementById('editTdDrivingLicense').value;
  const updatedAddress = document.getElementById('editTdAddress').value;

  // Get the current truck driver ID
  const truckDriverId = document.getElementById('tdId').textContent;

  // Create an object to store the updated data
  const updatedData = {};

  if (updatedName !== '') {
    updatedData.name = updatedName;
  }

  if (updatedMobileNumber !== '') {
    updatedData.mobileNumber = updatedMobileNumber;
  }

  if (updatedDrivingLicense !== '') {
    updatedData.drivingLicense = updatedDrivingLicense;
  }

  if (updatedAddress !== '') {
    updatedData.address = updatedAddress;
  }

  // Update the truck driver document with the new data
  db.collection('truckDrivers')
    .doc(truckDriverId)
    .update(updatedData)
    .then(() => {
      alert('Truck driver details updated successfully!');
      // Clear the form after a successful update
      document.getElementById('editTruckDriverForm').reset();
      // Hide the edit form
      document.getElementById('editTruckDriverForm').style.display = 'none';
      // Refresh the displayed details
      checkTruckDriverById();
    })
    .catch((error) => {
      console.error('Error updating truck driver details: ', error);
    });
}

// Event listener for the "Confirm Edit" button in the edit form
const confirmEditTdButton = document.getElementById('confirmEditTdButton');
confirmEditTdButton.addEventListener('click', editTruckDriverDetails);

// Event listeners
const checkTdButton = document.getElementById('checkTdButton');
checkTdButton.addEventListener('click', checkTruckDriverById);

const showAllTdButton = document.getElementById('showAllTdButton');
showAllTdButton.addEventListener('click', toggleAllTruckDrivers);