const NUM_BUSY_SAMPLES = 1000;


export default class Street {

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
        const probabilities = Array.from({ length: resolution + 1 }, (_, i) => {
            const x = i * step;
            return rushPeaks.reduce((sum, peak) => {
                const distance = x - peak;
                return sum + Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(rushWidth, 2)));
            }, 0);
        });

        const total = probabilities.reduce((a, b) => a + b, 0);
        const normalizedProbabilities = probabilities.map(p => p / total);

        const cumulative = [];
        normalizedProbabilities.reduce((sum, p, i) => {
            cumulative[i] = sum + p;
            return cumulative[i];
        }, 0);

        const randomValue = Math.random();
        const index = cumulative.findIndex(cdf => randomValue <= cdf);

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
        return 10 * traffic / maxTraffic;
    }


    getTransitImportanceStr(time) {
        let transitImportance = this.getTransitImportance(time);
        if (transitImportance >= 0.70) {
            return "High";
        }
        else if (transitImportance >= 0.50) {
            return "Medium";
        }
        else {
            return "Low";
        }
    }

}
