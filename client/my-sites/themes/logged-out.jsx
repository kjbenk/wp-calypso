/**
 * External dependencies
 */
var React = require( 'react' ),
	connect = require( 'react-redux' ).connect,
	pick = require( 'lodash/object/pick' ),
	merge = require( 'lodash/object/merge' );

/**
 * Internal dependencies
 */
var Main = require( 'components/main' ),
	Action = require( 'state/themes/actions' ),
	ThemePreview = require( './theme-preview' ),
	ThemesSelection = require( './themes-selection' ),
	ThemeHelpers = require( 'lib/themes/helpers' ),
	addTracking = require( './theme-options' ).addTracking,
	actionLabels = require( './action-labels' ),
	ThemesListSelectors = require( 'state/themes/themes-list/selectors' );

var Themes = React.createClass( {

	getInitialState: function() {
		return {
			showPreview: false
		}
	},

	togglePreview: function( theme ) {
		this.setState( { showPreview: ! this.state.showPreview, previewingTheme: theme } );
	},

	getButtonOptions: function() {
		const buttonOptions = {
			signup: {
				getUrl: theme => ThemeHelpers.getSignupUrl( theme ),
			},
			preview: {
				action: theme => this.togglePreview( theme ),
				hideForTheme: theme => theme.active
			},
			purchase: {
				isHidden: true
			},
			activate: {
				isHidden: true,
			},
			customize: {
				isHidden: true
			},
			separator: {
				separator: true
			},
			details: {
				getUrl: theme => ThemeHelpers.getDetailsUrl( theme ),
			},
			support: {
				getUrl: theme => ThemeHelpers.getSupportUrl( theme ),
				// Free themes don't have support docs.
				hideForTheme: theme => ! ThemeHelpers.isPremium( theme )
			},
		};
		const options = merge( {}, buttonOptions, actionLabels );
		return pick( options, option => ! option.isHidden );
	},

	onPreviewButtonClick( theme ) {
		this.setState( { showPreview: false },
			() => {
				this.props.dispatch( Action.signup( theme ) );
			} );
	},

	render: function() {
		var buttonOptions = this.getButtonOptions();

		return (
			<Main className="themes">
				{ this.state.showPreview &&
					<ThemePreview showPreview={ this.state.showPreview }
						theme={ this.state.previewingTheme }
						onClose={ this.togglePreview }
						buttonLabel={ this.translate( 'Choose this design', {
							comment: 'when signing up for a WordPress.com account with a selected theme'
						} ) }
						onButtonClick={ this.onPreviewButtonClick } />
				}
				<ThemesSelection search={ this.props.search }
					selectedSite={ false }
					onScreenshotClick={ function( theme ) {
						buttonOptions.preview.action( theme );
					} }
					getActionLabel={ function() {
						return buttonOptions.preview.label;
					} }
					getOptions={ function( theme ) {
						return pick(
							addTracking( buttonOptions ),
							option => ! ( option.hideForTheme && option.hideForTheme( theme ) )
						); } }
					trackScrollPage={ this.props.trackScrollPage }
					tier={ this.props.tier }
					queryParams={ this.props.queryParams }
					themesList={ this.props.themesList } />
				/> }
			</Main>
		);
	}
} );

export default connect(
	( state, props ) => Object.assign( {},
		props,
		{
			queryParams: ThemesListSelectors.getQueryParams( state ),
			themesList: ThemesListSelectors.getThemesList( state )
		}
	)
)( Themes );