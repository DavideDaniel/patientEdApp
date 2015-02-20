/**
 * Card.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		cardId: {
			type: 'int'
		},

		name: {
			type: 'string'
		},

		url: {
			type: 'string'
		},

		imageUrl: {
			type: 'string'
		},

		language: {
			type: 'string'
		},

		issue: {
			type: 'string'
		}
	}
};