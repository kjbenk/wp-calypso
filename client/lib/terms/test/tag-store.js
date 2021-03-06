require( 'lib/react-test-env-setup' )();

/**
 * External dependencies
 */
var rewire = require( 'rewire' ),
	assert = require( 'chai' ).assert,
	Dispatcher = require( 'dispatcher' );

/**
 * Internal dependencies
 */
var data = require( './data' ),
	ActionTypes = require( '../constants' ).action;

var TEST_SITE_ID = 777,
	TEST_TAG_ID = 8,
	TEST_NUM_TAGS = data.tagList.length;

describe( 'tag-store', function() {
	var TagStore;
	before( function() {
		TagStore = rewire( '../tag-store' );
	} );

	beforeEach( function() {
		TagStore.__set__( '_tagIds', {} );
		TagStore.__set__( '_siteStatus', {} );
	} );

	function dispatchReceiveTerms() {
		Dispatcher.handleServerAction( {
			type: 'RECEIVE_TERMS',
			siteId: TEST_SITE_ID,
			data: {
				termType: 'tags',
				terms: data.tagList,
				found: data.tagList.length
			},
			error: null
		} );
	}

	function dispatchReceiveCategoryTerms() {
		Dispatcher.handleServerAction( {
			type: 'RECEIVE_TERMS',
			siteId: TEST_SITE_ID,
			data: {
				termType: 'categories',
				terms: data.tagList,
				found: data.tagList.length
			},
			error: null
		} );
	}

	function dispatchPaginatedReceiveTerms() {
		Dispatcher.handleServerAction( {
			type: ActionTypes.RECEIVE_TERMS,
			siteId: TEST_SITE_ID,
			data: {
				termType: 'tags',
				terms: data.tagList,
				found: data.tagList.length + 100
			},
			error: null
		} );
	}

	describe( '#isFetchingPage', function() {
		it( 'should set isFetchingPage', function() {
			Dispatcher.handleViewAction( {
				type: 'FETCH_TAGS',
				siteId: TEST_SITE_ID
			} );
			assert.isTrue( TagStore.isFetchingPage( TEST_SITE_ID ) );
		} );

		it( 'should be false when not fetching', function() {
			dispatchReceiveTerms();
			assert.isFalse( TagStore.isFetchingPage( TEST_SITE_ID ) );
		} );
	} );

	describe( '#hasNextPage', function() {
		it( 'should return false when no additional page exists', function() {
			dispatchReceiveTerms();
			assert.isFalse( TagStore.hasNextPage( TEST_SITE_ID ) );
		} );

		it( 'should return true when another page exists', function() {
			dispatchPaginatedReceiveTerms();
			assert.isTrue( TagStore.hasNextPage( TEST_SITE_ID ) );
		} );

		it( 'should not have another page when last response had no data', function() {
			dispatchPaginatedReceiveTerms();
			assert.isTrue( TagStore.hasNextPage( TEST_SITE_ID ) );

			Dispatcher.handleServerAction( {
				type: ActionTypes.RECEIVE_TERMS,
				siteId: TEST_SITE_ID,
				data: {
					termType: 'tags',
					terms: [],
					found: data.tagList.length + 100
				},
				error: null
			} );
			assert.isFalse( TagStore.hasNextPage( TEST_SITE_ID ) );
		} );
	} );

	describe( '#get', function() {
		it( 'should get the correct tag', function() {
			var tag;
			dispatchReceiveTerms();
			tag = TagStore.get( TEST_SITE_ID, TEST_TAG_ID );
			assert.equal( tag.name, 'swawesome' );
		} );
	} );

	describe( '#all', function() {
		it( 'should return the correct number of tags', function() {
			var tags;
			dispatchReceiveTerms();
			tags = TagStore.all( TEST_SITE_ID );
			assert.equal( tags.length, TEST_NUM_TAGS );
		} );
	} );

	describe( 'dispatcher', function() {
		it( 'should have a dispatch token', function() {
			assert.typeOf( TagStore.dispatchToken, 'string' );
		} );

		it( 'should ignore category payloads', function() {
			dispatchReceiveCategoryTerms();
			assert.isUndefined( TagStore.all( TEST_SITE_ID ) );
		} );
	} );
} );
