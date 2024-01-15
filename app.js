//global slections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors; //we created variable!

//eventlistners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUi(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});
adjustButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
closeAdjustments.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
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
  //do initial colors
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0]; //0 index get 1st children element of colorsdiv(.color) means hex
    const randomColor = generateHex();
    //add it to array
    initialColors.push(chroma(randomColor).hex());

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
  //reset inputs
  resetInputs();

  //check for button contrast
  
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

  // const bgColor = colorDivs[index].querySelector("h2").innerText; --> cuz this will give oy bak to white and cant get og color
  const bgColor = initialColors[index]; //by this we always has acces to og one

  //let set background color by sliders
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  //let add it to background
  colorDivs[index].style.backgroundColor = color;

  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUi(index) {
  const activeDiv = colorDivs[index]; //selectig color from backgrond
  const color = chroma(activeDiv.style.backgroundColor); //and adding it to chroma
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex(); //so we can convert it to hex
  //check contrast
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select(); //we select it
  document.execCommand("copy"); //and we copy it
  document.body.removeChild(el);
  //popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove("active");
}

randomColors();
