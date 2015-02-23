/**
 * Allow a logged-in patient to see his or her own profile
 * Allow provider to see everyone
 */

module.exports = function(req, res, ok) {

	var sessionUserMatchesId = req.session.Patient.id === req.param('id');
	var isProvider = req.session.Provider;

	if (!(sessionUserMatchesId || isProvider)) {
		var noRightsError = [{name: 'noRights', message: 'Not allowed'}]
		req.session.flash = {
			err: noRightsError
		}
    res.redirect('/session/new');
    return;
	}

	ok();

};