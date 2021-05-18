const test = {
    "currency": "BTC",
    "id": "BTC",
    "status": "active",
    "price": "8451.36516421",
    "price_date": "2019-06-14T00:00:00Z",
    "price_timestamp": "2019-06-14T12:35:00Z",
    "symbol": "BTC",
    "circulating_supply": "17758462",
    "max_supply": "21000000",
    "name": "Bitcoin",
    "logo_url": "https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/btc.svg",
}

const tableRow = function (data) {
   return  `
  <tr>    
                    <td><img class="crypto-icons" src="${data.logo_url}"/></td>
                    <td>${data.currency}</td>
                    <td>$ ${data.price}</td>

                    <td>${data.price_timestamp}</td>
                    <td>${data.price_date}</td>

             
                   
                </tr>
`
}

const tbody = document.getElementById('liveTable');
socket.on('liveChat',msg=>{
    tbody.innerHTML = `<tr></tr>`
    for (let i = 0;i<msg.length;i++){
        let d= msg[i];
        tbody.innerHTML += tableRow(d);
    }
})