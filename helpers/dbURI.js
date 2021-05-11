module.exports = {
    dburi: function () {
        if (process.env.NODE_ENV==='production'){

            return process.env.DBCONNECTPRODUCTION;
        }else {
            return process.env.DBCONNECTLOCAL;
        }

    }
}