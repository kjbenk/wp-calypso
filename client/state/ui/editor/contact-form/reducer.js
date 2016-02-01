/**
 * External dependencies
 */
import cloneDeep from 'lodash/lang/cloneDeep';

/**
 * Internal dependencies
 */
import {
	CONTACT_FORM_LOAD_FORM,
	CONTACT_FORM_ADD_DEFAULT_FIELD,
	CONTACT_FORM_REMOVE_FIELD,
	CONTACT_FORM_CLEAR_FORM
} from './action-types';
import { CONTACT_FORM_DEFAULT, CONTACT_FORM_DEFAULT_NEW_FIELD } from './constants';

const initalState = cloneDeep( CONTACT_FORM_DEFAULT );

export default function( state = initalState, action ) {
	switch ( action.type ) {
		case CONTACT_FORM_LOAD_FORM:
			state = cloneDeep( action.contactForm );
			break;
		case CONTACT_FORM_ADD_DEFAULT_FIELD:
			state = Object.assign( {}, state, {
				fields: [ ...state.fields, CONTACT_FORM_DEFAULT_NEW_FIELD ]
			} );
			break;
		case CONTACT_FORM_REMOVE_FIELD:
			const { index } = action;
			state = cloneDeep( state );
			state.fields.splice( index, 1 );
			break;
		case CONTACT_FORM_CLEAR_FORM:
			state = cloneDeep( CONTACT_FORM_DEFAULT );
			break;
	}

	return state;
}
