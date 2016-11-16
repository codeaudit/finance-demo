'use strict'

const algoliasearch = require('algoliasearch')

exports.MakeClient = function MakeClient(a, secret) {
	return algoliasearch(a, secret)
}
