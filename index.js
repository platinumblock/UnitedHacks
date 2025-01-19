for(let i = -1; i < 100; i += 2.5){
    var line = document.createElement("div");
    line.classList.add("verticalline");
    line.style.left = i + "%";
    document.body.appendChild(line);
}
for(let i = -1; i < 100; i += 5.4){
    var line = document.createElement("div");
    line.classList.add("horizontalline");
    line.style.top = i + "%";
    document.body.appendChild(line);
}