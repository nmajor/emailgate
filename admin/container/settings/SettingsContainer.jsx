import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import SettingFormContainer from './SettingFormContainer';
import ScreencastHelpForm from '../../components/settings/ScreencastHelpForm';
import SitewideDiscountForm from '../../components/settings/SitewideDiscountForm';

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
      <SettingFormContainer name="designCoverScreencastHelp" form={ScreencastHelpForm} />
      <SettingFormContainer name="addEmailsScreencastHelp" form={ScreencastHelpForm} />
      <SettingFormContainer name="editCompilationScreencastHelp" form={ScreencastHelpForm} />
      <SettingFormContainer name="sitewideDiscount" form={SitewideDiscountForm} />
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
