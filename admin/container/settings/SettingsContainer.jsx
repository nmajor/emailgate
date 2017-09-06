import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import ScreencastHelpFormContainer from './ScreencastHelpFormContainer';

class SettingsContainer extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  componentDidMount() {
    if (this.props.settings.length < 1) {
      this.props.dispatch(Actions.getSettings());
    }
  }
  render() {
    return (<div>
      <ScreencastHelpFormContainer name="designCoverScreencastHelp" />
      <ScreencastHelpFormContainer name="addEmailsScreencastHelp" />
      <ScreencastHelpFormContainer name="editCompilationScreencastHelp" />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    settings: store.settings,
  };
}

SettingsContainer.need = [
  (params, cookie) => {
    return Actions.getSettings.bind(null, cookie)();
  },
];

SettingsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  settings: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(SettingsContainer);
