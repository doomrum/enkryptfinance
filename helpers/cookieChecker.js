function cookieChecker(req,res,next) {
    const ID  = req.session.access;
    if (req.session.access) {
        console.log(req.session.access);

        next()
    }else{
        res.redirect('/auth/login');
    }
}
module.exports = cookieChecker;