//global slections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors; //we created variable!

//eventlistners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

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

    //initialize oloroize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input"); //now w can access all sliders
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
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

function colorizeSliders(color, hue, brightness, saturation) {
  //scale saturation
  const noSat = color.set("hsl.s", 0); //we take color.set functionality from chromajs
  const fullSat = color.set("hsl.s", 1); //hsl.s for saturation
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //scale brightness
  const midbright = color.set("hsl.l", 0.5); //hsl.l for brightness ---> we give only mid cu satrt and end we know are white and black.
  const scaleBright = chroma.scale(["black", midbright, "white"]);

  //update input colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )} , ${scaleSat(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = colorDivs[index].querySelector("h2").innerText;

  //let set background color by sliders
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  //let add it to background
  colorDivs[index].style.backgroundColor = color;
}
randomColors();
