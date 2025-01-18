var points = []
function detect(event){
    var x = event.clientX;
    var y = event.clientY;
    var dot = document.createElement("div");
    dot.classList.add("dot");
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    points.push([x, y])
    console.log(points);
    document.body.appendChild(dot);
}