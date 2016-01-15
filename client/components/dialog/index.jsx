/**
 * External dependencies
 */
import React from 'react';
import noop from 'lodash/utility/noop';

/**
 * Internal dependencies
 */
import SingleChildCSSTransitionGroup from 'components/single-child-css-transition-group';
import RootChild from 'components/root-child';
import DialogBase from './dialog-base';

export default React.createClass( {
	propTypes: {
		isVisible: React.PropTypes.bool,
		baseClassName: React.PropTypes.string,
		enterTimeout: React.PropTypes.number,
		leaveTimeout: React.PropTypes.number,
		onClosed: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			isVisible: false,
			enterTimeout: 200,
			leaveTimeout: 200,
			transitionLeave: true,
			onClosed: noop,
			onClickOutside: noop
		};
	},

	render: function() {
		const { isVisible, baseClassName } = this.props;

		return (
			<RootChild>
				<SingleChildCSSTransitionGroup
					transitionName={ baseClassName || 'dialog' }
					component="div"
					transitionLeave={ this.props.transitionLeave }
					onChildDidLeave={ this.onDialogDidLeave }
					enterTimeout={ this.props.enterTimeout }
					leaveTimeout={ this.props.leaveTimeout }>
					{ isVisible && (
						<DialogBase { ...this.props } key="dialog" onDialogClose={ this.onDialogClose } />
					) }
				</SingleChildCSSTransitionGroup>
			</RootChild>
		);
	},

	onDialogDidLeave: function() {
		if ( this.props.onClosed ) {
			process.nextTick( this.props.onClosed );
		}
	},

	onDialogClose: function( action ) {
		if ( this.props.onClose ) {
			this.props.onClose( action );
		}
	}
} );
