import React, { PropTypes, Component } from 'react';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';
import ResetPasswordForm from '../components/ResetPasswordForm';
import _ from 'lodash';
import { reset } from 'redux-form';
import Header from '../components/Header';

class ResetPasswordContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);

    this.state = { submitSuccess: '' };
  }
  flashSuccess() {
    this.setState({ submitSuccess: 'Password reset!' });

    setTimeout(() => {
      this.setState({ submitSuccess: '' });
    }, 3000);
  }
  submit(props) {
    props.token = this.props.params.token; // eslint-disable-line no-param-reassign

    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.resetPassword(props, (res) => {
        if (res.errors) {
          const errors = {};

          _.forEach(res.errors, (val, key) => {
            errors[key] = val.message;
          });

          reject(errors);
        } else {
          this.props.dispatch(reset('resetPassword'));
          this.flashSuccess();
          resolve();
        }
      }));
    });
  }
  render() {
    return (<div>
      <Header />
      <ResetPasswordForm onSubmit={this.submit} success={this.state.submitSuccess} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

ResetPasswordContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ResetPasswordContainer);
