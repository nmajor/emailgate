import React, { PropTypes, Component } from 'react';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class LoginContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPropertyUser('loggingIn', undefined));
    this.props.dispatch(Actions.setPropertyUser('errors', undefined));
  }

  login(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }, this.redirectToDashboard));
  }

  redirectToDashboard() {
    this.context.router.push('/');
  }

  render() {
    return (<div className="login-container">
      <LoginForm loginUser={this.login} errors={this.props.user.errors} user={this.props.user} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

LoginContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

LoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(LoginContainer);
