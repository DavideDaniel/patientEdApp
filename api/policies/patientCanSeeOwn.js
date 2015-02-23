/**
 * Allow a logged-in patient to see his or her own profile
 * Allow provider to see everyone
 */

module.exports = function(req, res, ok) {

	var sessionUserMatchesId = req.session.Patient.id === req.param('id');
	var isProvider = req.session.Provider;

	// The requested id does not match the patient's id,
	// and this is not a provider
	if (!(sessionUserMatchesId || isProvider)) {
		var noRightsError = [{name: 'noRights', message: 'You must be a provider.'}]
		req.session.flash = {
			err: noRightsError
		}
    res.redirect('/session/new');
    return;
	}

	ok();

};