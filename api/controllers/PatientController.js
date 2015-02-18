/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * `PatientController.create()`
	 */
	create: function ( req, res ) {
		var params = req.params.all();
		Patient.create( params, function ( err, patient ) {
			if ( err ) return next( err );
			res.status( 201 )

			return res.json(
				patient
			);
		} )

	},

	/**
	 * `PatientController.find()`
	 */
	find: function ( req, res ) {
		var id = req.param( 'id' );
		var idShortCut = isShortcut( id );

		if ( idShortCut === true ) {
			return next();
		}
		if ( id ) {
			Patient.findOne( id, function ( err, patient ) {
				if ( patient === undefined ) return res.notFound();
				if ( err ) return next( err );
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
				if ( err ) return next( err );
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
	 * `PatientController.update()`
	 */
	update: function ( req, res ) {
		return res.json( {

		} );
	},

	/**
	 * `PatientController.delete()`
	 */
	delete: function ( req, res ) {
		var id = req.params.id;
		Patient.delete( id )
		return res.json( {

		} );
	}
};