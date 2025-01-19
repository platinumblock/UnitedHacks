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


function detect(event) {
    let x = event.clientX;
    let y = event.clientY;
    const delta = 15;
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
            if (x >= px - delta && x <= px + delta && y >= py - delta && y <= py + delta) {
                console.log(streetName);
                return street;
            }
        }
    }
}


drawDots();
