let color = "red";

const allSquares = document.querySelectorAll("canvas");
const colorpicker = document.getElementById("color-picker");
const pen = document.getElementById("pen-square");
const eraser = document.getElementById("eraser-square");

const drawSquare = (i) => {
    const ctx = allSquares[i].getContext("2d");
    ctx.fillStyle = color;
    // Draw the rectangle to cover whole canvas
    ctx.fillRect(0, 0, 100, 100);
}

// for each square, add an event listener to it
for(let i = 0; i < allSquares.length; i++){
    // apparently, the default sizing for a Canvas' coordinate system is 150 px wide & 300 px height... which stretches stuff out
    // oh & the width & height attributes of the DOM element controls the size of the coordinate system
    allSquares[i].width = 100;
    allSquares[i].height = 100;
    allSquares[i].addEventListener("click", (e) => {
        const ctx = allSquares[i].getContext("2d");
        ctx.fillStyle = color;

        // Draw the black rectangle to cover whole canvas
        ctx.fillRect(0, 0, 100, 100);
    })
}

colorpicker.addEventListener("input", (e) => {
    console.log(e.target.value);
    color = e.target.value;
});

pen.addEventListener("click", )

