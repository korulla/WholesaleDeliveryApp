
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
  
  // Add an event listener to the "Show Details" button
  showDetailsButton.addEventListener('click', () => {
    // Get the phone number to search for from the input field
    const phoneNumberToSearch = document.getElementById('deleteTdId').value;
  
    // Query the Firestore collection for documents with the specified phone number
    db.collection('truckDrivers')
      .where('phoneNumber', '==', phoneNumberToSearch)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // If documents with the matching phone number are found
          let detailsHTML = '';
  
          // Iterate through the matching documents and display their details
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            detailsHTML += `
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Mobile:</strong> ${data.phoneNumber}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Address:</strong> ${data.address}</p>
              <p><strong>Vehicle Number:</strong> ${data.vehicleNumber}</p>
            `;
          });
  
          // Display the details and enable the "Delete" button
          truckDriverDetails.innerHTML = detailsHTML;
          confirmDeleteButton.disabled = false;
          truckDriverDetails.classList.remove('error-message');
        } else {
          // If no matching documents are found
          truckDriverDetails.innerHTML = '<p class="error-message">No truck drivers with the specified phone number found.</p>';
          confirmDeleteButton.disabled = true;
          truckDriverDetails.classList.add('error-message');
        }
      })
      .catch((error) => {
        console.error('Error querying truck drivers:', error);
      });
  });
  
  // Add an event listener to the "Delete" button
  confirmDeleteButton.addEventListener('click', () => {
    // Get the phone number to delete from the input field
    const phoneNumberToDelete = document.getElementById('deleteTdId').value;
  
    // Query the Firestore collection for documents with the specified phone number
    db.collection('truckDrivers')
      .where('phoneNumber', '==', phoneNumberToDelete)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Delete each matching document
          doc.ref.delete()
            .then(() => {
              console.log('Document successfully deleted');
            })
            .catch((error) => {
              console.error('Error deleting document:', error);
            });
        });
  
        // Clear the details display and disable the "Delete" button
        truckDriverDetails.innerHTML = '';
        confirmDeleteButton.disabled = true;
        truckDriverDetails.classList.remove('error-message');
      })
      .catch((error) => {
        console.error('Error querying truck drivers:', error);
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

const showAllTdButton = document.getElementById('showAllTdButton');
showAllTdButton.addEventListener('click', toggleAllTruckDrivers); 