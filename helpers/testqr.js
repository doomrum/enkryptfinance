const qr = require('qrcode');

function qrGenerator(text) {
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.3,
        margin: 1,
        color: {
            dark:"#010599FF",
            light:"#FFBF60FF"
        }
    }
    return qr.toDataURL(text,(err,data)=>{
        if (err) throw err
        return data;
    })
}
module.exports = qrGenerator;