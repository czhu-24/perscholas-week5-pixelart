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

// text

const toolsizeText = document.querySelector("#toolsize-square span");

// for debugging
const currentToolText = document.getElementById("current-tool");

//

const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect(); // Get canvas's position on the page

// scaling for high DPI displays
const scaleFactor = window.devicePixelRatio;

canvas.width = canvas.clientWidth * scaleFactor;
canvas.height = canvas.clientHeight * scaleFactor;
ctx.scale(scaleFactor, scaleFactor);

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
            ctx.fillRect(x, y, 5, 5);
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

resetPicker.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



