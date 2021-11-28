const CreateForm = document.querySelector('#createForm');
const forms = document.querySelectorAll('#createForm input');
const Image = window.ImageTool;


async function postData(url = '', data = {}) {
    // Default options are marked with *
    let {upload_preset,file} = data;
    const formData = new FormData();
    formData.append('upload_preset',upload_preset);
    formData.append('file',file);

    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.// no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
 function getbase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload= () => {


            resolve(reader.result)
        }

        reader.onerror = reject

        reader.readAsDataURL(file)
    })
}

const editor = new EditorJS({
        holder: 'editorjs',
        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        placeholder:"Write an article",
        tools:{
            header:Header,
            delimiter: Delimiter,
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            embed: Embed,
            image:{
                class:Image,
                config:{
                    // byFile: 'https://api.cloudinary.com/v1_1/${cloudName}/upload', // backend file uploader endpoint
                    uploader:{
                        uploadByFile(file){
                            // your own uploading logic here
                            console.log(file)
                            return getbase64(file).then(res=>{
                                // console.log(res);
                                const xhttp = new XMLHttpRequest();

                                return postData('https://api.cloudinary.com/v1_1/enkryptfinance-com/upload',{file:res,upload_preset:'lkqvo3ee'}).then((p) => {
                                    console.log(p.url);
                                    return {
                                        success: 1,
                                        file: {
                                            url: p.url,
                                            // any other image data you want to store, such as width, height, color, extension, etc
                                        }
                                    };
                                }).catch(err=>{
                                    // console.log(err)
                                    return err;
                                })
                            }).catch(err=>err);



                        },
                        uploadByUrl(url){
                            // your ajax request for uploading
                            console.log(url)
                            return getbase64(url).then(res=>{
                                // console.log(res);
                                return postData('https://api.cloudinary.com/v1_1/enkryptfinance-com/upload',{file:res,upload_preset:'lkqvo3ee'}).then((p) => {
                                    console.log(p.url)
                                    return {
                                        success: 1,
                                        file: {
                                            url: p.url,
                                            // any other image data you want to store, such as width, height, color, extension, etc
                                        }
                                    };
                                }).catch(err=>{
                                    // console.log(err)
                                    return err;
                                })
                            }).catch(err=>err);
                        }
                    }
                }
            },
            list:List,
            // linkTool:LinkTool,
            // code:CodeTool

        }
    }
);

async function submitPost(e) {
    e.preventDefault();
    let alertBox = document.createElement('div');
    let alert = document.createElement('p');
    const ajax0= new XMLHttpRequest();
    ajax0.open('POST','https://enkryptfinance.com/admin/post/p/post/c');
   ajax0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    const description  = await  editor.save();
    //destructure the form to get the value all the inputs
    const formInfo = Array.from(forms).reduce((acc,input)=>({...acc,[input.getAttribute('name')]:input.value}),{});
    formInfo.description = description.blocks;
    // ajax0.setRequestHeader()
    console.log(formInfo);
    ajax0.onprogress = function(){
        alert.innerText = 'loading';
        console.log('loading')
        alertBox.appendChild(alert);
        alert.setAttribute('class','success-msg')
        document.body.append(alertBox);
    }
    // console.log(JSON.stringify(formInfo))
    ajax0.send(`data=${JSON.stringify(formInfo)}`);
    ajax0.onload = function (e) {

        document.body.removeChild(alertBox);
        console.log(ajax0.responseText);
    };
    ajax0.addEventListener('error',()=>{
        console.log('error');
    })
}
CreateForm.addEventListener('submit',submitPost)