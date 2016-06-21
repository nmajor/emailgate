import React, { PropTypes, Component } from 'react';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';
import UpdatePasswordForm from '../components/UpdatePasswordForm';
import _ from 'lodash';
import { reset } from 'redux-form';

class UpdatePasswordContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);

    this.state = { submitSuccess: false };
  }
  flashSuccess() {
    this.setState({ submitSuccess: 'Password updated' });

    setTimeout(() => {
      this.setState({ submitSuccess: false });
    }, 3000);
  }
  submit(props) {
    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.updatePassword(props, (res) => {
        if (res.errors) {
          const errors = {
            _error: 'Could not update password',
          };

          _.forEach(res.errors, (val, key) => {
            errors[key] = val.message;
          });

          reject(errors);
        } else {
          this.props.dispatch(reset('updatePassword'));
          this.flashSuccess();
          resolve();
        }
      }));
    });
  }
  render() {
    return (<div>
      <h3>Update Password</h3>
      <UpdatePasswordForm onSubmit={this.submit} success={this.state.submitSuccess} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

UpdatePasswordContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(UpdatePasswordContainer);
