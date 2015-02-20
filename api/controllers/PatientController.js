/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `PatientController.new()`
	 */
	signup: function ( req, res ) {

		var username = req.param( "username" );
		var firstName = req.param( "firstName" );
		var lastName = req.param( "lastName" );
		var email = req.param( "email" );
		var password = req.param( "password" );

		Patient.findOneByUsername( username )
			.exec( function signupfindPatient( err, usr ) {
				if ( err ) {
					res.set('error', 'DB Error');
					res.send( 500, {
						error: "DB Error"
					} );
				}
				else if ( usr ) {
					res.set('error', 'Username already Taken');
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
						.exec( function signupCreatePatient ( error, patient ) {
							if ( error ) {
								res.send( {
									error: "DB Error"
								} );
							}
							else {
								req.session.patient = patient;
								res.send( patient );
							}
						} );
				}
			} );

	},
	new: function ( req, res ) {
		console.log('inside new route');
		res.redirect('/patient/create')
	},

	/**
	 * `PatientController.create()`
	 */
	create: function ( req, res ) {
		console.log('inside create route');
		var params = req.params.all();
		Patient.create( params, function ( err, patient ) {
			if ( err ) {
				res.redirect( '/patient/new' )
			}

			// return res.json();
			res.redirect('/patient/show/'+patient.id)
		} )

	},

	/**
	 * `PatientController.find()`
	 */
	find: function ( req, res ) {
		console.log('inside find route');
		var id = req.param( 'id' );
		var idShortCut = isShortcut( id );

		if ( idShortCut === true ) {
			return res.notFound();
		}
		if ( id ) {
			Patient.findOne( id, function ( err, patient ) {
				if ( patient === undefined ) return res.notFound();
				if ( err ) return res.notFound();
				res.json( patient );
			} );
		}
		else {
			var where = req.param( 'where' );
			if ( _.isString( where ) ) {
				where = JSON.parse( where );
			}

			if ( !where ) {
				params = req.params.all();
				params = _.omit( params, function ( param, key ) {
					return key === 'limit' || key === 'skip' || key === 'sort'
				} );
				where = params;

			}

			var options = {
				limit: req.param( 'limit' ) || undefined,
				skip: req.param( 'skip' ) || undefined,
				sort: req.param( 'sort' ) || undefined,
				where: where || undefined
			};

			console.log( "Options", options );
			Patient.find( options, function ( err, patient ) {
				if ( patient === undefined ) return res.notFound();
				if ( err ) return res.notFound();
				res.json( patient );
			} );
		}

		function isShortcut( id ) {
			if ( id === 'find' || id === 'update' || id === 'create' || id === 'destroy' ) {
				return true;
			}
		}

	},

	/**
	 * `PatientController.show()`
	 */
	show: function ( req, res ) {
		console.log('inside show route');
		Patient.findOne( req.param.id, function ( err, patient ) {
			if ( err ) return next( err );
			if ( !patient ) {
				return res.notFound();
			}
			else {
				res.view( {
					user: user
				} );
			}
		} );

	},

	/**
	 * `PatientController.update()`
	 */
	update: function ( req, res ) {
		console.log('inside update route');
		var edits = {};
		edits = _.merge( {}, req.params.all(), req.body );
		var id = req.param( 'id' );

		if ( !id ) {
			return res.badRequest( 'Need id' );
		}
		Patient.update( id, edits, function ( err, patient ) {
			if ( patient.length === 0 ) return res.notFound();
			if ( err ) return res.notFound();
			res.json( patient );
		} );
	},

	/**
	 * `PatientController.delete()`
	 */
	destroy: function ( req, res ) {
		console.log('inside destroy route');
		var id = req.param( 'id' );
		if ( !id ) {
			return res.badRequest( 'Need id.' );
		}

		Patient.findOne( id )
			.done( function ( err, result ) {
				if ( err ) return res.serverError( err );
				if ( !result ) return res.notFound();
				Patient.destroy( id, function ( err ) {
					if ( err ) return next( err );
					return res.json( result );
				} );

			} );
	},
};