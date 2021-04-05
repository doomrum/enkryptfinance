

module.exports = {
    dburi: function () {
        // if (process.env.type==='prod'){
            return process.env.DBCONNECTPRODUCTION;
        // }else {
        //     return process.env.DBCONNECTLOCAL;
        // }

    }
}