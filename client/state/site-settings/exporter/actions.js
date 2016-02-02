/**
 * Internal dependencies
 */
import notices from 'notices';
import i18n from 'lib/mixins/i18n';
import wpcom from 'lib/wp';

import {
	EXPORT_COMPLETE,
	EXPORT_FAILURE,
	EXPORT_START_REQUEST,
	EXPORT_STARTED,
	SET_EXPORT_POST_TYPE,
} from 'state/action-types';

/**
 * Sets the post type to export.
 *
 * @param  {Object} postType   The name of the post type to use - 'posts', 'pages', 'feedback', or null for all
 * @return {Object}            Action object
 */
export function setPostType( postType ) {
	return {
		type: SET_EXPORT_POST_TYPE,
		postType
	};
}

/**
 * Sends a request to the server to start an export.
 * @param  {Number}   siteId  The ID of the site to export
 * @return {Function}         Action thunk
 */
export function startExport( siteId ) {
	return ( dispatch ) => {
		if ( ! siteId ) {
			return;
		}

		dispatch( {
			type: EXPORT_START_REQUEST,
			siteId: siteId
		} );

		const success =
			() => dispatch( exportStarted( siteId ) );

		const failure =
			error => dispatch( exportFailed( siteId, error ) );

		return wpcom.undocumented()
			.startExport( siteId )
			.then( success )
			.catch( failure );
	}
}

export function exportStarted( siteId ) {
	return {
		type: EXPORT_STARTED,
		siteId
	};
}

export function exportFailed( siteId, error ) {
	notices.error(
		error,
		{
			button: i18n.translate( 'Get Help' ),
			href: '/help/contact'
		}
	);

	return {
		type: EXPORT_FAILURE,
		siteId,
		error
	}
}

export function exportComplete( siteId, downloadURL ) {
	notices.success(
		i18n.translate( 'Your export was successful! A download link has also been sent to your email.' ),
		{
			button: i18n.translate( 'Download' ),
			href: downloadURL
		}
	);

	return {
		type: EXPORT_COMPLETE,
		siteId,
		downloadURL
	}
}
