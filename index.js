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

const resetPicker = document.getElementById("reset-square");
const undoPicker = document.getElementById("undo-square");
const redoPicker = document.getElementById("redo-square");
const exportPicker = document.getElementById("export-square");

// text
const toolsizeText = document.querySelector("#toolsize-square span");

// for debugging
const currentToolText = document.getElementById("current-tool");

// canvas variables
const ctx = canvas.getContext("2d", {willReadFrequently: true});
// willReadFrequently optional parameter is supposed to optimize for reading frequently...
const rect = canvas.getBoundingClientRect(); // Get canvas's position on the page

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

const canvasMousedown = (e) => {
    isMoving = true;

    const x = e.clientX - rect.left; // Cursor's x-coordinate relative to the canvas, takes into account the wiewport (that's e.clientX) as well
    // so (0,0) would be top left of canvas. the clientX is like (x # pixels right of origin) & rect.left is the same # of pixels right on the page... x & y are positive
    const y = e.clientY - rect.top; // Cursor's y-coordinate relative to the canvas

    initialX = e.clientX - rect.left; // need to calculate the initial click location on canvas coordinate
    initialY = e.clientY - rect.top;

    ctx.lineWidth = toolSize;

    switch(currentMode){
        case("pencil"):
            ctx.strokeStyle = currentColor;
            ctx.beginPath(); 
            ctx.moveTo(x,y);
            break;
        case("rectangle"):
            ctx.strokeStyle = currentColor;
            break;
        case("ellipse"):
            ctx.strokeStyle = currentColor;
            ctx.beginPath();
        case("eraser"):
            ctx.fillStyle = backgroundColor;
            break;
    }
}

const canvasMousemove = (e) => {
    if(!isMoving){
        return;
    }
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 


    //const currentX = e.pageX - rect.left;
    //const currentY = e.pageY - rect.top;
    //const width = currentX - initialX;
    //const height = currentY - initialY;

    // for the rectangle & ellipse tools
    if(e.shiftKey){
        isShiftHeldDown = true;
    }else{
        isShiftHeldDown = false;
    }

    switch(currentMode){
        case("pencil"):
            ctx.lineTo(x, y);
            break;
        case("rectangle"):
            break;
        case("ellipse"):
            break;
        case("eraser"):
            ctx.fillRect(x, y, toolSize, toolSize);
            break;
    }

};

const canvasMouseup = (e) => {
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 

    //const currentX = e.pageX - rect.left;
    //const currentY = e.pageY - rect.top;
    const width = x - initialX;
    const height = y - initialY;

    // 
    const radiusX = Math.abs(initialX - x)/2; // the "major axis" radius of the ellipse
    const radiusY = Math.abs(initialY - y)/2;

    switch(currentMode){
        case("pencil"):
            ctx.stroke();
            break;
        case("rectangle"):
            if(isShiftHeldDown){
                ctx.strokeRect(initialX, initialY, (width+height)/2, (width+height)/2);
            }else{
                ctx.strokeRect(initialX, initialY, width, height);
            }
            break;
        case("ellipse"):
            if(isShiftHeldDown){
                ctx.arc(initialX + radiusX, initialY + radiusY, radiusX, 0, 2 * Math.PI, false);
            }else{
                ctx.ellipse(initialX + radiusX, initialY + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI, true);
            }
            ctx.stroke();
        case("eraser"):
            break;
    }
    isMoving = false;
    // we don't want to store ALL the history... just a little
    // so um... last thing in pastArray represents our current state
    if(pastArray.length < 8){
        pastArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }else{
        // remove the first (oldest) thing in pastArray
        pastArray.splice(0, 1); 
        // add the current canvas to pastArray at the very end
        pastArray.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    }
    futureArray.length = 0; // if you make a new change to canvas there won't be future history anymore
    
};


colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
});

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
});

eraserPicker.addEventListener("click", (e) => {
    currentMode = "eraser";
    currentToolText.textContent = currentMode; // TO REMOVE
});

rectanglePicker.addEventListener("click", (e) => {
    currentMode = "rectangle";
    currentToolText.textContent = currentMode; // TO REMOVE
});

ellipsePicker.addEventListener("click", (e) => {
    currentMode = "ellipse";
    currentToolText.textContent = currentMode; // TO REMOVE
});

bucketPicker.addEventListener("click", (e) => {
    currentMode = "bucket";
    currentToolText.textContent = currentMode; // TO REMOVE
});

undoPicker.addEventListener("click", () => {
    // TODO
    // working but it won't go back to the last 2 actions...
    // "dumb" fix: when pastArray.len = 1, do it... manually
    console.log("clicked on undo");

    // technically i fixed it... 
    // IT"S SO UGLY *SOB* 

    if(pastArray.length === 1){
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        futureArray.unshift(pastArray.pop());
    }else if(pastArray.length > 1){
        // lastPast / last item of pastArray is the current state
        // the 2nd-to-last item is what we want to see
        ctx.putImageData(pastArray[pastArray.length - 2], 0, 0);
        const lastPast = pastArray.pop();
        futureArray.unshift(lastPast); 
    }else{
        console.log("no more past history");
    }
});

redoPicker.addEventListener("click", () => {
    // move the first element of futureArray to the end of pastArray
    console.log("clicked on redo");

    if(futureArray.length === 0){ // no future history, do nothing
        console.log("No more future history");
        return;
    }else{
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
    const downloadEl = document.createElement('a');
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
});


// Generate random palette

const generatePalette = () => {
    const url = "http://colormind.io/api/";
    const data = {
        model : "default"
    }

    const http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.send(JSON.stringify(data));

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            palette = JSON.parse(http.responseText).result;
            console.log(palette);
        }
    }
}

generatePalette();






