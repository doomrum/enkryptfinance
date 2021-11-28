const xCont = document.getElementById('allArticles');
function getAllPosts() {
     const xhttp  = new XMLHttpRequest();


     xhttp.open('GET','https://enkryptfinance.com/getallPosts',true);
     const template = (img,title,paragraph,author,date,_id)=>{
      return  `
     <a href="/blog/post/${_id}/${title}" class="no-deco">
            ${img?`<img alt="${title} " title="${title}" src="${img.data.file.url}" class="flowImg"/>`:''}

            <div class="mgT1">
                <h5 class="h4">${title}</h5>
                <p class="h6">${paragraph}</p>
            </div>
           <div class="dark-bg pd2 mgT1">
               <span class="h6"> <em class="pending">Author</em> <span class="mgL1">${author}</span></span>
               <span class="mgL2 h6">${moment(date).format('Do MMM YYYY')}</span>
           </div>
        </a>
     `
     };
    function formatPosts(e) {
        let posts = JSON.parse(e.responseText);
        if (posts.length===0) {
            let el=document.createElement('div');
            el.setAttribute('class','article-card')
            el.innerHTML = `<h2 class="h3">Sorry No Posts Yet</h2>`;
            xCont.appendChild(el)
        }

     for (let i =0 ;i<posts.length;i++){
         let {description,author,_id,title,date} = posts[i];
             let image = description.find((d)=>d.type==='image')
                let paragraph = description.find((d)=>d.type==='paragraph')?.data?.text.slice(0,150);
                let post = template(image,title,paragraph,author,date,_id);
                let el=document.createElement('div');
                el.setAttribute('class','article-card')
                el.innerHTML = post;
                xCont.appendChild(el)

    }
    }
     xhttp.addEventListener('load',()=>formatPosts(xhttp))
    xhttp.send();
}
window.addEventListener('load',getAllPosts)