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
	new: function ( req, res, next ) {


		console.log( 'inside new route' );
		res.view('main/index.ejs')
	},

	/**
	 * `PatientController.create()`
	 */
	create: function ( req, res, next ) {
		console.log( 'inside create route' );
		Patient.create( req.params.all(), function patientCreated( err, patient ) {
			if ( err ){
				return res.redirect('/patient/new')
			}
			else {
				console.log(patient);

				// return res.json();
				res.redirect( '/patient/show/' + patient.id )
			}

		} )
	},

	/**
	 * `PatientController.find()`
	 */
	find: function ( req, res, next ) {
		console.log( 'inside find route' );
		var id = req.param( 'id' );
		var idShortCut = isShortcut( id );

		if ( idShortCut === true ) {
			return res.notFound();
		}
		if ( id ) {
			Patient.findOneById( id, function ( err, patient ) {
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
			if ( id === 'find' || id === 'update' || id === 'create' || id ===
				'destroy' ) {
				return true;
			}
		}

	},

	/**
	 * `PatientController.show()`
	 */
	show: function ( req, res, next ) {
		console.log( 'inside show route' );
		console.log(req.session.authenticated);
		Patient.findOneById( req.param( 'id' ), function ( err, patient ) {
			if ( err ) return next( err );
			if ( !patient )
				return next();
			// res.json(patient)
			res.view( {
				patient: patient
			} );

		} );

	},

	/**
	 * `PatientController.edit()`
	 */
	 edit: function(req, res, next){
	 Patient.findOneById( req.param( 'id' ), function foundPatient( err, patient ) {
			if ( err ) return next( err );
			if ( !patient )
				return next();
			// res.json(patient)
			res.view( {
				patient: patient
			} );

		} );

	},
	 /**
	 * `PatientController.update()`
	 */
	update: function ( req, res, next ) {
		console.log( 'inside update route' );
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
	destroy: function ( req, res, next ) {
		console.log( 'inside destroy route' );
		var id = req.param( 'id' );
		if ( !id ) {
			return res.badRequest( 'Need id.' );
		}

		Patient.find( id )
			.exec( function ( err, result ) {
				if ( err ) return res.serverError( err );
				if ( !result ) return res.notFound();
				Patient.destroy( id, function ( err ) {
					if ( err ) return next( err );
					return res.json( result );
				} );

			} );
	},
};