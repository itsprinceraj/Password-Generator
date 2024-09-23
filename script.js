// Handle Slider Control and Display Password Length
let lengthDisplay = document.querySelector("[lengthDisplay]");
// console.log(lengthDisplay);
let slider = document.querySelector("input[type=range]");
// console.log(slider)

//  write a hadleSlider function .
let passwordLength = 8;
function handleSlider() {
  slider.value = passwordLength; // input ke value me defualt password ki length dal do
  lengthDisplay.innerText = passwordLength;
}

//  call handleSlider function
handleSlider();

slider.addEventListener("input", (event) => {
  // we can also use chang event here , but it wont update the UI value dynamically in every render cycle .
  passwordLength = event.target.value; // fetch value from e.target
  // console.log(passwordLength);
  handleSlider(); // isse kyu call karna hai ? --- cause by this event Listener , we are assigning the e.target value of slider input into the passwordLength variable , but not into the slider value .   ---- by calling hadleSlider() , we are assigning the value to the slider
});

// --------------------------------------

// Generate Random Letters and Number and Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function generateRandom(min, max) {
  const randNum = Math.floor(Math.random() * (max - min)) + min; // here adding min is neccessary cause , if we dont add the range then it would become (0 to max - min) not (min to max )
  // console.log(randNum);
  return randNum;
}

// Random Lowercase Letter
function generateRandomLowercase() {
  return String.fromCharCode(generateRandom(97, 123)); // from ascii code 97 is for 'a' and 123 is for 'z'

  // here fromCharCode() is method of String in js which converts integer to its mapped ascii code;
}

// Random Lowercase Letter
function generateRandomUppercase() {
  return String.fromCharCode(generateRandom(65, 91)); // form ascii code 65 is for 'A' and 91 is for 'Z'
}

// Random Number
function generateRandomNumber() {
  return generateRandom(1, 10);
}

// Generate Symbol
function generateRandomSymbol() {
  let index = generateRandom(0, symbol.length); // get index of the symbol
  return symbol[index];
}

// console.log(generateRandomLowercase());
// console.log(generateRandomUppercase());
// console.log(generateRandomNumber());
// console.log(generateRandomSymbol());

// --------------------------------------

// Strength Color Based on Password
let indicator = document.querySelector(".indicator");

// Set Indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Default Indicator
setIndicator("#ccc"); // by default grey indicator is set

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasNumber = true;
  if (symbols.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0"); // if length of the password is greater than 8 then , show green indicator
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6 // if length of the password is greater thean 6 then show yellow indicator
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// -----------------------------------

// Copy Message
let copyMessage = document.querySelector("[copyMessage]");
let copyBtn = document.querySelector(".copyBtn");
let passwordDisplay = document.querySelector("input[passwordDisplay]");

// Why we use it - https://stackoverflow.com/questions/45071353/copy-text-string-on-click#:~:text=15-,Use%20the%20Clipboard,-API!

// ----------------------------  is it necessary to use async code?

// ans --- Yes , cause clipboard api method of navigator is async in nature;

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); // this is used to copy a value to clipboard

    copyMessage.innerText = "Copied";
  } catch (e) {
    // alert("Something went wrong in CopyContent");
    copyMessage.innerText = "Failed";
  }

  // copyMessage.classList.add('active');

  setTimeout(() => {
    copyMessage.innerText = "";
  }, 1000);
}

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent(); // copy if value is present
});

// ------------------------------------

// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// Shuffle the array randomly - Fisher Yates Method
// function shuffle(array) {
//   // steps to apply fisher-yats (aka knuth shuffle)-----------------

//   // ***************************************************************************************

//   // 1. start from n-1 element and iterate to 2nd element . i.e: from last index to the index = [1]
//   for (let i = array.length - 1; i > 0; i--) {
//     // 2. for each element of i generate a random index j. ex: such that-- 0 <=j <= i;
//     const j = Math.floor(Math.random() * (i + 1));

//     // 3. Swap the element at index i with the element at index j.

//     // 4. Continue until the entire array has been shuffled.
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
//   let str = "";
//   array.forEach((el) => (str += el));
//   return str;
// }

//  Fisher-yate algo for shuffling
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // +1 is added cause we have to met this criteria : 0 <= j <= i;
    const temp = arr[i]; // storring arr[i] so that we can easilt swap it with j;
    arr[i] = arr[j]; // now we have swapped it , and can update the value of j with arr[i];
    arr[j] = temp; // cause temp has value of arr[i]
  }

  let str = "";
  arr.forEach((element) => (str += element));
  return str;
}

// Password Generate

// By Default UpperCase Checked
// uppercase.checked = true;

let checkBoxes = document.querySelectorAll("input[type=checkbox]");
// console.log(checkBoxes);

let checkCount = 0;

// CheckBox - Handle

// why we are tracking check count here ?
// ans == cause user checked 3 checkbox and want to generate password of length 2, then it is non-sense basically , that's why the password length must be changed to checkcount ;

function handleCheckBoxChange() {
  checkCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

checkBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

let password = "";
let generateBtn = document.querySelector("#generateBtn");

//  generate password function
function generatePass() {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Remove Previous Password
  password = "";

  let arrayOfCheckedFunction = [];

  if (uppercase.checked) arrayOfCheckedFunction.push(generateRandomUppercase);
  if (lowercase.checked) arrayOfCheckedFunction.push(generateRandomLowercase);
  if (numbers.checked) arrayOfCheckedFunction.push(generateRandomNumber);
  if (symbols.checked) arrayOfCheckedFunction.push(generateRandomSymbol);

  // Compulsory Addition
  for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
    password += arrayOfCheckedFunction[i](); // calling the function which we have pushed into the array.
  }

  // console.log("Password: " + password);

  // Additional addition
  for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
    let randIndex = generateRandom(0, arrayOfCheckedFunction.length);
    password += arrayOfCheckedFunction[randIndex](); // call the funciton that is inside the array , with random index to match the length of the password with the actual password length;
  }
  // console.log("Password: " + password);

  // Shuffle Password
  password = shuffle(Array.from(password)); // created a new Array from string and shuffled it ;
  passwordDisplay.value = password;
  calcStrength();
}

// apply event listener
generateBtn.addEventListener("click", generatePass);
