/**
 * Patient.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,

	attributes: {

		username: {
			type: 'string',

		},

		email: {
			type: 'string',

		},

		fullName: {
			type: 'string'

		},

		encryptedPassword: {
			type: 'string'

		}
	},

	admin: {
		type: 'boolean',
		defaultsTo: false
	},

	online: {
		type: 'boolean',
		defaultsTo: false
	},

	beforeCreate: function ( values, next ) {

		// This checks to make sure the password and password confirmation match before creating record
		if ( !values.signupPassword || values.signupPassword != values.signupConfirmPassword ) {
			return next( {
				err: [ "Password doesn't match confirmation." ]
			} );
		}

		require( 'bcrypt' )
			.hash( values.signupPassword, 10, function passwordEncrypted( err,
				encryptedPassword ) {
				if ( err ) return next( err );
				values.encryptedPassword = encryptedPassword;
				// values.online= true;
				next();
			} );
	}

};