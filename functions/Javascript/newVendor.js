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

  const vendorForm = document.getElementById('vendorForm');
vendorForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Add vendor to Firebase (unchanged)
});

const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const productVendorId = document.getElementById('productVendorId').value;
    const productId = document.getElementById('productID').value; // Get product ID
    const productName = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    // Check if the product ID already exists
    db.collection('products').doc(productId).get()
        .then(function (productDoc) {
            if (productDoc.exists) {
                // A product with the same ID already exists, show an error message
                alert('A product with the same ID already exists.');
            } else {
                // Check if the vendor exists in the "Vendors" collection
                db.collection('vendors').doc(productVendorId).get()
                    .then(function (vendorDoc) {
                        if (vendorDoc.exists) {
                            // The vendor exists, create a new product document in the "Products" collection
                            db.collection('products').doc(productId).set({
                                vendorId: productVendorId,
                                productName: productName,
                                price: price,
                                category: category
                            })
                            .then(function () {
                                console.log('Product added with ID: ', productId);
                                alert('Product added successfully!');
                                document.getElementById('productForm').reset();
                            })
                            .catch(function (error) {
                                console.error('Error adding product: ', error);
                            });
                        } else {
                            // The vendor does not exist, show an error message
                            alert('Vendor with ID ' + productVendorId + ' does not exist.');
                        }
                    })
                    .catch(function (error) {
                        console.error('Error checking vendor existence: ', error);
                    });
            }
        })
        .catch(function (error) {
            console.error('Error checking product existence: ', error);
        });
});
