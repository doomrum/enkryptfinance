module.exports = {
    isEmpty: function (obj) {
        let key;
        for(key in obj){
            return obj.hasOwnProperty(key);
        }

    }
}