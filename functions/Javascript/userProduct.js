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
  
          // Event listener for vendor selection
          document.getElementById("vendor-list").addEventListener("click", (event) => {
              if (event.target.tagName === "BUTTON") {
                  // Add the selected vendor to the array
                  selectedVendors.push(event.target.dataset.vendorId);
                  // Fetch and display products for the selected vendor
                  displayProducts(event.target.dataset.vendorId);
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
  
          // Event listener for placing an order
          document.getElementById("place-order").addEventListener("click", () => {
              placeOrder();
          });
  
          // Fetch and display vendors
          function displayVendors() {
              vendorsRef.get().then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      const vendorName = doc.data().name;
                      const button = document.createElement("button");
                      button.textContent = vendorName;
                      button.dataset.vendorId = doc.id;
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
              productsRef.doc(productId).get().then((doc) => {
                  const productData = doc.data();
                  const cartItem = {
                      productId: productId,
                      name: productData.productName,
                      price: productData.price,
                      quantity: quantity
                  };
  
                  // Create a new item in the cart
                  const listItem = document.createElement("li");
                  listItem.textContent = `${cartItem.name} - $${cartItem.price} x${cartItem.quantity}`;
                  document.getElementById("cart-items").appendChild(listItem);
  
                  // Calculate and update total price
                  const totalPrice = calculateTotalPrice();
                  document.getElementById("total-price").textContent = totalPrice.toFixed(2);
              });
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
                  totalBillAmount: calculateTotalPrice()
              };
  
              // Add products from the cart to the order
              const cartItems = document.getElementById("cart-items").children;
              for (let i = 0; i < cartItems.length; i++) {
                  const itemText = cartItems[i].textContent;
                  const name = itemText.split("-")[0].trim();
                  const quantity = parseInt(itemText.split("x")[1].trim());
                  order.products.push({ name, quantity });
              }
  
              // Save the order to Firestore
              ordersRef.add(order)
                  .then(() => {
                      alert("Order placed successfully!");
                      // Clear the cart and selected vendors
                      document.getElementById("cart-items").innerHTML = "";
                      document.getElementById("total-price").textContent = "0.00";
                      selectedVendors = []; // Clear the selected vendors
                  })
                  .catch((error) => {
                      console.error("Error placing order: ", error);
                      alert("Error placing order. Please try again.");
                  });
          }
  
          // Call the function to display vendors when the page loads
          displayVendors();
  
          // Fetch and display vendors from orders
          function displayVendorsFromOrders() {
              // Clear the vendor list
              document.getElementById("vendor-list").innerHTML = "";
  
              // Query the orders collection to get all orders
              ordersRef.get().then((querySnapshot) => {
                  querySnapshot.forEach((orderDoc) => {
                      const vendorRefs = orderDoc.data().vendorDetails; // Array of vendor references
                      vendorRefs.forEach((vendorRef) => {
                          // Fetch the vendor document using the reference
                          vendorsRef.doc(vendorRef).get().then((vendorDoc) => {
                              const vendorData = vendorDoc.data();
                              const vendorName = vendorData.name;
                              const button = document.createElement("button");
                              button.textContent = vendorName;
                              button.dataset.vendorId = vendorDoc.id;
                              document.getElementById("vendor-list").appendChild(button);
                          });
                      });
                  });
              });
          }
  
          // Call the function to display vendors from orders when the page loads
          displayVendorsFromOrders();