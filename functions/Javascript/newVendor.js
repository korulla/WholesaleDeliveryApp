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

//   ''''''''''''''''''''''''''''''ADDING VENDORS TO FIREBASE'''''''''''''''''

    const vendorForm = document.getElementById('vendorForm');
        vendorForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const vendorId = document.getElementById('vendorId').value;
            const vendorName = document.getElementById('vendorName').value;
            const vendorLocation = document.getElementById('vendorLocation').value;
            const vendorMob = document.getElementById('vendorMob').value;
            const vendorEmail = document.getElementById('vendorEmail').value;
            
            // Reference the "vendors" collection and specify the document ID
            const vendorRef = db.collection('vendors').doc(vendorId);

            vendorRef.get().then((doc) => {
                if (doc.exists) {
                    alert('A vendor with the same ID already exists.');
                    document.getElementById('vendorForm').reset();
                } else {
                    // Create a new vendor document with the specified document ID
                    vendorRef.set({
                        name: vendorName,
                        location: vendorLocation,
                        id: vendorId,
                        mob: vendorMob,
                        email: vendorEmail
                        // Add other vendor details as needed
                    })
                    .then(function () {
                        console.log('Vendor added with ID: ', vendorId);
                        alert('Vendor added successfully!');
                        document.getElementById('vendorForm').reset();
                    })
                    .catch(function (error) {
                        console.error('Error adding vendor: ', error);
                    });
                }
            });
        });

// '''''''''''''''''''''''''''ADDING PRODUCT TO FIREBASE''''''''''''''''''''


const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const productVendorId = document.getElementById('productVendorId').value;
    const productName = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;

    // Check if the vendor exists in the "Vendors" collection
    db.collection('vendors').doc(productVendorId).get()
        .then(function (vendorDoc) {
            if (vendorDoc.exists) {
                // The vendor exists, create a new product document in the "Products" collection
                db.collection('products').add({
                    vendorId: productVendorId,
                    productName: productName,
                    price: price,
                    category: category
                })
                .then(function (productDocRef) {
                    console.log('Product added with ID: ', productDocRef.id);
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
});