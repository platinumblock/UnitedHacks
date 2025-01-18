for(let i = -2; i < 1920; i += 30){
    var line = document.createElement("div");
    line.classList.add("verticalline");
    line.style.left = i + "px";
    document.body.appendChild(line);
}
for(let i = -2; i < 1080; i += 30){
    var line = document.createElement("div");
    line.classList.add("horizontalline");
    line.style.top = i + "px";
    document.body.appendChild(line);
}