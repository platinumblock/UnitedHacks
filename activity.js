const CO2_HEURISTIC = [
    {keyword: "driving", estimate: 0.2},
    {keyword: "flying", estimate: 0.15},
    {keyword: "riding", estimate: 0.1},
    {keyword: "cycling", estimate: 0},
    {keyword: "walking", estimate: 0},
    {keyword: "train", estimate: 0.05},
    {keyword: "bus", estimate: 0.06},
    {keyword: "motorcycle", estimate: 0.1},
    {keyword: "scooter", estimate: 0.01},
    {keyword: "cruise", estimate: 0.25},
    {keyword: "heating", estimate: 1.8},
    {keyword: "conditioning", estimate: 1.0},
    {keyword: "cooling", estimate: 1.0},
    {keyword: "lighting", estimate: 0.05},
    {keyword: "refrigerator", estimate: 0.3},
    {keyword: "microwave", estimate: 1.2},
    {keyword: "dishwasher", estimate: 1.1},
    {keyword: "washing", estimate: 0.6},
    {keyword: "dryer", estimate: 2.4},
    {keyword: "shower", estimate: 2.0},
    {keyword: "beef", estimate: 27},
    {keyword: "lamb", estimate: 39},
    {keyword: "chicken", estimate: 6.9},
    {keyword: "fish", estimate: 13},
    {keyword: "rice", estimate: 4.0},
    {keyword: "bread", estimate: 1.0},
    {keyword: "cheese", estimate: 13.5},
    {keyword: "milk", estimate: 1.3},
    {keyword: "chocolate", estimate: 19},
    {keyword: "potato", estimate: 0.3},
    {keyword: "producing", estimate: 10},
    {keyword: "manufacturing", estimate: 15},
    {keyword: "packaging", estimate: 2},
    {keyword: "clothing", estimate: 20},
    {keyword: "jeans", estimate: 33.4},
    {keyword: "smartphone", estimate: 70},
    {keyword: "laptop", estimate: 200},
    {keyword: "car", estimate: 6000},
    {keyword: "furniture", estimate: 200},
    {keyword: "landfill", estimate: 0.7},
    {keyword: "recycling", estimate: -0.5},
    {keyword: "composting", estimate: 0.3},
    {keyword: "waste", estimate: 0.7},
    {keyword: "plastic", estimate: 0.01},
    {keyword: "paper", estimate: 0.04},
    {keyword: "aluminum", estimate: -0.5},
    {keyword: "organic", estimate: 0.3},
    {keyword: "trash", estimate: 0.7},
    {keyword: "bag", estimate: 0.0}
];


class Activity {

    constructor(emissionsPerHour) {
        this.emissionsPerHour = emissionsPerHour;
    }

}


function calculateSimilarity(activity1, activity2) {
    let normalize = str => str.toLowerCase().replace(/[^a-z]/, "");
    let letters1 = normalize(activity1).split("");
    let letters2 = normalize(activity2).split("");

    if (letters1 === letters2) {
        return Infinity;
    }

    let letterSet1 = new Set(letters1);
    let letterSet2 = new Set(letters2);
    let commonLetters = [...letterSet1].filter(letter => letterSet2.has(letter));

    let totalUniqueLetters = new Set([...letters1, ...letters2]).size;
    return commonLetters.length / totalUniqueLetters;
}


/**
 * Gets an {@code Activity} object with a CO2 emission estimate from an arbitrary description
 * of an activity.
 *
 * The CO2 emission estimate is determined based on the {@code CO2_HEURISTIC} set of keywords
 * using the nearest neighbor algorithm to find a match.
 *
 * CO2 units are in kg/hr of the activity.
 *
 * @param activityDescription  any arbitrary string describing an activity.
 *
 * @return an {@code Activity} object for the activity string provided.
 */
export function getActivity(activityDescription) {
    let bestSimilarity = 0.0;
    let bestEstimate = 0.0;

    for (const {keyword, estimate} of CO2_HEURISTIC) {
        const similarity = calculateSimilarity(activityDescription, keyword);
        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestEstimate = estimate;
            console.log(keyword);
        }
    }

    return new Activity(bestEstimate * bestSimilarity);
}
