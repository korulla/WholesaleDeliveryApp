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

  const checkForm = document.getElementById('checkForm');

  checkForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const checkId = document.getElementById('checkId').value;
    const checkType = document.getElementById('checkType').value;

    if (checkType === 'vendor') {
        // Check if the vendor exists in the "Vendors" collection
        db.collection('vendors')
            .doc(checkId)
            .get()
            .then(function (vendorDoc) {
                if (vendorDoc.exists) {
                    // The vendor exists, display the vendor information and associated products
                    displayVendorDetails(vendorDoc.data());
                } else {
                    alert('No vendor found with ID ' + checkId);
                }
            })
            .catch(function (error) {
                console.error('Error checking vendor existence: ', error);
            });
    } else if (checkType === 'product') {
        // Check if the product exists in the "Products" collection
        db.collection('products')
            .doc(checkId)
            .get()
            .then(function (productDoc) {
                if (productDoc.exists) {
                    // The product exists, display the product details
                    displayProductDetails(productDoc.data());
                } else {
                    alert('No product found with ID ' + checkId);
                }
            })
            .catch(function (error) {
                console.error('Error checking product existence: ', error);
            });
    }
});

// Function to display vendor details
function displayVendorDetails(vendorData) {
    // Hide product details and product delete button
    document.getElementById('productInfoDisplay').style.display = 'none';
    document.getElementById('deleteProductButton').style.display = 'none';

    // Populate vendor information
    document.getElementById('vendorName').textContent = vendorData.name;
    document.getElementById('vendorLocation').textContent = vendorData.location;
    document.getElementById('vendorMob').textContent = vendorData.mob;
    document.getElementById('vendorEmail').textContent = vendorData.email;

    // Show vendor details and vendor delete button
    document.getElementById('vendorInfoDisplay').style.display = 'block';
    document.getElementById('deleteVendorButton').style.display = 'block';
}

// Function to display product details
function displayProductDetails(productData) {
    // Hide vendor details and vendor delete button
    document.getElementById('vendorInfoDisplay').style.display = 'none';
    document.getElementById('deleteVendorButton').style.display = 'none';

    // Populate product details
    document.getElementById('productName').textContent = productData.productName;
    document.getElementById('productPrice').textContent = productData.price;
    document.getElementById('productCategory').textContent = productData.category;

    // Show product details and product delete button
    document.getElementById('productInfoDisplay').style.display = 'block';
    document.getElementById('deleteProductButton').style.display = 'block';
}

// Clear the displayed information
function clearDisplay() {
    // Clear displayed data for both vendor and product
    document.getElementById('vendorName').textContent = '';
    document.getElementById('vendorLocation').textContent = '';
    document.getElementById('vendorMob').textContent = '';
    document.getElementById('vendorEmail').textContent = '';
    document.getElementById('productName').textContent = '';
    document.getElementById('productPrice').textContent = '';
    document.getElementById('productCategory').textContent = '';

    // Hide vendor and product details, and delete buttons
    document.getElementById('vendorInfoDisplay').style.display = 'none';
    document.getElementById('productInfoDisplay').style.display = 'none';
    document.getElementById('deleteVendorButton').style.display = 'none';
    document.getElementById('deleteProductButton').style.display = 'none';
}

// Add event listener for clearing the display
document.getElementById('checkForm').addEventListener('reset', clearDisplay);

// Add event listener to show all products button
const showAllProductsButton = document.getElementById('showAllProductsButton');
showAllProductsButton.addEventListener('click', function () {
    const allProductsList = document.getElementById('allProductsList');

    // Toggle visibility of the list and change button text
    if (allProductsList.style.display === 'none') {
        showAllProducts();
        allProductsList.style.display = 'block';
        showAllProductsButton.textContent = 'Hide All Products';
    } else {
        allProductsList.style.display = 'none';
        showAllProductsButton.textContent = 'Show All Products';
    }
});

// Add event listener to show all vendors button
const showAllVendorsButton = document.getElementById('showAllVendorsButton');
showAllVendorsButton.addEventListener('click', function () {
    const allVendorsList = document.getElementById('allVendorsList');

    // Toggle visibility of the list and change button text
    if (allVendorsList.style.display === 'none') {
        showAllVendors();
        allVendorsList.style.display = 'block';
        showAllVendorsButton.textContent = 'Hide All Vendors';
    } else {
        allVendorsList.style.display = 'none';
        showAllVendorsButton.textContent = 'Show All Vendors';
    }
});

// Function to show all product names and IDs
function showAllProducts() {
    const allProductsList = document.getElementById('allProductsList');
    allProductsList.innerHTML = '';

    // Query all products and populate the list
    db.collection('products')
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (productDoc) {
                const productData = productDoc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${productData.productName}, ID: ${productDoc.id}`;
                allProductsList.appendChild(listItem);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving products: ', error);
        });
}

// Function to show all vendor names and IDs
function showAllVendors() {
    const allVendorsList = document.getElementById('allVendorsList');
    allVendorsList.innerHTML = '';

    // Query all vendors and populate the list
    db.collection('vendors')
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (vendorDoc) {
                const vendorData = vendorDoc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${vendorData.name}, ID: ${vendorDoc.id}`;
                allVendorsList.appendChild(listItem);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving vendors: ', error);
        });
}