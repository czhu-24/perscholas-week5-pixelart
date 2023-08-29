let currentColor = "black";
let backgroundColor = "white"; // color used to simulate "erasing"
let currentMode = "pencil";
let toolSize = 10;

let isMoving = false; // boolean to handle tracking movement of mouse during 
// drawing & erasing

const canvas = document.querySelector("canvas");

const colorPicker = document.getElementById("color-picker");
const pencilPicker = document.getElementById("pencil-square");
const eraserPicker = document.getElementById("eraser-square");
const rectanglePicker = document.getElementById("rectangle-square");
const resetPicker = document.getElementById("reset-square");

// for debugging
const currentToolText = document.getElementById("current-tool");

const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect(); // Get canvas's position on the page



const canvasMousedown = (e) => {
    isMoving = true;

    const x = e.clientX - rect.left; // Cursor's x-coordinate relative to the canvas
    const y = e.clientY - rect.top; // Cursor's y-coordinate relative to the canvas

    ctx.lineWidth = toolSize;

    switch(currentMode){
        case("pencil"):
            ctx.strokeStyle = currentColor;
            ctx.beginPath(); 
            ctx.moveTo(x,y);
            break;
        case("rectangle"):
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
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 

    switch(currentMode){
        case("pencil"):
            ctx.lineTo(x, y);
            break;
        case("eraser"):
            ctx.fillRect(x, y, toolSize, toolSize);
            break;
    }

};

const canvasMouseup = (e) => {
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 

    switch(currentMode){
        case("pencil"):
            ctx.stroke();
            break;
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

resetPicker.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



