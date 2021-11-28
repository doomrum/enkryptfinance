function getPost(url) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET',`https://enkryptfinance.com/gt${url}`,true)

    const container = document.createElement('div');
    xhttp.addEventListener('load',(e)=>{
        //creation of the template works
        let result = JSON.parse(xhttp.responseText);
        if (xhttp.status>=200&& xhttp.status<400){
            console.log(JSON.parse(xhttp.responseText))
            container.setAttribute('class','post-article ');
            const post_date = moment(result.date).format('Do MMM YYYY');
            const post_author = result.author;
            const authEl = document.createElement('span');
            authEl.setAttribute('class','h6');
            authEl.innerHTML = `<em class=" h6">${post_date}</em> <span class="mgL1 pending">${post_author}</span>`;
            container.appendChild(authEl);


            result.description.map(({id,type,data})=>{
                switch (type) {
                    case 'paragraph':
                        let pg = document.createElement('p');
                        pg.innerHTML = data.text;

                        pg.setAttribute('class','h5 ');
                        container.appendChild(pg);
                        break;
                    case 'header':
                        let el = document.createElement(`h${data.level}`);
                        el.innerHTML = data.text;

                        el.setAttribute('class',`h${data.level}`);
                        container.appendChild(el);
                        break;
                    case 'link':
                        let link = document.createElement(`a`);
                        el.innerHTML = data.text;

                        el.setAttribute('class',`h${data.level}`);
                        container.appendChild(el);
                        break;
                    case 'image':
                        let image = document.createElement(`img`);

                        image.setAttribute('class',`flowImg mgV2`);
                        image.setAttribute('src',`${data.file.url}`);
                        container.appendChild(image);
                        break;
                    case 'list':
                        if (data.style==='unordered'){
                            let el = document.createElement(`ul`);
                            el.setAttribute('class','list')
                            for (let j = 0;j<data.items.length;j++){
                                let listItem = document.createElement(`li`);
                                listItem.innerHTML = data.items[j]
                                el.appendChild(listItem)
                            }
                            container.appendChild(el);
                            break;
                        }
                        else{
                            let el = document.createElement(`ol`);
                            for (let j = 0;j<data.items.length;j++){
                                let item  = data.items[j];
                                el.appendChild(document.createElement(`li`).innerHTML=item)
                            }
                            container.appendChild(el);
                            break;
                        }

                    default:
                        let par = document.createElement('p');
                        par.innerHTML = data.text;

                        par.setAttribute('class','h5 ');
                        container.appendChild(p);

                }
            });
            console.log(container)
            document.getElementById('postBox').appendChild(container)



        }
        else if (xhttp.status>=400){
            console.log(xhttp.status)
            let pg = document.createElement('p');
            pg.innerHTML = 'Error';

            pg.setAttribute('class','h5 ');
            container.appendChild(pg);
        }


    });
    xhttp.addEventListener('progress',()=>{

    })
    xhttp.onerror= function (){
        let pg = document.createElement('p');
        pg.innerHTML = xhttp.responseText;
        pg.setAttribute('class','h5 ');
        container.appendChild(pg);
    }
    xhttp.send()
}

const route = window.location.pathname;
window.addEventListener('load',()=>getPost(route))