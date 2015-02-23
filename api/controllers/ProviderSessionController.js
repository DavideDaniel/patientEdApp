/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function ( req, res, next ) {

		console.log( 'inside new route for provider' );
		req.session.authenticated = true;
		console.log( req.session );

		res.view('providersession/new')
	},

	create: function ( req, res, next ) {
		console.log( req.params.all );
		// Check for username and password in params sent via the form
		// redirect the browser back to the sign-in form  if none
		if ( !req.param( 'username' ) || !req.param( 'password' ) ) {

			var usernamePasswordRequiredError = [ {
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			} ]
			console.log(usernamePasswordRequiredError);
			// key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect( 'providersession/new' );
			return;
		}

		Provider.findOneByProviderUsername( req.param( 'username' ), function foundProvider(
			err, provider ) {
			if ( err ) return next( err );

			// If no provider is found...
			if ( !provider ) {
				var usernameError = [ {
					name: 'noAccount',
					message: 'Username ' + req.param( 'username' ) + ' not found.'
				} ]
				req.session.flash = {
					err: usernameError
				}
				console.log(usernameError);
				res.redirect( 'providersession/new' );
				return;
			}

			// Compare password from the form params to the encrypted password of the provider found.
			bcrypt.compare( req.param( 'password' ), provider.encryptedPassword,
				function ( err, valid ) {
					if ( err ) return next( err );

					// If the password from the form doesn't match the password from the database...
					if ( !valid ) {
						var providernamePasswordMismatchError = [ {
							name: 'providernamePasswordMismatch',
							message: 'Invalid providername and password combination.'
						} ]
						req.session.flash = {
							err: providernamePasswordMismatchError
						}
						console.log(providernamePasswordMismatchError);
						res.redirect( 'providersession/new' );
						return;
					}

					// Log provider in
					req.session.authenticated = true;
					req.session.Provider = provider;

					// Change status to online
					provider.online = true;
					provider.save( function ( err, provider ) {
						if ( err ) return next( err );

						//Redirect to their particular page (e.g. /views/provider/show.ejs)
						res.redirect( '/provider/show' );
					} );
				} );
		} );

	},

	destroy: function ( req, res, next ) {

		Provider.findOne( req.session.Provider.id, function foundProvider( err, provider ) {

			var providerId = req.session.Provider.id;

			if ( provider ) {
				Provider.update( providerId, {
					online: false
				}, function ( err ) {
					if ( err ) return next( err );

					// Inform other sockets (e.g. connected sockets that are subscribed) that the session for this provider has ended.
					Provider.publishUpdate( providerId, {
						loggedIn: false,
						id: providerId,
						name: provider.name,
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