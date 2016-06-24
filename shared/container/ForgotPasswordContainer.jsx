import React, { PropTypes, Component } from 'react';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import _ from 'lodash';
import { reset } from 'redux-form';
import Header from '../components/Header';

class ForgotPasswordContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);

    this.state = { submitSuccess: '' };
  }
  flashSuccess() {
    this.setState({ submitSuccess: 'Password reset sent' });

    setTimeout(() => {
      this.setState({ submitSuccess: '' });
    }, 3000);
  }
  submit(props) {
    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.forgotPassword(props, (res) => {
        if (res.errors) {
          const errors = { _error: res.errors.base };

          _.forEach(res.errors, (val, key) => {
            errors[key] = val.message;
          });

          reject(errors);
        } else {
          this.props.dispatch(reset('forgotPassword'));
          this.flashSuccess();
          resolve();
        }
      }));
    });
  }
  render() {
    return (<div>
      <Header />
      <ForgotPasswordForm onSubmit={this.submit} success={this.state.submitSuccess} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

ForgotPasswordContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ForgotPasswordContainer);
