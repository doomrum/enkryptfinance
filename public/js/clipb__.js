
var copyBtn = document.getElementById("copyBtn");
function copySelected(e) {
    console.log('hello');
    e.preventDefault();
    var copyText = document.getElementById("copy");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    console.log(copyText.value)
}

copyBtn.addEventListener('click',(e)=>copySelected(e))