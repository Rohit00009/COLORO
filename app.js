//global slections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors; //we created variable!

//FUNCTIONS

//color generator
function generateHex() {
  //   const letters = "#123456789ABCDEF";
  //   let hash = "#";
  //   // Generate the remaining 6 characters of the hexadecimal color code
  //   for (let i = 0; i < 6; i++) {
  //     // Pick a random index from the 'letters' string
  //     hash += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return hash;

  //but this can gives us color error so
  //let use chromajs instead of above
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0]; //0 index get 1st children element of colorsdiv(.color) means hex
    const randomColor = generateHex();

    //adding color to background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    //check for contrast
    checkTextContrast(randomColor, hexText);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance(); //luminance is a method
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

randomColors();
