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

// Function to check truck driver details by phone number
function checkTruckDriverByPhoneNumber() {
  const phoneNumberToCheck = document.getElementById('checkTdId').value;
  const truckDriverResult = document.getElementById('truckDriverResult');
  console.log(phoneNumberToCheck);

  // Query the 'truckDrivers' collection for the specified phone number
  db.collection('truckDrivers')
    .where('phoneNumber', '==', phoneNumberToCheck)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // There is a truck driver with the specified phone number
        const doc = querySnapshot.docs[0];
        const truckDriverData = doc.data();

        document.getElementById('tdName').textContent = truckDriverData.name || '';
        // document.getElementById('tdId').textContent = doc.id; // This sets the ID of the document.
        document.getElementById('tdMobileNumber').textContent = truckDriverData.phoneNumber || '';
        document.getElementById('tdEmail').textContent = truckDriverData.email || '';
        document.getElementById('tdDrivingLicense').textContent = truckDriverData.vehicleNumber || '';
        document.getElementById('tdAddress').textContent = truckDriverData.address || '';

        truckDriverResult.style.display = 'block';
      } else {
        // No truck driver with the specified phone number was found
        alert('Truck driver with the specified phone number not found');
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
                                  // `<strong>ID:</strong> ${doc.id}<br>` +
                                  `<strong>Mobile Number:</strong> ${truckDriverData.phoneNumber || ''}<br>` +
                                  `<strong>Email:</strong> ${truckDriverData.email || ''}<br>` +
                                  `<strong>Vehicle Number:</strong> ${truckDriverData.vehicleNumber || ''}<br>` +
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
  // const updatedMobileNumber = document.getElementById('editTdMobileNumber').value;
  const updatedDrivingLicense = document.getElementById('editTdDrivingLicense').value;
  const updatedAddress = document.getElementById('editTdAddress').value;

  // Get the current truck driver phone number
  const truckDriverPhoneNumber = document.getElementById('tdMobileNumber').textContent;

  // Create an object to store the updated data
  const updatedData = {};

  if (updatedName !== '') {
    updatedData.name = updatedName;
  }

  // if (updatedMobileNumber !== '') {
  //   updatedData.phoneNumber = updatedMobileNumber;
  // }

  if (updatedDrivingLicense !== '') {
    updatedData.vehicleNumber = updatedDrivingLicense;
  }

  if (updatedAddress !== '') {
    updatedData.address = updatedAddress;
  }

  // Update the truck driver document with the new data
  db.collection('truckDrivers')
    .where('phoneNumber', '==', truckDriverPhoneNumber)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.ref.update(updatedData);
      } else {
        alert('Truck driver with the specified phone number not found');
      }
    })
    .then(() => {
      alert('Truck driver details updated successfully!');
      // Clear the form after a successful update
      document.getElementById('editTruckDriverForm').reset();
      // Hide the edit form
      document.getElementById('editTruckDriverForm').style.display = 'none';
      // Refresh the displayed details
      checkTruckDriverByPhoneNumber();
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
checkTdButton.addEventListener('click', checkTruckDriverByPhoneNumber);

const showAllTdButton = document.getElementById('showAllTdButton');
showAllTdButton.addEventListener('click', toggleAllTruckDrivers);