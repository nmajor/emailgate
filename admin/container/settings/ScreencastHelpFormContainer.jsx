import React, { PropTypes, Component } from 'react';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';
import { connect } from 'react-redux';
import ScreencastHelpForm from '../../components/settings/ScreencastHelpForm';

class ScreencastHelpFormContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.setting = _.find(props.settings, (setting) => { return setting.name === props.name; });

    if (this.setting) {
      this.setting = { ...this.setting, ...this.setting.value };
    }
  }
  update(props) {
    return new Promise((resolve) => {
      this.props.dispatch(Actions.updateSetting(this.props.name, props, () => {
        resolve();
      }));
    });
  }
  camelCaseToWords(str) {
    return str.match(/^[a-z]+|[A-Z][a-z]*/g).map((x) => {
      return x[0].toUpperCase() + x.substr(1).toLowerCase();
    }).join(' ');
  }
  renderTitle() {
    return (<h3>{this.camelCaseToWords(this.props.name)}</h3>);
  }
  render() {
    return (<div className="content-box top-bumper">
      {this.renderTitle()}
      <ScreencastHelpForm setting={this.setting || {}} initialValues={this.setting || {}} onSubmit={this.update} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    settings: store.settings,
  };
}

ScreencastHelpFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  settings: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(ScreencastHelpFormContainer);
