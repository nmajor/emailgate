import React, { PropTypes, Component } from 'react';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';
import { connect } from 'react-redux';

class SettingFormContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.setting = _.find(props.settings, (setting) => { return setting.name === props.name; });

    if (this.setting) {
      this.setting = { name: this.setting.name, ...this.setting.value };
    } else {
      this.setting = { name: `${(new Date).getTime()}` };
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setting = _.find(nextProps.settings, (setting) => { return setting.name === nextProps.name; });

    if (this.setting) {
      this.setting = { name: this.setting.name, ...this.setting.value };
    } else {
      this.setting = { name: `${(new Date).getTime()}` };
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
    const Form = this.props.form;
    return (<div className="content-box top-bumper">
      {this.renderTitle()}
      <Form setting={this.setting} initialValues={this.setting} onSubmit={this.update} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    settings: store.settings,
  };
}

SettingFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  settings: PropTypes.array.isRequired,
  form: PropTypes.func,
};

export default connect(mapStateToProps)(SettingFormContainer);
