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

         // Reference to Firestore collections
         const vendorsRef = firebase.firestore().collection("vendors");
         const productsRef = firebase.firestore().collection("products");
         const ordersRef = firebase.firestore().collection("orders");
 
         // Track selected vendors and products
         let selectedVendors = []; // An array to store vendor IDs
         let selectedProductId = null;
 
         // Maintain a cart object to keep track of products and quantities
         const cart = {};
 
         // Event listener for vendor selection
         document.getElementById("vendor-list").addEventListener("click", (event) => {
             if (event.target.tagName === "BUTTON") {
                 // Add the selected vendor to the array
                 const vendorId = event.target.dataset.vendorId;
                 if (!selectedVendors.includes(vendorId)) {
                     selectedVendors.push(vendorId);
                 }
                 // Fetch and display products for the selected vendor
                 displayProducts(vendorId);
             }
         });
 
         // Event listener for product selection
         document.getElementById("product-list").addEventListener("click", (event) => {
             if (event.target.tagName === "LI") {
                 // Fetch and display product details
                 selectedProductId = event.target.dataset.productId;
                 displayProductDetails(selectedProductId);
             }
         });
 
         // Event listener for adding products to cart
         document.getElementById("product-details").addEventListener("click", (event) => {
             if (event.target.id === "add-to-cart") {
                 // Add the selected product to the cart
                 const quantity = parseInt(document.getElementById("quantity").value);
                 addToCart(selectedProductId, quantity);
             }
         });
 
         // Event listener for plus button in the cart
         document.getElementById("cart-items").addEventListener("click", (event) => {
             if (event.target.classList.contains("plus-button")) {
                 const productId = event.target.dataset.productId;
                 updateCartItemQuantity(productId, 1);
             }
         });
 
         // Event listener for minus button in the cart
         document.getElementById("cart-items").addEventListener("click", (event) => {
             if (event.target.classList.contains("minus-button")) {
                 const productId = event.target.dataset.productId;
                 updateCartItemQuantity(productId, -1);
             }
         });
 
         // Event listener for placing an order
         document.getElementById("place-order").addEventListener("click", () => {
             placeOrder();
         });
 
         // Fetch and display vendors
         function displayVendors() {
             vendorsRef.get().then((querySnapshot) => {
                 // Clear the vendor list
                 document.getElementById("vendor-list").innerHTML = "";
                 selectedVendors = []; // Clear the selected vendors
 
                 querySnapshot.forEach((doc) => {
                     const vendorId = doc.id;
                     const vendorName = doc.data().name;
                     const button = document.createElement("button");
                     button.textContent = vendorName;
                     button.dataset.vendorId = vendorId;
                     document.getElementById("vendor-list").appendChild(button);
                 });
             });
         }
 
         // Fetch and display products for a specific vendor
         function displayProducts(vendorId) {
             // Clear previous product list
             document.getElementById("product-list").innerHTML = "";
             productsRef.where("vendorId", "==", vendorId).get().then((querySnapshot) => {
                 querySnapshot.forEach((doc) => {
                     const productName = doc.data().productName;
                     const listItem = document.createElement("li");
                     listItem.textContent = productName;
                     listItem.dataset.productId = doc.id;
                     document.getElementById("product-list").appendChild(listItem);
                 });
             });
         }
 
         // Fetch and display product details
         function displayProductDetails(productId) {
             productsRef.doc(productId).get().then((doc) => {
                 const productData = doc.data();
                 const productDetails = `
                     <h2>${productData.productName}</h2>
                     <p>Category: ${productData.category}</p>
                     <p>Price: $${productData.price}</p>
                     <input type="number" id="quantity" value="1" min="1">
                     <button id="add-to-cart">Add to Cart</button>
                 `;
                 document.getElementById("product-details").innerHTML = productDetails;
             });
         }
 
         // Add products to cart
         function addToCart(productId, quantity) {
             if (cart[productId]) {
                 // If the product is already in the cart, update the quantity
                 cart[productId] += quantity;
             } else {
                 // If the product is not in the cart, add it
                 cart[productId] = quantity;
             }
 
             updateCartUI();
         }
 
         // Update the quantity of a cart item
         function updateCartItemQuantity(productId, quantityChange) {
             cart[productId] += quantityChange;
             if (cart[productId] <= 0) {
                 delete cart[productId]; // Remove the item from the cart if quantity <= 0
             }
 
             updateCartUI();
         }
 
// Update the cart UI
async function updateCartUI() {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = "";

    let totalPrice = 0;

    for (const productId in cart) {
        if (cart.hasOwnProperty(productId)) {
            const quantity = cart[productId];

            // Fetch product data using async/await
            const doc = await productsRef.doc(productId).get();
            if (doc.exists) {
                const productData = doc.data();

                const listItem = document.createElement("li");
                listItem.textContent = `${productData.productName} - $${productData.price} x${quantity}`;
                listItem.dataset.productId = productId;

                // Add plus and minus buttons
                const plusButton = document.createElement("button");
                plusButton.textContent = "+";
                plusButton.classList.add("plus-button");
                plusButton.dataset.productId = productId;

                const minusButton = document.createElement("button");
                minusButton.textContent = "-";
                minusButton.classList.add("minus-button");
                minusButton.dataset.productId = productId;

                listItem.appendChild(plusButton);
                listItem.appendChild(minusButton);

                cartItemsElement.appendChild(listItem);

                totalPrice += productData.price * quantity;
            }
        }
    }

    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}
 
         // Calculate total price of items in the cart
         function calculateTotalPrice() {
             let totalPrice = 0;
             const cartItems = document.getElementById("cart-items").children;
 
             for (let i = 0; i < cartItems.length; i++) {
                 const itemText = cartItems[i].textContent;
                 const price = parseFloat(itemText.split("-")[1].trim().split("x")[0].trim().replace('$', ''));
                 const quantity = parseInt(itemText.split("x")[1].trim());
                 totalPrice += price * quantity;
             }
 
             return totalPrice;
         }
 
         // Place an order
         function placeOrder() {
             // Create an order object with products, vendor details, and total price
             const order = {
                 products: [],
                 vendorDetails: selectedVendors, // Now it's an array of vendor IDs
                 totalBillAmount: calculateTotalPrice(),
                 Truckdriver:document.getElementById('temail').value
             };
 
             // Create an array to store promises for fetching product names
             const productPromises = [];
 
             // Add products from the cart to the order
             for (const productId in cart) {
                 if (cart.hasOwnProperty(productId)) {
                     const quantity = cart[productId];
                     const productPromise = productsRef.doc(productId).get().then((doc) => {
                         if (doc.exists) {
                             const productData = doc.data();
                             const productName = productData.productName;
                             order.products.push({ productId, name: productName, quantity });
                         }
                     });
                     productPromises.push(productPromise);
                 }
             }
 
             // Wait for all product promises to resolve before saving the order
             Promise.all(productPromises)
                 .then(() => {
                     // Save the order to Firestore with a custom order ID
                     const orderId = generateOrderId(); // Generate a custom order ID
                     return ordersRef.doc(orderId).set(order) // Set the order data with the custom ID
                         .then(() => {
                             alert("Order placed successfully with ID: " + orderId);
                             // Clear the cart and selected vendors
                             cart = {};
                             document.getElementById("cart-items").innerHTML = "";
                             document.getElementById("total-price").textContent = "0.00";

                             selectedVendors = []; // Clear the selected vendors
                         });
                 })
                 .catch((error) => {
                     console.error("Error placing order: ", error);
                     // You can choose to display the error here or handle it differently
                 });
         }
 
         // Function to generate a custom order ID (you can modify this as needed)
         function generateOrderId() {
             // Generate a unique order ID, e.g., using a timestamp or a random string
             // For simplicity, we'll use the current timestamp as the order ID
             return Date.now().toString();
         }
 
         // Call the function to display vendors when the page loads
         displayVendors();