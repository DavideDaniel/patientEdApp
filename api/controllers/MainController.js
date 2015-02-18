/**
 * MainController
 *
 * @description :: Server-side logic for managing Mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function ( req, res ) {
		res.view()
	},
	signup: function ( req, res ) {

		var username = req.param( "username" );
		var firstName = req.param( "firstName" );
		var lastName = req.param( "lastName" );
		var email = req.param( "email" );
		var password = req.param( "password" );

		Patients.findOneByUsername( username )
			.done( function signupfindUser( err, usr ) {
				if ( err ) {

					res.send( 500, {
						error: "DB Error"
					} );
				}
				else if ( usr ) {
					res.send( 400, {
						error: "Username already Taken"
					} );
				}
				else {
					 var hasher = require("password-hash");
                		password = hasher.generate(password);
					Patient.create( {
						username: username,
						firstName: firstName,
						lastName: lastName,
						email: email,
						password: password
					} )
						.done( function ( error, user ) {
							if ( error ) {
								res.send( 500, {
									error: "DB Error"
								} );
							}
							else {
								req.session.user = user;
								res.send( user );
							}
						} );
				}
			} );

	},
	login: function ( req, res ) {
		var username = req.param( "username" );
		var password = req.param( "password" );
		Patients.findOneByUsername( username )
			.done( function loginfindUser( err, usr ) {
				if ( err ) {
					res.send( 500, {
						error: "DB Error"
					} );
				}
				else {
					if ( usr ) {
						var hasher = require( "password-hash" );
						if ( hasher.verify( password, usr.password ) ) {
							req.session.user = usr;
							res.send( usr );
						}
						else {
							res.send( 400, {
								error: "Wrong Password"
							} );
						}
					}
					else {
						res.send( 404, {
							error: "User not Found"
						} );
					}
				}
			} );

	}

};