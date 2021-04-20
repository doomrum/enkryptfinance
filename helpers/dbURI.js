module.exports = {
    dburi: function () {
        if (process.env.NODE_ENV==='prod'){

            return process.env.DBCONNECTPRODUCTION;
        }else {
            return process.env.DBCONNECTLOCAL;
        }

    }
}