const confirm = document.getElementById("confirm");

// Form Input Fields
const iName = document.getElementById("iName");
const iNumber = document.getElementById("iNumber");
const iMonth = document.getElementById("iMonth");
const iYear = document.getElementById("iYear");
const iCvc = document.getElementById("iCvc");

// Output Fields
const oName = document.getElementById("oName");
const oNumber = document.getElementById("oNumber");
const oMonth = document.getElementById("oMonth");
const oYear = document.getElementById("oYear");
const oCvc = document.getElementById("oCvc");

// Error Elements
const errorCardName = document.getElementById("errorCardName");
const errorCardNumber = document.getElementById("errorCardNumber");
const errorMonthNumber = document.getElementById("errorMonth");
const errorYearNumber = document.getElementById("errorYear");
const errorCvcNumber = document.getElementById("errorCvc");

// Modal Elements
const continueButton = document.getElementById("continue");
const btnCloseModal = document.querySelector(".close-modal");
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

// Form Error Elements
const borderStyle = document.querySelectorAll(".form__item--input")


// Function to close the modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  resetInputs();
  resetInputField();
}

// Function to open the modal
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

// Event listeners for opening and closing the modal
continueButton.addEventListener("click", openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Event listeners for continuing and confirming the form
continueButton.addEventListener("click", closeModal);
confirm.addEventListener("click", addDetail);

// Function to add details after form confirmation
function addDetail(event) {
  event.preventDefault();

  const cName = iName.value;
  const cNumber = iNumber.value;
  const cMonth = iMonth.value;
  const cYear = iYear.value;
  const cCvc = iCvc.value;

  const isNameValid = validateAndSetField(cName, errorCardName, isValidName, oName, iName);
  const isNumberValid = validateAndSetField(cNumber, errorCardNumber, isValidNumber, oNumber, iNumber);
  const isMonthValid = validateAndSetField(cMonth, errorMonthNumber, isValidNumber, oMonth, iMonth);
  const isYearValid = validateAndSetField(cYear, errorYearNumber, isValidNumber, oYear, iYear);
  const isCvcValid = validateAndSetField(cCvc, errorCvcNumber, isValidNumber, oCvc, iCvc);

  if (isNameValid && isNumberValid && isMonthValid && isYearValid && isCvcValid) {
    oName.textContent = cName;
    oNumber.textContent = cNumber;
    oMonth.textContent = cMonth;
    oYear.textContent = cYear;
    oCvc.textContent = cCvc;

    console.log("Form submitted successfully");
    modal.classList.remove("hidden");
  } else {
    resetInputs();
  }
}

// Function to validate input fields and display error messages
function validateAndSetField(value, errorElement, validationFunction, outputElement, borderElement) {
  // Check if the value is empty
  if (value === '') {
    showErrorMessage(errorElement, `Cannot be blank`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // NAME validation
  if (validationFunction === isValidName && outputElement === oName && (value.length < 20 || value.length > 28 || !isValidName(value))) {
    showErrorMessage(errorElement, `Must be between 20 and 28 letters, letters only`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // NUMBER validation
  if (validationFunction === isValidNumber && outputElement === oNumber && (value.length !== 20 || !isValidNumber(value))) {
    showErrorMessage(errorElement, `Must be exactly 16 numbers`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // MONTH validation
  if (validationFunction === isValidNumber && outputElement === oMonth && (parseInt(value) > 12 || !isValidNumber(value))) {
    showErrorMessage(errorElement, `Must be a valid month`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // YEAR validation
  if (validationFunction === isValidNumber && outputElement === oYear && (!isValidNumber(value) || !isValidExpiryYear(value))) {
    showErrorMessage(errorElement, `Must be a valid expiry year`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // CVC validation
  if (validationFunction === isValidNumber && outputElement === oCvc && (value.length !== 3 || !isValidNumber(value))) {
    showErrorMessage(errorElement, `Must be exactly 3 numbers`);
    inValidBorder(borderElement);
    return false;
  } else {
    validBorder(borderElement);
  }

  // Additional validation for NAME and NUMBER
  if (!validationFunction(value)) {
    showErrorMessage(errorElement, validationFunction === isValidName ? `Wrong format, letters only` : `Wrong format, numbers only`);
    inValidBorder(borderElement);
    return false;
  } else {
    hideErrorMessage(errorElement);

    validBorder(borderElement);
  }

  return true;
}





// Format card number input with spaces
iNumber.addEventListener("input", function (e) {
  const inputVal = e.target.value.trim().replace(/\s+/g, '').replace(/(.{4})/g, '$1 ');
  e.target.value = inputVal;
});

// Helper functions for error messages
function showErrorMessage(element, message) {
  element.innerText = message;
  element.style.display = "block";
}

function hideErrorMessage(element) {
  element.style.display = "none";
}

// Validation functions
function isValidName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

function isValidNumber(number) {
  return /^[\d\s]+$/.test(number);
}

function resetInputs() {
  oName.textContent = 'JANE APPLESEED';
  oNumber.textContent = '0000 0000 0000 0000';
  oMonth.textContent = '00';
  oYear.textContent = '00';
  oCvc.textContent = '000';
}

function resetInputField() {
  iName.value = '';
  iNumber.value = '';
  iMonth.value = '';
  iYear.value = '';
  iCvc.value = '';
  resetBorderStyle();
}

function isValidExpiryYear(year) {
  const numericYear = parseInt(year, 10);
  const currentYear = new Date().getFullYear() % 100;
  return numericYear >= currentYear;
}


function resetBorderStyle() {
  borderStyle.forEach(input => {
    input.style.border = ""; // Reset the border style to the default
  });
}

function validBorder(element) {
  element.style.border = "2px solid #452355";

}

function inValidBorder(element) {
  element.style.border = "2px solid #ff5252";

}


