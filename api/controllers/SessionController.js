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
		console.log(req.session);

		res.view('session/new')
	},

};

