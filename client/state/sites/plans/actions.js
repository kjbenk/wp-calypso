/**
 * External dependencies
 */
import debugFactory from 'debug';
import map from 'lodash/collection/map';
import reject from 'lodash/collection/reject';

const debug = debugFactory( 'calypso:site-plans:actions' );

/**
 * Internal dependencies
 */
import { createSitePlanObject } from './assembler';
import {
	SITE_PLANS_FETCH,
	SITE_PLANS_FETCH_COMPLETED,
	SITE_PLANS_FETCH_FAILED,
	SITE_PLANS_REMOVE
} from 'state/action-types';
import wpcom from 'lib/wp';

/**
 * Returns an action object to be used in signalling that plans for the given site has been cleared.
 *
 * @param {Number} siteId identifier of the site
 * @returns {Object} the corresponding action object
 */
export function clearSitePlans( siteId ) {
	return {
		type: SITE_PLANS_REMOVE,
		siteId
	};
}

/**
 * Fetches plans for the given site.
 *
 * @param {Number} siteId identifier of the site
 * @returns {Function} a promise that will resolve once fetching is completed
 */
export function fetchSitePlans( siteId ) {
	return ( dispatch ) => {
		dispatch( {
			type: SITE_PLANS_FETCH,
			siteId
		} );

		return new Promise( ( resolve ) => {
			wpcom.undocumented().getSitePlans( siteId, ( error, data ) => {
				if ( error ) {
					debug( 'Fetching site plans failed: ', error );

					const errorMessage = error.message || this.translate( 'There was a problem fetching site plans. Please try again later or contact support.' );

					dispatch( {
						type: SITE_PLANS_FETCH_FAILED,
						siteId,
						error: errorMessage
					} );
				} else {
					dispatch( fetchSitePlansCompleted( siteId, data ) );
				}

				resolve();
			} );
		} );
	}
}

/**
 * Returns an action object to be used in signalling that an object containing
 * the plans for a given site have been received.
 *
 * @param {Number} siteId identifier of the site
 * @param {Object} data list of plans received from the API
 * @returns {Object} the corresponding action object
 */
export function fetchSitePlansCompleted( siteId, data ) {
	data = reject( data, '_headers' );

	return {
		type: SITE_PLANS_FETCH_COMPLETED,
		siteId,
		plans: map( data, createSitePlanObject )
	};
}

/**
 * Clears plans and fetches them for the given site.
 *
 * @param {Number} siteId identifier of the site
 * @returns {Function} the corresponding action thunk
 */
export function refreshSitePlans( siteId ) {
	return ( dispatch ) => {
		dispatch( clearSitePlans( siteId ) );
		dispatch( fetchSitePlans( siteId ) );
	}
}
