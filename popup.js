/* 
Function that places a link onto the main document. 
We use this to get the link for the page we're on.
*/
var getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
/* returns the months and colors as a string array */
const getMonths = () => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const colors = [
        'rgba(235, 64, 52, 0.2)',
        'rgba(153,50,204, 0.2)',
        'rgba(173,216,230, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(128, 0, 0, 0.2)',
        'rgba(144, 238, 144, 0.2)'
    ];
    
    const background = [
        'rgb(235, 64, 52)',
        'rgb(153,50,204)',
        'rgb(173,216,230)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(128, 0, 0)',
        'rgb(144, 238, 144)'
    ];
    return [months, colors, background];
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabArray) {
    const url = tabArray[0].url;
    const hostname = getLocation(url).hostname; // we're interested in host related data
    document.getElementById("link").textContent = hostname;
    launch(url);
});

/* converts timestamp in milliseconds to month */
var bucketTimeStamp = (timestamp) => {
    var date = new Date(timestamp);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    return  month;
}

/* 
    Function that takes in a url and finds all the times user has searched for that url.
    Displays a chart of activity.
*/
var launch = (url) => {
    var map = {};
    // note that the chrome documentation is wrong, keyname = url not details
    chrome.history.getVisits({url: url}, (visits)=> {
        map["totalVisits"] = visits.length;
        map["visits"] = Array(12).fill(0);
        
        // frequency of visits per month
        for (let i = 0; i < visits.length; i++) {
            map["visits"][bucketTimeStamp(visits[i].visitTime)] += 1;
        }
        loadChart(map);
    });
}


/* Graphs URL activity */
var loadChart = (map) => {
    // create a bar graph with x axis as months and y axis as number of visits
    // y axis data = map["visits"]
    // x axis data = months
    const [labels, colors, background] = getMonths();
    console.log(map);
    const data = {
    labels: labels,
    datasets: [{
            label: 'Page clicks per month',
            data: map["visits"],
            backgroundColor: colors,
            borderColor: background,
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {}
      };
    
    // create the chart
    const myChart = new Chart(
        document.getElementById('plot'),
        config
    );
}