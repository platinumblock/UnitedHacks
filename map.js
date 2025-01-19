var editing = false;

function drawDots() {
    let canvas = document.getElementById("map");
    let width = canvas.width;
    let height = canvas.height;
    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = Math.round(point[0] / 1388 * width);
            let py = Math.round(point[1] / 750 * height);

            let dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.left = px + "px";
            dot.style.top = py + "px";
            document.body.appendChild(dot);
        }
    }
}
var selectedStreet = null;
var selectedStreetName = null;
var time = new Date(Date.parse("2025-01-01T" + 12 + ":00:00"));
function detect(event) {
    let canvas = document.getElementById("map");
    let width = canvas.width;
    let height = canvas.height;
    let x = event.clientX;
    let y = event.clientY;

    const delta = 15;

    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = Math.round(point[0] / 1388 * width);
            let py = Math.round(point[1] / 750 * height);
            if (x >= px - delta && x <= px + delta && y >= py - delta && y <= py + delta) {
                selectedStreet = street.street;
                selectedStreetName = streetName;
                updateStreet();
                return;
            }
        }
    }
}

function updateStreet(){
    document.getElementById("selectedStreet").innerHTML = selectedStreetName + "&nbsp&nbsp&nbsp<img src = 'highicon.png' id = 'indicatorIcon'>";
    document.getElementById("transitImportance").innerHTML = selectedStreet.getTransitImportanceStr(time) + " <span style = 'color:rgb(50,50,50);font-size:15px;font-weight:400;'>transit importance</span>";
    if(selectedStreet.getTransitImportanceStr(time) == "High"){
        document.getElementById("transitImportance").style.color = "red";
    }
    if(selectedStreet.getTransitImportanceStr(time) == "Medium"){
        document.getElementById("transitImportance").style.color = "orange";
    }
    if(selectedStreet.getTransitImportanceStr(time) == "Low"){
        document.getElementById("transitImportance").style.color = "rgb(50, 206, 45)";
    }
    document.getElementById("peoplePerHour").innerHTML = "People per Hour: <span style = 'color:rgb(50,50,50)'>" + selectedStreet.getPedestriansStr(time) + "</span>";
    document.getElementById("carsPerHour").innerHTML = "Cars per Hour: <span style = 'color:rgb(50,50,50)'>" + selectedStreet.getCarsStr(time) + "</span>";
    document.getElementById("accessibility").innerHTML = "Accessibility: <span style = 'color:rgb(50,50,50)'>" + selectedStreet.getAccessibilityStars(time) + "/5</span>";
}

function detectOverlay(event){
    var x = event.clientX;
    var y = event.clientY;
    var stop = document.createElement("img");
    stop.src = "pin.png";
    stop.classList.add("transitStop");
    stop.style.left = (x - 18) + "px";
    stop.style.top = (y - 32) + "px";
    document.body.appendChild(stop);
}
function changeEditing(){
    if(editing){
        editing = false;
        document.getElementById("edit").style.backgroundColor = "rgb(46, 88, 255)"
        document.getElementById("edit").style.color = "white";
        document.getElementById("edit").innerHTML = "✎&nbsp&nbspEdit";
        document.getElementById("overlay").style.display = "none";
    }else{
        editing = true;
        document.getElementById("edit").style.backgroundColor = "rgb(225,225,225)"
        document.getElementById("edit").style.color = "rgb(46, 88, 255)";
        document.getElementById("edit").innerHTML = "Stop";
        document.getElementById("overlay").style.display = "block";
    }
}

function changeTime(event){
    time = new Date(Date.parse("2025-01-01T" + event.target.value + ":00:00"));
    updateStreet();
}

drawDots();