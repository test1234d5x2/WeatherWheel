export default function getCurrentDate() {
    let date = new Date();
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let ordinalIndicator;

    let dayOfWeek = date.getDay();
    let dayOfMonth = date.getDate();
    let month = date.getMonth();

    // Determining the ordinal indicator (st, nd, rd, th) for the date
    if ([1, 21, 31].indexOf(dayOfMonth) !== -1) {
        ordinalIndicator = "st";
    } else if ([2, 22].indexOf(dayOfMonth) !== -1) {
        ordinalIndicator = "nd";
    } else if ([3, 23].indexOf(dayOfMonth) !== -1) {
        ordinalIndicator = "rd";
    } else {
        ordinalIndicator = "th";
    }

    return "" + days[dayOfWeek] + " " + dayOfMonth + ordinalIndicator + " " + months[month]
}