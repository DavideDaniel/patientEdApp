/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function ( req, res, next ) {

		console.log( 'inside new route' );
		req.session.authenticated = true;
		console.log( req.session );

		res.view( 'session/new' )
	},

	create: function ( req, res, next ) {
		console.log(req.params);
		// Check for username and password in params sent via the form
		// redirect the browser back to the sign-in form  if none
		if ( !req.param( 'username' ) || !req.param( 'password' ) ) {


			var usernamePasswordRequiredError = [ {
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			} ]


			// key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect( '/session/new' );
			return;
		}

		// Try to find the patient by their username..
		Patient.findOneByPatientUsername( req.param( 'username' ), function foundPatient(
			err, patient ) {
			if ( err ) return next( err );

			// If no patient is found...
			if ( !patient ) {
				var usernameError = [ {
					name: 'noAccount',
					message: 'Username ' + req.param( 'username' ) + ' not found.'
				} ]
				req.session.flash = {
					err: usernameError
				}
				res.redirect( '/session/new' );
				return;
			}

			// Compare password from the form params to the encrypted password of the patient found.
			bcrypt.compare( req.param( 'password' ), patient.encryptedPassword,
				function ( err, valid ) {
					if ( err ) return next( err );

					// If the password from the form doesn't match the password from the database...
					if ( !valid ) {
						var patientnamePasswordMismatchError = [ {
							name: 'patientnamePasswordMismatch',
							message: 'Invalid patientname and password combination.'
						} ]
						req.session.flash = {
							err: patientnamePasswordMismatchError
						}
						res.redirect( '/session/new' );
						return;
					}

					// Log patient in
					req.session.authenticated = true;
					req.session.Patient = patient;

					// Change status to online
					patient.online = true;
					patient.save( function ( err, patient ) {
						if ( err ) return next( err );

						if (req.param('admin'==='on')){console.log('inside radio route');req.session.Patient.admin = true }
						// If the patient is also an admin redirect to the patient list (e.g. /views/patient/index.ejs)
						// This is used in conjunction with config/policies.js file
						if ( req.session.Patient.admin ) {
							console.log('inside admin route');
							res.redirect( '/provider/show' );
							return;
						}

						//Redirect to their profile page (e.g. /views/patient/show.ejs)
						res.redirect( '/patient/show/' + patient.id );
					} );
				} );
		} );
	},

	destroy: function ( req, res, next ) {

		Patient.findOne( req.session.Patient.id, function foundPatient( err, patient ) {

			var patientId = req.session.Patient.id;

			if ( patient ) {
				Patient.update( patientId, {
					online: false
				}, function ( err ) {
					if ( err ) return next( err );

					// Inform other sockets (e.g. connected sockets that are subscribed) that the session for this patient has ended.
					Patient.publishUpdate( patientId, {
						loggedIn: false,
						id: patientId,
						name: patient.name,
						action: ' has logged out.'
					} );

					// Log out
					req.session.destroy();

					// Redirect to the sign-in screen
					res.redirect( '/session/new' );
				} );
			}
			else {

				// Log out
				req.session.destroy();

				// Redirect to the sign-in screen
				res.redirect( '/session/new' );
			}
		} );
	}

};