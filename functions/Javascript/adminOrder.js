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


  const ordersRef = firebase.firestore().collection("orders");

  // Function to fetch and display orders
  function displayOrders() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    ordersRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            const orderId = doc.id;

            // Create an order item element
            const orderItem = document.createElement("div");

            // Get product names
            const productNames = orderData.products.map(product => product.name).join(", ");

            orderItem.innerHTML = `
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Amount:</strong> $${orderData.totalBillAmount}</p>
                <p><strong>Truck Driver Email:</strong> ${orderData.Truckdriver}</p>
                <p><strong>Products:</strong> ${productNames}</p>
                <button class="edit-order-button" data-order-id="${orderId}">Edit</button>
            `;

            // Add an event listener to the edit button
            const editButton = orderItem.querySelector(".edit-order-button");
            editButton.addEventListener("click", () => {
                openEditModal(orderId, orderData);
            });

            orderList.appendChild(orderItem);
        });
    });
}

  // Function to open the edit order modal
  function openEditModal(orderId, orderData) {
      const editOrderModal = document.getElementById("edit-order-modal");
      const orderIdSpan = document.getElementById("order-id");
      const editOrderAmountInput = document.getElementById("edit-order-amount");
      const productQuantitiesList = document.getElementById("product-quantities");
      const saveEditedOrderButton = document.getElementById("save-edited-order");
      const closeEditModalButton = document.getElementById("close-edit-modal");

      // Populate the modal with the current order details
      orderIdSpan.textContent = orderId;
      editOrderAmountInput.value = orderData.totalBillAmount;

      // Display products and quantities in the modal
      productQuantitiesList.innerHTML = "";
      for (const product of orderData.products) {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quantity:</strong> <input type="number" class="edit-product-quantity" value="${product.quantity}" min="1"></p>
          `;
          productQuantitiesList.appendChild(listItem);
      }

      // Add an event listener to the "Save" button
      saveEditedOrderButton.addEventListener("click", () => {
          const editedTotalAmount = editOrderAmountInput.value;
          const editedProducts = [];

          // Update quantities for each product
          const editProductQuantityInputs = document.querySelectorAll(".edit-product-quantity");
          editProductQuantityInputs.forEach((input, index) => {
              const newQuantity = parseInt(input.value);
              orderData.products[index].quantity = newQuantity;
              editedProducts.push(orderData.products[index]);
          });

          // Update the order details in Firebase
          updateOrder(orderId, parseFloat(editedTotalAmount), editedProducts);
      });

      // Add an event listener to the "Close" button
      closeEditModalButton.addEventListener("click", () => {
          editOrderModal.style.display = "none";
      });

      // Display the edit order modal
      editOrderModal.style.display = "block";
  }

  // Function to update order details in Firebase
  function updateOrder(orderId, editedTotalAmount, editedProducts) {
      ordersRef.doc(orderId).update({
          totalBillAmount: editedTotalAmount,
          products: editedProducts
      })
      .then(() => {
          alert("Order updated successfully");
          document.getElementById("edit-order-modal").style.display = "none";
          displayOrders();
      })
      .catch((error) => {
          console.error("Error updating order: ", error);
          alert("Error updating order. Please try again.");
      });
  }

  // Call the function to display orders when the page loads
  displayOrders();
