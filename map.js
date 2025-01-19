function drawDots() {
    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        console.log(streetName + ": " + street.street.getTransitImportanceStr(new Date()));
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = point[0];
            let py = point[1];

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

    console.log("[" + x + ", " + y + "],");

            let dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.left = x + "px";
            dot.style.top = y + "px";
            document.body.appendChild(dot);
    const delta = 15;

    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = point[0];
            let py = point[1];
            if (x >= px - delta && x <= px + delta && y >= py - delta && y <= py + delta) {
                return street;
            }
        }
    }
}


drawDots();
