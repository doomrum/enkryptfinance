
const socket = io();
const tableRow = function (data) {
   let textColor = 'success';
   let icon = 'las la-arrow-up';
   let marketCp = parseInt(data.market_cap).toFixed(5);
   let price = data.price;
   let supply = data.circulating_supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (data['1d'].price_change_pct.startsWith('-')){
        textColor = 'red';
        icon = 'las la-arrow-down';
    }if (data.price>1000){
        price = (parseInt(data.price)/1000).toString().slice(0,4) + 'K';
    }
    if (data.market_cap>1000000){
        marketCp = (parseInt(data.market_cap)/1000000000000).toString().slice(0,4) + 'M';
    }
    if (data.market_cap>1000000000){
        marketCp = (parseInt(data.market_cap)/1000000000).toString().slice(0,4) + 'B';
    }


    if (data.market_cap>1000000000000){
        marketCp = (parseInt(data.market_cap)/1000000000000).toString().slice(0,4) + 'T';
    }





   return  `
  <tr>             <td class="h6 bold">${data.rank}</td>
                    <td class="h6 bold"><img alt="${data.logo_url}" class="crypto-icons" src="${data.logo_url}"/></td>
                           <td>${data.symbol}</td>
                    <td class="h6 bold">${data.name}</td>
                  
           
                    <td class="h5 bold">$${price}</td>
                    <td class="h6 bold">$${marketCp}</td>
                    <td class="h6 bold">${supply}</td>
                    <td class="${textColor} h5 bold"><i class="${icon}"></i> ${((data['1d'].price_change_pct) * 100).toString().slice(0,8)}%</td>

             
                   
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