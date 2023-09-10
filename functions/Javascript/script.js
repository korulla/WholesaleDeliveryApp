// ...............USER LOGIN MOBILE CHECK............

document.addEventListener('DOMContentLoaded', function() {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const loginForm = document.getElementById('userLoginForm');

    // Regular expression to validate a phone number
    const phoneNumberPattern = /^\d{10}$/; // Adjust as needed for your specific phone number format

    loginForm.addEventListener('submit', function(event) {
        const phoneNumber = phoneNumberInput.value;

        if (!phoneNumberPattern.test(phoneNumber)) {
            alert('Please enter a valid phone number.');
            event.preventDefault(); // Prevent form submission
        }
    });
});

// ''''''''''''''''''''''''''''''''VENDOR HTML PRODUCT ADD AND REMOVE NUMBERS''''''''''''''''''''''
const plusButtons = document.querySelectorAll('.plusButton');
const minusButtons = document.querySelectorAll('.minusButton');
const counters = document.querySelectorAll('.noItems');

plusButtons.forEach((button, index) => {
    let count = 0;

    button.addEventListener('click', function () {
        count++;
        counters[index].textContent = count;
    });
});

minusButtons.forEach((button, index) => {
    let count = 0;

    button.addEventListener('click', function () {
        count = parseInt(counters[index].textContent);

        if (count > 0) {
            count--;
            counters[index].textContent = count;
        }
    });
});


// ''''''''''''''''''''''''''''''''''''''''show current products from vendors''''''''''''''

// const showButton = document.getElementById("britania");
// const elementToShow = document.getElementById("Britania");

// // Add a click event listener to the button
// showButton.addEventListener("click", function () {
//   // Check the current display style
//   const currentDisplay = window.getComputedStyle(elementToShow).display;

//   // Toggle the display property based on the current state
//   if (currentDisplay === "none") {
//     elementToShow.style.display = "block"; // Change to "block" or your desired value
//   } else {
//     elementToShow.style.display = "none";
//   }
// });