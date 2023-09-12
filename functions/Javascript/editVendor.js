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


          // Function to display vendor details and associated products
          function displayVendorDetails(vendorData) {
            // Populate vendor information
            document.getElementById('vendorName').textContent = vendorData.name || '';
            document.getElementById('vendorLocation').textContent = vendorData.location || '';
            document.getElementById('vendorMob').textContent = vendorData.mob || '';
            document.getElementById('vendorEmail').textContent = vendorData.email || '';

            // Retrieve associated products
            db.collection('products')
                .where('vendorId', '==', vendorData.id) // Filter products by vendor ID
                .get()
                .then(function (querySnapshot) {
                    const productList = document.getElementById('productList');
                    productList.innerHTML = ''; // Clear previous product list

                    querySnapshot.forEach(function (productDoc) {
                        const productData = productDoc.data();
                        const listItem = document.createElement('li');
                        listItem.textContent = `${productData.productName} (ID: ${productDoc.id})`;
                        productList.appendChild(listItem);
                    });
                })
                .catch(function (error) {
                    console.error('Error retrieving associated products: ', error);
                });

            // Show the vendor information and product list
            const infoDisplay = document.getElementById('infoDisplay');
            infoDisplay.style.display = 'block';

            // Hide vendor and product editing forms
            document.getElementById('editVendorForm').style.display = 'none';
            document.getElementById('editProductForm').style.display = 'none';
        }

        // Function to display product details in the editing form
        function displayProductDetails(productData) {
            // Populate product editing fields with product data
            document.getElementById('editProductVendorId').value = productData.vendorId || '';
            document.getElementById('editProductName').value = productData.productName || '';
            document.getElementById('editProductPrice').value = productData.price || '';
            document.getElementById('editProductCategory').value = productData.category || '';

            // Show the product editing form
            document.getElementById('editProductForm').style.display = 'block';

            // Hide other forms and product list
            document.getElementById('editVendorForm').style.display = 'none';
            document.getElementById('infoDisplay').style.display = 'none';
        }

        // Check and Edit Form
        const checkForm = document.getElementById('checkForm');
        checkForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const checkId = document.getElementById('checkId').value;
            const checkType = document.getElementById('checkType').value;

            if (checkType === 'vendor') {
                // Check if the vendor exists in the "Vendors" collection
                db.collection('vendors').doc(checkId).get()
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
                db.collection('products').doc(checkId).get()
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

        // Editing Vendor Form
        const editVendorForm = document.getElementById('editVendorForm');
        editVendorForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Retrieve edited vendor details from form fields
            const editVendorId = document.getElementById('checkId').value;
            const editVendorName = document.getElementById('editVendorName').value;
            const editVendorLocation = document.getElementById('editVendorLocation').value;
            const editVendorMob = document.getElementById('editVendorMob').value;
            const editVendorEmail = document.getElementById('editVendorEmail').value;

            // Reference the "vendors" collection and specify the document ID
            const vendorRef = db.collection('vendors').doc(editVendorId);

            // Define an object to hold the updated data
            const updatedData = {};

            // Check each field and add it to the updatedData object if it's not empty
            if (editVendorName.trim() !== '') {
                updatedData.name = editVendorName;
            }

            if (editVendorLocation.trim() !== '') {
                updatedData.location = editVendorLocation;
            }

            if (editVendorMob.trim() !== '') {
                updatedData.mob = editVendorMob;
            }

            if (editVendorEmail.trim() !== '') {
                updatedData.email = editVendorEmail;
            }

            // Update the vendor with the merged data
            return vendorRef.update(updatedData)
                .then(function () {
                    console.log('Vendor updated with ID: ', editVendorId);
                    alert('Vendor updated successfully!');
                    editVendorForm.style.display = 'none';
                })
                .catch(function (error) {
                    console.error('Error updating vendor: ', error);
                });
        });

        // Editing Product Form
        const editProductForm = document.getElementById('editProductForm');
        editProductForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Retrieve edited product details from form fields
            const editProductId = document.getElementById('checkId').value;
            const editProductVendorId = document.getElementById('editProductVendorId').value;
            const editProductName = document.getElementById('editProductName').value;
            const editProductPrice = parseFloat(document.getElementById('editProductPrice').value);
            const editProductCategory = document.getElementById('editProductCategory').value;

            // Reference the "products" collection and specify the document ID
            const productRef = db.collection('products').doc(editProductId);

            // Define an object to hold the updated data
            const updatedData = {};

            // Check each field and add it to the updatedData object if it's not empty
            if (editProductVendorId.trim() !== '') {
                updatedData.vendorId = editProductVendorId;
            }

            if (editProductName.trim() !== '') {
                updatedData.productName = editProductName;
            }

            if (!isNaN(editProductPrice) && editProductPrice >= 0) {
                updatedData.price = editProductPrice;
            }

            if (editProductCategory.trim() !== '') {
                updatedData.category = editProductCategory;
            }

            // Update the product with the merged data
            return productRef.update(updatedData)
                .then(function () {
                    console.log('Product updated with ID: ', editProductId);
                    alert('Product updated successfully!');
                    editProductForm.style.display = 'none';
                })
                .catch(function (error) {
                    console.error('Error updating product: ', error);
                });
        });

        // Add event listeners for "Edit Vendor" and "Edit Product" buttons
        const editVendorButton = document.getElementById('editVendorButton');
        const editProductButton = document.getElementById('editProductButton');
        const showVendorsButton = document.getElementById('showVendorsButton');
        const showProductsButton = document.getElementById('showProductsButton');
        const allVendorsList = document.getElementById('allVendorsList');
        const allProductsList = document.getElementById('allProductsList');

        editVendorButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Show the vendor editing form
            document.getElementById('editVendorForm').style.display = 'block';

            // Hide the product editing form
            document.getElementById('editProductForm').style.display = 'none';
        });

        editProductButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Show the product editing form
            document.getElementById('editProductForm').style.display = 'block';

            // Hide the vendor editing form
            document.getElementById('editVendorForm').style.display = 'none';
        });

        showVendorsButton.addEventListener('click', function () {
            const vendorInfo = document.getElementById('vendorInfo');

            if (vendorInfo.style.display === 'none') {
                // Show vendor info and change button text to "Hide Vendors"
                vendorInfo.style.display = 'block';
                showVendorsButton.textContent = 'Hide Vendors';

                // Retrieve all vendors and display them
                db.collection('vendors')
                    .get()
                    .then(function (querySnapshot) {
                        allVendorsList.innerHTML = ''; // Clear previous vendor list

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
            } else {
                // Hide vendor info and change button text to "Show Vendors"
                vendorInfo.style.display = 'none';
                showVendorsButton.textContent = 'Show Vendors';
            }
        });

        showProductsButton.addEventListener('click', function () {
            const productInfo = document.getElementById('productInfo');

            if (productInfo.style.display === 'none') {
                // Show product info and change button text to "Hide Products"
                productInfo.style.display = 'block';
                showProductsButton.textContent = 'Hide Products';

                // Retrieve all products and display them
                db.collection('products')
                    .get()
                    .then(function (querySnapshot) {
                        allProductsList.innerHTML = ''; // Clear previous product list

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
            } else {
                // Hide product info and change button text to "Show Products"
                productInfo.style.display = 'none';
                showProductsButton.textContent = 'Show Products';
            }
        });