import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class LoginContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);
  }

  login(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }));
  }

  render() {
    return (
      <div className="login-container">
        <Header />
        <LoginForm loginUser={this.login} errors={this.props.user.errors} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

LoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(LoginContainer);
