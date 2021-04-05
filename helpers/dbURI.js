

module.exports = {
    dburi: function () {
        if (process.env.NODE_ENV==='prod'){
            console.log(process.env.type)
            return process.env.DBCONNECTPRODUCTION;
        }else {
            console.log(process.env.type)
            return process.env.DBCONNECTLOCAL;
        }

    }
}