let currentColor = "black";
let backgroundColor = "white"; // color used to simulate "erasing"
let currentMode = "pen";
let toolSize = 10;

let isMoving = false; // boolean to handle tracking movement of mouse during 
// drawing & erasing

const canvas = document.querySelector("canvas");
const colorPicker = document.getElementById("color-picker");
const penPicker = document.getElementById("pen-square");
const eraserPicker = document.getElementById("eraser-square");

const resetPicker = document.getElementById("reset-square");

const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect(); // Get canvas's position on the page



const canvasMousedown = (e) => {
    isMoving = true;
    const x = e.clientX - rect.left; // Cursor's x-coordinate relative to the canvas
    const y = e.clientY - rect.top; // Cursor's y-coordinate relative to the canvas

    ctx.lineWidth = toolSize;

    switch(currentMode){
        case("pen"):
            ctx.strokeStyle = currentColor;
            break;
        case("eraser"):
            ctx.fillStyle = backgroundColor;
            break;
    }
    ctx.beginPath();
    ctx.moveTo(x,y);

    
}

const canvasMousemove = (e) => {
    if(!isMoving){
        return;
    }
    const x = e.clientX - rect.left; // Cursor's x-coordinate relative to the canvas
    const y = e.clientY - rect.top; // Cursor's y-coordinate relative to the canvas

    switch(currentMode){
        case("pen"):
            ctx.lineTo(x, y);
            break;
        case("eraser"):
            ctx.fillRect(x, y, toolSize, toolSize);
            break;
    }
    canvas.addEventListener("mouseup", (e) => canvasMouseup(e));
};

const canvasMouseup = (e) => {
    const x = e.clientX - rect.left; // Cursor's x-coordinate relative to the canvas
    const y = e.clientY - rect.top; // Cursor's y-coordinate relative to the canvas

    switch(currentMode){
        case("pen"):
            ctx.stroke();
            break;
        case("eraser"):
            break;
    }
    isMoving = false;
};


colorPicker.addEventListener("input", (e) => {
    console.log(e.target.value);
    currentColor = e.target.value;
});

canvas.addEventListener("mousedown", canvasMousedown);
canvas.addEventListener("mousemove", canvasMousemove);
canvas.addEventListener("mouseup", canvasMouseup);


penPicker.addEventListener("click", () => {
    currentMode = "pen";
});

eraserPicker.addEventListener("click", () => {
    currentMode = "eraser";
});

resetPicker.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



