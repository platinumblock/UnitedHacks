import Street from "./traffic.js";


const CITIES = {
    mountainView: {
        elCamino:  new Street(35, 7, false, 2,   false, 2, true,  750,  10000, [6, 7, 8, 9, 11, 12, 13, 17, 18, 19, 20]),
        castro:    new Street(25, 4, false, 2,   true,  2, false, 2000, 3000,  [8, 11, 12, 17, 18, 21, 22, 23]),
        miramonte: new Street(35, 5, false, 1.5, false, 2, false, 1000, 7000,  [7, 8, 11, 12, 13, 17, 18]),
        calderon:  new Street(25, 2, false, 2,   false, 2, false, 900,  6000,  [8, 12, 18])
    }
}


function print(s) {
    let time = new Date();
    console.log(s.getTransitImportanceStr(time) + " transit importance");
    console.log("People per Hour: " + s.getPedestriansStr(time));
    console.log("Cars per Hour:   " + s.getCarsStr(time));
    console.log("Accessibility:   " + s.getAccessibilityStars(time));
}


print(CITIES.mountainView.elCamino);
print(CITIES.mountainView.castro);
print(CITIES.mountainView.miramonte);
print(CITIES.mountainView.calderon);
