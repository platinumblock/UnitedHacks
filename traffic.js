const NUM_BUSY_SAMPLES = 1000;


class Street {

    /**
     * Constructs a new {@code Street} object representing environmental conditions that impact
     * traffic.
     *
     * @param speedLimit          the posted speed limit in mph.
     * @param numLanes            the number of lanes (including turning) in all directions.
     * @param isOneWay            whether the car traffic is one-way.
     * @param numSidewalks        the number of sidewalks in all directions on the road.
     * @param sidewalksSeparated  whether sidewalks are far from the road.
     * @param numBikeLanes        the number of bikes lanes in all directions on the road.
     * @param bikeLanesProtected  whether bike lanes are protected.
     * @param busyTimes           list of hours in the day that are busiest (e.g. 12.5, 16, 8).
     */
    constructor(speedLimit,
                numLanes,
                isOneWay,
                numSidewalks,
                sidewalksSeparated,
                numBikeLanes,
                bikeLanesProtected,
                maxPeople,
                maxCars,
                busyTimes)
    {
        this.speedLimit = speedLimit;
        this.numLanes = numLanes;
        this.isOneWay = isOneWay;
        this.numSidewalks = numSidewalks;
        this.sidewalksSeparated = sidewalksSeparated;
        this.numBikeLanes = numBikeLanes;
        this.bikeLanesProtected = bikeLanesProtected;
        this.maxPeople = maxPeople;
        this.maxCars = maxCars;
        this.busyTimes = busyTimes;

        this.busyHistogram = this.buildBusyHistogram();

        this.numTransitStops = 0;
    }


    getBusyTime(rushPeaks, rushWidth, resolution = 1000) {
        const step = 24 / resolution;
        const prob = Array.from({ length: resolution + 1 }, (_, i) => {
            const x = i * step;
            return rushPeaks.reduce((sum, peak) => {
                const distance = x - peak;
                return sum + Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(rushWidth, 2)));
            }, 0);
        });

        const total = prob.reduce((a, b) => a + b, 0);
        const normalizedProb = prob.map(p => p / total);

        const cumulative = [];
        normalizedProb.reduce((sum, p, i) => {
            cumulative[i] = sum + p;
            return cumulative[i];
        }, 0);

        const limit = Math.random();
        const index = cumulative.findIndex(cdf => limit <= cdf);

        return index * step;
    }


    buildBusyHistogram() {
        // Define bins for time intervals
        let timeStep = 0.25;
        let hoursPerDay = 24;
        let times = [];
        for (let i = 0; i < hoursPerDay; i += timeStep){
            times.push({
                minTime: i,
                maxTime: i + timeStep,
                count: 0
            });
        }

        // Categorize data into the times histogram/bins
        for (let i = 0; i < NUM_BUSY_SAMPLES; i++){
            var sample = this.getBusyTime(this.busyTimes, 2);
            for (let j = 0; j < times.length; j++){
                var time = times[j];
                if (sample > time.minTime && sample <= time.maxTime){
                    time.count++;
                    break;
                }
            }
        }

        return times;
    }


    getDecimalTime(time) {
        return time.getHours() + time.getMinutes() / 60 + time.getSeconds() / 3600;
    }


    getPercentBusy(time) {
        let decimalTime = this.getDecimalTime(time);
        let busyAtTime = 0.0;
        for (let i = 0; i < this.busyHistogram.length; i++){
            var time = this.busyHistogram[i];
            if (decimalTime > time.minTime && decimalTime <= time.maxTime){
                busyAtTime = time.count;
                break;
            }
        }
        return busyAtTime / NUM_BUSY_SAMPLES;
    }


    /**
     * Adds a transit stop along this street.
     */
    addTransitStop() {
        this.numTransitStops++;
    }


    /**
     * Removes a trransit stop from this street.
     */
    deleteTransitStop() {
        this.numTranitStops = Math.max(0, this.numTransitStops--);
    }


    /**
     * Number of pedestrians at the current time (per hour) for the street.
     *
     * @param time  the current time (a Date object).
     *
     * @return the number of pedestrians currently on the street.
     */
    getPedestrians(time) {
        let percentBusy = this.getPercentBusy(time);
        let speedPenalty = 30.0 / this.speedLimit;
        let lanesPenalty = 3.0 / this.numLanes;
        let oneWayBonus = this.isOneWay ? 1.05 : 0.95;
        let sidewalksBonus = this.numSidewalks / 1.5 * (this.sidewalksSeparated ? 1.05 : 0.95);
        let bikeLanesBonus = this.numBikeLanes / 1.5 * (this.bikeLanesProtected ? 1.05 : 0.95);

        let penalties = speedPenalty * lanesPenalty;
        let bonuses = oneWayBonus * sidewalksBonus * bikeLanesBonus;
        return Math.round(3 * this.maxPeople * percentBusy * penalties * bonuses);
    }


    getPedestriansStr(time) {
        let pedestrians = this.getPedestrians(time);
        if (pedestrians >= 1000) {
            return "High";
        }
        else if (pedestrians >= 500) {
            return "Medium";
        }
        else {
            return "Low";
        }
    }


    /**
     * Number of cars at the current time (per hour) for the street.
     *
     * @param time  the current time (a Date object).
     *
     * @return the number of cars currently on the street.
     */
    getCars(time) {
        let percentBusy = this.getPercentBusy(time);
        let speedBonus = this.speedLimit / 30.0;
        let lanesBonus = this.numLanes / 3.0;
        let oneWayPenalty = !this.isOneWay ? 1.05 : 0.95;
        let sidewalksPenalty = 1.5 / this.numSidewalks * (!this.sidewalksSeparated ? 1.05 : 0.95);
        let bikeLanesPenalty = 1.5 / this.numBikeLanes * (!this.bikeLanesProtected ? 1.05 : 0.95);

        let penalties = oneWayPenalty * sidewalksPenalty * bikeLanesPenalty;
        let bonuses = speedBonus * lanesBonus;
        return Math.round(3 * this.maxCars * percentBusy * penalties * bonuses);
    }


    getCarsStr(time) {
        let cars = this.getCars(time);
        if (cars >= 1000) {
            return "High";
        }
        else if (cars >= 500) {
            return "Medium";
        }
        else {
            return "Low";
        }
    }


    /**
     * The accessibility of the street between 0 and 1.
     *
     * @param time  the current time (a Date object).
     *
     * @return the street accesibility.
     */
    getAccessibility(time) {
        return 0.1 + 100 * this.numTransitStops / this.getCars(time);
    }


    getAccessibilityStars(time) {
        let accessibility = Math.max(0.0, Math.min(1.0, this.getAccessibility(time)));
        return Math.round(5 * accessibility);
    }


    /**
     * The transit importance of the street between 0 and 1.
     *
     * @param time  the current time (a Date object).
     *
     * @return the transit importance.
     */
    getTransitImportance(time) {
        let traffic = this.getCars(time) + this.getPedestrians(time);
        let maxTraffic = this.maxCars + this.maxPeople;
        console.log(traffic + ", " + maxTraffic);
        console.log(this.getCars(time));
        console.log(this.getPedestrians(time));
        return 10 * traffic / maxTraffic;
    }


    getTransitImportanceStr(time) {
        let transitImportance = this.getTransitImportance(time);
        if (transitImportance >= 0.70) {
            return "High";
        }
        else if (transitImportance > 0.50) {
            return "Medium";
        }
        else {
            return "Low";
        }
    }

}



const CITIES = {
    mountainView: {
        "El Camino": {
            street: new Street(35, 6, false, 1.75, false, 2, false,  1250, 10000, [6, 7, 8, 9, 11, 12, 13, 17, 18, 19, 20, 21, 22]),
            points: [
                [1384, 688],
                [1371, 681],
                [1355, 672],
                [1341, 663],
                [1327, 656],
                [1311, 647],
                [1297, 637],
                [1282, 629],
                [1267, 618],
                [1250, 608],
                [1232, 598],
                [1215, 585],
                [1196, 574],
                [1180, 565],
                [1164, 555],
                [1149, 545],
                [1130, 535],
                [1114, 523],
                [1100, 514],
                [1084, 503],
                [1066, 491],
                [1050, 482],
                [1035, 472],
                [1020, 463],
                [1005, 453],
                [990, 445],
                [976, 437],
                [962, 427],
                [946, 417],
                [928, 406],
                [914, 398],
                [902, 388],
                [884, 380],
                [874, 372],
                [858, 363],
                [844, 353],
                [830, 346],
                [812, 335],
                [796, 324],
                [777, 312],
                [758, 300],
                [742, 291],
                [726, 281],
                [710, 271],
                [693, 259],
                [673, 248],
                [654, 235],
                [634, 223],
                [614, 210],
                [595, 199],
                [574, 186],
                [553, 173],
                [527, 159],
                [506, 145],
                [492, 135],
                [471, 123],
                [455, 113],
                [437, 101],
                [421, 92],
                [403, 82],
                [387, 71],
                [370, 59],
                [354, 49],
                [339, 39],
                [323, 28],
                [306, 16],
                [285, 4]
            ]
        },
        "Castro": {
            street: new Street(30, 4, false, 2, true,  2, false, 4000, 5000, [8, 11, 12, 17, 18, 21, 22, 23]),
            points: [
                [620, 647],
                [634, 645],
                [648, 636],
                [655, 626],
                [662, 608],
                [664, 590],
                [667, 572],
                [672, 554],
                [681, 537],
                [691, 518],
                [699, 500],
                [708, 484],
                [715, 468],
                [721, 454],
                [729, 438],
                [738, 420],
                [747, 402],
                [756, 386],
                [764, 367],
                [773, 349],
                [783, 327],
                [794, 307],
                [803, 288],
                [811, 269],
                [820, 251],
                [829, 231],
                [838, 211],
                [847, 192],
                [859, 170],
                [870, 153],
                [878, 137], 
                [884, 124], 
                [893, 107], 
                [900, 93], 
                [910, 72], 
                [917, 57], 
                [924, 44], 
                [934, 21], 
                [942, 4]
            ]
        },
        "Miramonte": {
            street: new Street(35, 5, false, 1.5, false, 2, false, 1000, 7000, [7, 8, 11, 12, 13, 17, 18]),
            points: [
                [621, 730],
                [620, 715],
                [620, 698],
                [620, 681],
                [619, 664],
                [619, 646],
                [618, 626],
                [618, 607],
                [618, 589],
                [616, 574],
                [616, 556],
                [616, 535],
                [615, 517],
                [615, 496],
                [615, 478],
                [615, 458],
                [615, 440],
                [615, 422],
                [615, 402],
                [614, 384],
                [614, 367],
                [613, 348],
                [613, 331],
                [611, 314],
                [601, 297],
                [590, 285],
                [577, 268],
                [565, 255],
                [556, 242],
                [549, 222],
                [547, 205],
                [546, 182],
                [549, 163],
                [563, 144], 
                [572, 126], 
                [581, 107], 
                [590, 87], 
                [601, 66], 
                [611, 47], 
                [624, 27], 
                [634, 9]
            ]
        },
        "Calderon": {
            street: new Street(30, 3, false, 2, false, 2, false, 1500, 6000, [7, 8, 12, 13, 17, 18]),
            points: [
                [1124, 741],
                [1124, 726],
                [1124, 709],
                [1123, 693],
                [1123, 675],
                [1123, 659],
                [1122, 642],
                [1122, 625],
                [1122, 608],
                [1122, 591],
                [1122, 574],
                [1124, 555],
                [1131, 537],
                [1138, 522],
                [1147, 506],
                [1157, 490],
                [1168, 474],
                [1177, 456],
                [1187, 438],
                [1198, 423],
                [1208, 405],
                [1217, 392],
                [1227, 374],
                [1238, 353],
                [1248, 336],
                [1258, 317],
                [1267, 297],
                [1278, 277],
                [1287, 259],
                [1296, 239],
                [1308, 218],
                [1319, 201],
                [1326, 184],
                [1336, 166],
                [1345, 147], 
                [1354, 128], 
                [1360, 113], 
                [1368, 96], 
                [1378, 79]
            ]
        },
        "Church": {
            street: new Street(30, 3, false, 2, false, 2, false, 1500, 6000, [7, 8, 12, 13, 17, 18]),
            points: [
                [655, 10], 
                [670, 24], 
                [686, 33], 
                [704, 43], 
                [719, 52], 
                [733, 60], 
                [752, 70], 
                [767, 79], 
                [783, 87], 
                [802, 100], 
                [818, 109], 
                [837, 119], 
                [853, 129], 
                [888, 150], 
                [907, 161], 
                [922, 170], 
                [939, 181], 
                [957, 191], 
                [977, 202], 
                [997, 216], 
                [1015, 229], 
                [1035, 240], 
                [1053, 253], 
                [1074, 263], 
                [1094, 276], 
                [1110, 288], 
                [1129, 300], 
                [1147, 312], 
                [1163, 322], 
                [1177, 330], 
                [1196, 341], 
                [1214, 354], 
                [1245, 372], 
                [1261, 383], 
                [1281, 394], 
                [1295, 405], 
                [1312, 415], 
                [1330, 427], 
                [1347, 437], 
                [1364, 447], 
                [1380, 457]
            ]
        },
        "View": {
            street: new Street(25, 3, false, 2, false, 2, false, 1500, 6000, [7, 8, 12, 13, 17, 18]),
            points: [
                [913, 372], 
                [919, 358], 
                [926, 344], 
                [933, 330], 
                [942, 312], 
                [949, 296], 
                [959, 277], 
                [965, 262], 
                [973, 248], 
                [982, 230], 
                [999, 195], 
                [1008, 178], 
                [1017, 159], 
                [1024, 145], 
                [1032, 127], 
                [1041, 111], 
                [1049, 94], 
                [1058, 76], 
                [1067, 59], 
                [1074, 43], 
                [1082, 25], 
                [1089, 12]
            ]
        }
    }
}
