




// console.log(crypto.);




const d ={
    "e":"trade",
    "E":1620457028803,
    "s":"BTCUSDT",
    "t":816927544,
    "p":"57753.99000000",
    "q":"0.00019400",
    "b":5820929723,
    "a":5820929862,
    "T":1620457028802,
    "m":true,
    "M":true
}
const streamData= [];
crypto.onmessage = (e)=>{


    streamData.push({
        time: e.data['T'],
        value: e.data['p']
    });

    console.log(e.data);
}

var chart = LightweightCharts.createChart(document.getElementById('chart'), {
    width: 600,
    height: 300,
    layout: {
        backgroundColor: '#ffffff',
        textColor: 'rgba(33, 56, 77, 1)',
    },
    grid: {
        vertLines: {
            color: 'rgba(197, 203, 206, 0.7)',
        },
        horzLines: {
            color: 'rgba(197, 203, 206, 0.7)',
        },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
});

var lineSeries = chart.addLineSeries();

lineSeries.setData([
    { time: 1556877600, value: 230.12 },

]);

