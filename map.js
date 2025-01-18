function detect(event) {
    let x = event.clientX;
    let y = event.clientY;
    const delta = 15;

    for (let streetName in CITIES.mountainView) {
        let street = CITIES.mountainView[streetName];
        let points = street.points;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let px = point[0];
            let py = point[1];
            if (x >= px - delta && x <= px + delta && y >= py - delta && y <= py + delta) {
                console.log(street);
                return street;
            }
        }
    }
}
