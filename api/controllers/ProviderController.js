/**
 * ProviderController
 *
 * @description :: Server-side logic for managing Providers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getTrello: function ( req, res, next ) {

	},

	queryall: function ( req, res ) {
		var trelloKey = process.env.TRELLO_KEY;
		var request = require( 'request' );
		console.log( "inside the getTrello function" );
		request.get( 'https://api.trello.com/1/members/daviddaniel6?&boards=all&key=' +
			trelloKey, function ( error, response, body ) {
				console.log( "inside the request function" );
				if ( !error && response.statusCode == 200 ) {
					board = JSON.parse( body );
					console.log( board );
					console.log( board.idBoards[ 0 ] );
					var board_id = board.idBoards[ 0 ];

					request.get( 'https://api.trello.com/1/boards/' + board_id +
						'?&cards=all&key=' + trelloKey, function ( error, response, body ) {
							if ( !error && response.statusCode == 200 ) {
								data = JSON.parse( body );

								var cards = data.cards
								var card_array = [];
								Patient.find( function foundPatients( err, patients ) {
									if ( err ) next( err );

									for ( var i = 0; i < cards.length; i++ ) {
										
										var card = {
											name: cards[ i ].name,
											url: cards[ i ].desc,
											language: cards[ i ].labels[ 1 ].name,
											issue: cards[ i ].labels[ 0 ].name
											// labels: cards[ i ].labels
										}
										console.log( card.labels );
										card_array.push( card )
									}


									
								console.log( card_array );
								res.view( 'provider/queryall.ejs', {
										patients: patients
									,  cards: card_array
									} );
								} )
								// res.view( 'provider/test.ejs', {
								// 	cards: card_array
								// } );
							}
							else {

								console.log( error );

							}
						} )
				}
				else {

					console.log( error );

				}
			} )

	},

	_config: {}
};