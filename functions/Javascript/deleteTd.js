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


  const showDetailsButton = document.getElementById('showDetailsButton');
  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  const truckDriverDetails = document.getElementById('truckDriverDetails');
  
  showDetailsButton.addEventListener('click', () => {
      const idToDelete = document.getElementById('deleteTdId').value;
  
      // Check if the document exists
      db.collection('truckDrivers')
          .doc(idToDelete)
          .get()
          .then((doc) => {
              if (doc.exists) {
                  const data = doc.data();
                  truckDriverDetails.innerHTML = `
                      <p><strong>Name:</strong> ${data.name}</p>
                      <p><strong>Mobile:</strong> ${data.mobileNumber}</p>
                      <p><strong>Address:</strong> ${data.address}</p>
                      <p><strong>License:</strong> ${data.drivingLicense}</p>
                  `;
                  confirmDeleteButton.disabled = false;
                  truckDriverDetails.classList.remove('error-message');
              } else {
                  truckDriverDetails.innerHTML = '<p class="error-message">Truck driver with the specified ID not found.</p>';
                  confirmDeleteButton.disabled = true;
                  truckDriverDetails.classList.add('error-message');
              }
          })
          .catch((error) => {
              console.error('Error getting document:', error);
          });
  });
  
  confirmDeleteButton.addEventListener('click', () => {
      const idToDelete = document.getElementById('deleteTdId').value;
  
      // Delete the document
      db.collection('truckDrivers')
          .doc(idToDelete)
          .delete()
          .then(() => {
              console.log('Document successfully deleted');
              truckDriverDetails.innerHTML = '';
              confirmDeleteButton.disabled = true;
              truckDriverDetails.classList.remove('error-message');
          })
          .catch((error) => {
              console.error('Error deleting document:', error);
          });
  });

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

const showAllTdButton = document.getElementById('showAllTdButton');
showAllTdButton.addEventListener('click', toggleAllTruckDrivers);