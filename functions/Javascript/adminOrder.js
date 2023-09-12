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
        const ordersRef = db.collection("orders");

        // Track selected order
        let selectedOrderId = null;

        // Event listener for order selection
        document.getElementById("order-list").addEventListener("click", (event) => {
            if (event.target.tagName === "BUTTON") {
                // Get the selected order ID
                selectedOrderId = event.target.dataset.orderId;

                // Fetch and display order details for editing
                displayEditOrder(selectedOrderId);
            }
        });

        // Event listener for updating an order
        document.getElementById("update-order").addEventListener("click", () => {
            // Get the updated customer name and order items
            const updatedCustomerName = document.getElementById("customer-name").value;
            const updatedOrderItems = [];

            // Loop through the editable order items and update quantities
            const editableItems = document.querySelectorAll(".editable-item");
            editableItems.forEach((item) => {
                const productId = item.dataset.productId;
                const quantity = parseInt(item.querySelector(".editable-quantity").value);
                updatedOrderItems.push({ productId, quantity });
            });

            // Update the order in Firestore
            updateOrder(selectedOrderId, updatedCustomerName, updatedOrderItems);
        });

        // Function to display orders
        function displayOrders() {
            ordersRef.get().then((querySnapshot) => {
                const orderList = document.getElementById("order-list");
                orderList.innerHTML = "";

                querySnapshot.forEach((doc) => {
                    const orderId = doc.id;
                    const customerName = doc.data().customerName;
                    const orderButton = document.createElement("button");
                    orderButton.textContent = `Order ${orderId} (${customerName})`;
                    orderButton.dataset.orderId = orderId;
                    orderList.appendChild(orderButton);
                });
            });
        }

        // Function to display an order for editing
        function displayEditOrder(orderId) {
            const editOrderDiv = document.getElementById("edit-order");
            editOrderDiv.style.display = "block";

            // Fetch the order details
            ordersRef.doc(orderId).get().then((doc) => {
                const orderData = doc.data();
                const customerName = orderData.customerName;
                const orderItems = orderData.items;

                // Display customer name
                document.getElementById("customer-name").value = customerName;

                // Display editable order items
                const editItemsList = document.getElementById("edit-items");
                editItemsList.innerHTML = "";

                orderItems.forEach((item) => {
                    const productId = item.productId;
                    const quantity = item.quantity;

                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                        Product ID: ${productId}<br>
                        Quantity: <input type="number" class="editable-quantity" value="${quantity}">
                    `;
                    listItem.className = "editable-item";
                    listItem.dataset.productId = productId;
                    editItemsList.appendChild(listItem);
                });
            });
        }

        // Function to update an order
        function updateOrder(orderId, customerName, orderItems) {
            const updatedOrder = {
                customerName: customerName,
                items: orderItems
            };

            // Update the order in Firestore
            ordersRef.doc(orderId).update(updatedOrder).then(() => {
                alert("Order updated successfully!");
                // Clear the edit order form
                clearEditOrderForm();
                // Refresh the order list
                displayOrders();
            }).catch((error) => {
                console.error("Error updating order: ", error);
                alert("Error updating order. Please try again.");
            });
        }

        // Function to clear the edit order form
        function clearEditOrderForm() {
            const editOrderDiv = document.getElementById("edit-order");
            editOrderDiv.style.display = "none";
            document.getElementById("customer-name").value = "";
            document.getElementById("edit-items").innerHTML = "";
            selectedOrderId = null;
        }

        // Call the function to display orders when the page loads
        displayOrders();