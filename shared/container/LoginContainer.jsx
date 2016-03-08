import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class LoginContainer extends Component {
  login(email, password) {
    this.props.dispatch(Actions.submitLogin({ email, password }));
  }

  render() {
    return <div className="login-container">
      <Header />
      <LoginForm submitLogin={this.login} />
    </div>
  }
}

function mapStateToProps(store) {
  return {};
}

LoginContainer.propTypes = {};

export default connect(mapStateToProps)(LoginContainer);
