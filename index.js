let currentColor = "black";
let backgroundColor = "white"; // color used to simulate "erasing"
let currentMode = "pencil";
let toolSize = 1;

let isShiftHeldDown = false;

let initialX = 0; // variables to store initial mouse click for calculating rect & circles
let initialY = 0;

let isMoving = false; // boolean to handle tracking movement of mouse during
// drawing & erasing

const canvas = document.querySelector("canvas");

const colorPicker = document.getElementById("color-picker");
const toolsizePicker = document.getElementById("toolsize-square");
const pencilPicker = document.getElementById("pencil-square");
const eraserPicker = document.getElementById("eraser-square");
const rectanglePicker = document.getElementById("rectangle-square");
const ellipsePicker = document.getElementById("ellipse-square");
const bucketPicker = document.getElementById("bucket-square");
const eyedropperPicker = document.getElementById("eyedropper-square");

const resetPicker = document.getElementById("reset-square");
const undoPicker = document.getElementById("undo-square");
const redoPicker = document.getElementById("redo-square");
const exportPicker = document.getElementById("export-square");
const refreshColorsPicker = document.getElementById("refresh-colors-square");

const suggestedColors = document.querySelectorAll(".suggested-color");
const suggestedColorsRgb = document.querySelectorAll(".suggested-color-rgb");

// text
const toolsizeText = document.querySelector("#toolsize-square span");

// for debugging
const currentToolText = document.getElementById("current-tool");

// canvas variables
const ctx = canvas.getContext("2d", { willReadFrequently: true });
// willReadFrequently optional parameter is supposed to optimize for reading frequently...
const rect = canvas.getBoundingClientRect(); // Get canvas's position on the page

// sigh. it sorta sorta helps with the eyedropper problem...
ctx.imageSmoothingEnabled = false;

// scaling for high DPI displays
const scaleFactor = window.devicePixelRatio;

canvas.width = canvas.clientWidth * scaleFactor;
canvas.height = canvas.clientHeight * scaleFactor;
ctx.scale(scaleFactor, scaleFactor);

// make the actual canvas element's imageData have white background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// array to store history of previous & "future" canvas states
const pastArray = []; // should contain a max of 10 items
const futureArray = [];

// array to hold palette swatches
let palette;

function rgbToHex(rgb) {
  // Separate the RGB values
  const values = rgb.match(/\d+/g);

  if (values && values.length === 3) {
    // Convert each value to hexadecimal and pad with zeros
    const r = parseInt(values[0]).toString(16).padStart(2, "0");
    const g = parseInt(values[1]).toString(16).padStart(2, "0");
    const b = parseInt(values[2]).toString(16).padStart(2, "0");

    // Construct the hexadecimal color value
    return `#${r}${g}${b}`;
  }
  // Return a default color in case of an error
  return "#000000"; // Black
}

const canvasMousedown = (e) => {
  isMoving = true;

  const x = e.pageX - rect.left; // Cursor's x-coordinate relative to the canvas, takes into account the wiewport (that's e.pageX) as well
  // so (0,0) would be top left of canvas. the clientX is like (x # pixels right of origin) & rect.left is the same # of pixels right on the page... x & y are positive
  const y = e.pageY - rect.top; // Cursor's y-coordinate relative to the canvas

  initialX = e.pageX - rect.left; // need to calculate the initial click location on canvas coordinate
  initialY = e.pageY - rect.top;

  ctx.lineWidth = toolSize;

  console.log(`E.pagex is ${e.pageX} and E.pagey is ${e.pageY}`);
  console.log(x, y);

  switch (currentMode) {
    case "pencil":
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      break;
    case "rectangle":
      ctx.strokeStyle = currentColor;
      break;
    case "ellipse":
      ctx.strokeStyle = currentColor;
      break;
    case "eraser":
      ctx.fillStyle = backgroundColor;
      break;
    case "eyedropper":
      break;
    }
  
    
  };

const canvasMousemove = (e) => {
  if (!isMoving) {
    return;
  }
  const x = e.pageX - rect.left;
  const y = e.pageY - rect.top;

  const width = x - initialX;
  const height = y - initialY;

  // redefine radiusX & radiusY just for the circle? 
  const radiusX = (initialX - x)/ 2; // the "major axis" radius of the ellipse
  const radiusY = (initialY - y) / 2;

  // for the rectangle & ellipse tools
  if (e.shiftKey) {
    isShiftHeldDown = true;
  } else {
    isShiftHeldDown = false;
  }

  switch (currentMode) {
    case "pencil":
      ctx.lineTo(x, y);
      ctx.stroke();
      break;
    case "rectangle":
      // erase & redraw current canvas
      //ctx.putImageData(pastArray[pastArray.length - 1], 0, 0);
      // draw rectangle
      //ctx.strokeRect(initialX, initialY, width, height);

      if (isShiftHeldDown) {
        ctx.putImageData(pastArray[pastArray.length - 1], 0, 0);
        ctx.strokeRect(
          initialX,
          initialY,
          (width + height) / 2,
          (width + height) / 2
        );
      } else {
        ctx.putImageData(pastArray[pastArray.length - 1], 0, 0);
        // draw rectangle
        ctx.strokeRect(initialX, initialY, width, height);
      }
      break;
    case "ellipse":
        // erase & redraw current canvas
      
      // draw ellipse
      if (isShiftHeldDown) {
        ctx.putImageData(pastArray[pastArray.length - 1], 0, 0);
      ctx.beginPath();
        //const radius = (radiusX + radiusY) / 2;
        ctx.ellipse(
            initialX + radiusX,
            initialY + radiusY,
            Math.abs(radiusX * 2),
            Math.abs(radiusX * 2),
            0, // start angle
            0, // end angle
            2 * Math.PI
          );
      } else {
        ctx.putImageData(pastArray[pastArray.length - 1], 0, 0);
        ctx.beginPath();
        ctx.ellipse(
          initialX + radiusX,
          initialY + radiusY,
          Math.abs(radiusX * 2),
          Math.abs(radiusY * 2),
          0, // start angle
          0, // end angle
          2 * Math.PI
        );
      }
      ctx.stroke();
      break;
    case "eraser":
      ctx.fillRect(x, y, toolSize, toolSize);
      break;
  }
};

const canvasMouseup = (e) => {
  const x = e.pageX - rect.left;
  const y = e.pageY - rect.top;

  const width = x - initialX;
  const height = y - initialY;

  //
  const radiusX = Math.abs(initialX - x) / 2; // the "major axis" radius of the ellipse
  const radiusY = Math.abs(initialY - y) / 2;

  switch (currentMode) {
    case "pencil":
      //ctx.stroke();
      break;
    case "rectangle":
    //   if (isShiftHeldDown) {
    //     ctx.strokeRect(
    //       initialX,
    //       initialY,
    //       (width + height) / 2,
    //       (width + height) / 2
    //     );
    //   } else {
    //     ctx.strokeRect(initialX, initialY, width, height);
    //   }
      break;
    case "ellipse":
        break;
    case "eraser":
      break;
  }
  isMoving = false;

  // we don't want to store ALL the history... just a little
  // so um... last thing in pastArray represents our current state
  if (pastArray.length < 8) {
    pastArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  } else {
    // remove the first (oldest) element in pastArray
    pastArray.splice(0, 1);
    // add the current canvas to pastArray at the very end
    pastArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  futureArray.length = 0; // if you make a new change to canvas there won't be future history anymore
};

const removeOtherTools = () => {
    pencilPicker.classList.remove("active-tool");
    eraserPicker.classList.remove("active-tool");
    rectanglePicker.classList.remove("active-tool");
    ellipsePicker.classList.remove("active-tool");
    bucketPicker.classList.remove("active-tool");
    eyedropperPicker.classList.remove("active-tool");
}

colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
});

// INITIALIZATION STUFF

canvas.addEventListener("mousedown", canvasMousedown);
canvas.addEventListener("mousemove", canvasMousemove);
canvas.addEventListener("mouseup", canvasMouseup);

toolsizePicker.addEventListener("click", (e) => {
  toolSize = e.target.value;
  toolsizeText.textContent = toolSize;
});

pencilPicker.addEventListener("click", (e) => {
  currentMode = "pencil";
  currentToolText.textContent = currentMode; // TO REMOVE
  removeOtherTools();
  pencilPicker.classList.add("active-tool");
});

eraserPicker.addEventListener("click", (e) => {
  currentMode = "eraser";
  currentToolText.textContent = currentMode; // TO REMOVE
  removeOtherTools();
  eraserPicker.classList.add("active-tool");
});

rectanglePicker.addEventListener("click", (e) => {
  currentMode = "rectangle";
  currentToolText.textContent = currentMode; // TO REMOVE
  removeOtherTools();
  rectanglePicker.classList.add("active-tool");
});

ellipsePicker.addEventListener("click", (e) => {
  currentMode = "ellipse";
  currentToolText.textContent = currentMode; // TO REMOVE
  removeOtherTools();
  ellipsePicker.classList.add("active-tool");
});

bucketPicker.addEventListener("click", (e) => {
  currentMode = "bucket";
  currentToolText.textContent = currentMode; // TO REMOVE
  removeOtherTools();
  bucketPicker.classList.add("active-tool");
});

eyedropperPicker.addEventListener("click", (e) => {
    currentMode = "eyedropper";
    currentToolText.textContent = currentMode; // TO REMOVE
    removeOtherTools();
    eyedropperPicker.classList.add("active-tool");

    const resultElement = document.getElementById("result");
  
    if (!window.EyeDropper) {
      console.log("Your browser doesn't support Eyedropper");
      // DO FIXES FOR FIREFOX & SAFARI *sob* *sob*
      // if it clicks over the canvas, then change color to that pixel's color
    }else{
    //     const pixelData = ctx.getImageData(x, y, 1, 1).data;
    //     currentColor = `rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]}, ${pixelData[3]})`;
    //     colorPicker.value = rgbToHex(
    //     `${pixelData[0]},${pixelData[1]},${pixelData[2]}`
    //   );
    //   // input for type="color" must be of format #rrggbb
    //   console.log(currentColor);
    }

    const eyeDropper = new EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        //resultElement.textContent = result.sRGBHex; // TO REMOVE
        currentColor = result.sRGBHex;
        colorPicker.value = result.sRGBHex;
        //resultElement.style.backgroundColor = result.sRGBHex; // TO REMOIVE
      })
      .catch((e) => {
        //resultElement.textContent = e; // TO REMOVE
        currentColor = result.sRGBHex;
      });
      
});

undoPicker.addEventListener("click", () => {
  // TODO
  // working but it won't go back to the last 2 actions...
  // "dumb" fix: when pastArray.len = 1, do it... manually
  console.log("clicked on undo");

  // technically i fixed it...
  // IT"S SO UGLY *SOB*

  if (pastArray.length > 1) {
    // lastPast / last item of pastArray is the current state
    // the 2nd-to-last item is what we want to see
    ctx.putImageData(pastArray[pastArray.length - 2], 0, 0);
    const lastPast = pastArray.pop();
    futureArray.unshift(lastPast);
  } else {
    console.log("no more past history");
  }
});

redoPicker.addEventListener("click", () => {
  // move the first element of futureArray to the end of pastArray
  console.log("clicked on redo");

  if (futureArray.length === 0) {
    // no future history, do nothing
    console.log("No more future history");
    return;
  } else {
    ctx.putImageData(futureArray[0], 0, 0);
    const firstFuture = futureArray.shift();
    // removes futureArray's first element
    pastArray.push(firstFuture);
  }
});

exportPicker.addEventListener("click", (e) => {
  let canvasUrl = canvas.toDataURL("image/png", 0.5);
  // .toDataURL takes in image type & a number btwn 0 & 1
  // for image quality (optional)
  console.log(canvasUrl);
  const downloadEl = document.createElement("a");
  downloadEl.href = canvasUrl;
  downloadEl.download = "image.png";
  // click on anchor element so we can download it
  downloadEl.click();
  downloadEl.remove();
});

resetPicker.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pastArray.length = 0;
  futureArray.length = 0;
  currentMode = "pencil";
  currentToolText.textContent = currentMode; // TO REMOVE
});

// Generate random palette
const generatePalette = () => {
  const url = "http://colormind.io/api/";
  const data = {
    model: "default",
  };

  const http = new XMLHttpRequest();
  // can retrieve stuff from server without refreshing page
  // AJAX

  http.open("POST", url, true);
  http.send(JSON.stringify(data));

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      // state of 4, requested finished & response is ready
      // status is OK
      palette = JSON.parse(http.responseText).result;

      for (let i = 0; i < palette.length; i++) {
        //suggestedColorsRgb[i].textContent = palette[i];
        suggestedColors[
          i
        ].style.background = `rgb(${palette[i][0]},${palette[i][1]},${palette[i][2]})`;

        suggestedColors[i].addEventListener("click", () => {
            currentColor = suggestedColors[i].style.background;
            colorPicker.value = rgbToHex(currentColor);
        });
      }
      console.log(palette);
    }
  };
};

refreshColorsPicker.addEventListener("click", () => generatePalette());

// INITIALIZATION

document.addEventListener("DOMContentLoaded", function () {
    // making sure this only happens once everything in the DOM is loaded
    generatePalette();
});

// add blank canvas to pastArray
pastArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
