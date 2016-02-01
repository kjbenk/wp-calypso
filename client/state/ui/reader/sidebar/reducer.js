/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { READER_SIDEBAR_LISTS_TOGGLE, READER_SIDEBAR_TAGS_TOGGLE } from 'state/action-types';

const stats = require( 'reader/stats' );

function isListsOpen( state = false, action ) {
	switch ( action.type ) {
		case READER_SIDEBAR_LISTS_TOGGLE:
			state = ! state;
			if ( state ) {
				stats.recordAction( 'sidebar_open_lists_menu' );
				stats.recordGaEvent( 'Clicked Open Lists Menu' );
			} else {
				stats.recordAction( 'sidebar_close_lists_menu' );
				stats.recordGaEvent( 'Clicked Close Lists Menu' );
			}
			break;
	}

	return state;
}

function isTagsOpen( state = false, action ) {
	switch ( action.type ) {
		case READER_SIDEBAR_TAGS_TOGGLE:
			state = ! state;
			if ( state ) {
				stats.recordAction( 'sidebar_open_tags_menu' );
				stats.recordGaEvent( 'Clicked Open Tags Menu' );
			} else {
				stats.recordAction( 'sidebar_close_tags_menu' );
				stats.recordGaEvent( 'Clicked Close Tags Menu' );
			}
			break;
	}

	return state;
}

export default combineReducers( {
	isListsOpen,
	isTagsOpen
} );
