/**
 * Allow any authenticated provider
 */
module.exports = function (req, res, ok) {

  // Provider is allowed, proceed to controller
  if (req.session.Provider && req.session.Provider.admin) {
    return ok();
  }

  // Provider is not allowed - for example different providers
  else {
  	var requireAdminError = [{name: 'requireAdminError', message: 'You must be an approved provider.'}]
		req.session.flash = {
			err: requireAdminError
		}
    res.redirect('/session/new');
    return;
  }
};