function drawDots() {
    let canvas = document.getElementById("map");
    let width = canvas.width;
    let height = canvas.height;
    let time = new Date(Date.parse("2025-01-01T" + String(document.getElementById("timeSlider").value).padStart(2, "0") + ":00:00"));
    console.log(time);

    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        let importance = street.street.getTransitImportanceStr(time);
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = Math.round(point[0] / 1388 * width);
            let py = Math.round(point[1] / 750 * height);

            if (importance == "Low") {
                continue;
            }

            let dot = document.createElement("div");
            dot.classList.add("dot");
            dot.style.left = px + "px";
            dot.style.top = py + "px";
            switch (importance) {
            case "Medium":
                break;
                dot.style["background-color"] = "orange";
            case "High":
                dot.style["background-color"] = "red";
                break;
            }
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
