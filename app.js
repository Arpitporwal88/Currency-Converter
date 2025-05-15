const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_mY1MB6DP086S7ENJvvdj9TwVI7gvz9lqdO1yn6DQ";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const validateInput = () => {
  const amtVal = amountInput.value.trim();
  const isValid = !isNaN(amtVal) && Number(amtVal) > 0;
  if (!isValid) {
    msg.innerText = "Invalid input. Please enter a valid amount.";
    msg.classList.add("error"); // Add error styling
    return false;
  }
  msg.classList.remove("error"); // Remove error styling if valid
  msg.innerText = ""; // Clear the message
  return true;
};

const updateExchangeRate = async () => {
  if (!validateInput()) return;

  let amtVal = amountInput.value.trim();
  const URL = `${BASE_URL}?apikey=${API_KEY}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rate.");
    let data = await response.json();
    let rate = data.data[toCurr.value] / data.data[fromCurr.value];

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    msg.classList.remove("error"); // Ensure no error class is present for valid results
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again later.";
    msg.classList.add("error"); // Add error styling for API errors
    console.error(error);
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// Load the saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
  updateButtonState(savedTheme);
}

// Toggle theme and save state
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Save the theme state in localStorage
  localStorage.setItem('theme', isDarkMode ? 'dark-mode' : '');

  // Update the button's text and icon
  updateButtonState(isDarkMode ? 'dark-mode' : '');
});

// Update the button text and icon
function updateButtonState(theme) {
  if (theme === 'dark-mode') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeIcon.style.color = 'white';
    themeText.style.color = 'white'; 
    themeText.textContent = 'Light';


  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    themeText.textContent = 'Dark';
    themeIcon.style.color = 'black';
    themeText.style.color = 'black';
  }
}
