var endpoint = "https://votes-11360-default-rtdb.europe-west1.firebasedatabase.app/.json";
var votes;
var currentQuestion = 3;

function isEmpty(data) {
    return data.question === 0;
}


function sendVote(choice) {
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            // console.log("Success:", data);

            var mostRecent = data.findIndex(isEmpty);
            // console.log(mostRecent);
            var time = new Date();
            var timeNow = Date.now();
            var newt = {
                question: currentQuestion,
                time: timeNow,
                vote: choice
            };
            var putEndpoint = "https://votes-11360-default-rtdb.europe-west1.firebasedatabase.app/" + mostRecent + "/.json";
            fetch(putEndpoint, {
                method: "PATCH", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newt)
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success: sent", data);
                    fetch(endpoint)
                        .then((response) => response.json())
                        .then((data) => {
                            votes = data.slice(0, data.findIndex(isEmpty));
                            console.log("votes", votes);
                            renderResults(votes, currentQuestion);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
        .catch((error) => {
            console.error("Error:", error);
        });


}
var barGraph;
function renderResults(votes, question) {
    function isForQuestion(votes) {
        return votes.question === question;
    }
    function isTrue(votes) {
        return votes.vote === true;
    }
    function isFalse(votes) {
        return votes.vote === false;
    }
    var votesForQuestion = votes.filter(isForQuestion);
    console.log("votes for question", question, votesForQuestion);
    var trueVotesForQuestion = votesForQuestion.filter(isTrue);
    var falseVotesForQuestion = votesForQuestion.filter(isFalse);
    console.log("true votes for question", question, trueVotesForQuestion);
    console.log("false votes for question", question, falseVotesForQuestion);





    const ctx = document.getElementById('myChart');
    if (barGraph !== undefined) {
        barGraph.destroy();
    }

    barGraph = new Chart(ctx, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: ['Yes', 'No'],
            datasets: [{
                label: '',
                data: [trueVotesForQuestion.length, falseVotesForQuestion.length],
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#000000',
                        font: {
                            size: '25px',
                            family: 'Interstate',
                            weight: '500'
                        }
                    }
                }
            },
            animation: false,
            indexAxis: 'y',
            backgroundColor: '#000000',
            label: '',
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#ffffff',
                    clamp: true,
                    anchor: 'end',
                    align: 'left',
                    font: {
                        size: '25px',
                        family: 'Interstate',
                        weight: '500'
                    }
                }
            }

        }
    });
}

function fetchAndRender() {
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            //console.log("Success:", data);
            votes = data.slice(0, data.findIndex(isEmpty));
            console.log("Success, votes", votes)
            renderResults(votes, currentQuestion);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


function repeatChart() {
    setInterval(function () { console.log("Updating chart"); fetchAndRender(votes, 1) }, 5000);


}


