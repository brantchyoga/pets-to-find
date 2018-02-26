module.exports = function(req, res, next){
  if (!req.user){
    req.flash('error', 'You must be logged in to access tht page!!');
    res.redirect('/auth/login');
  } else {
    next();
  }
}
