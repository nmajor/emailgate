import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class RegisterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
  }

  register(name, email, password) {
    this.props.dispatch(Actions.registerUser({ name, email, password }));
  }

  render() {
    return (
      <div className="login-container">
        <Header />
        <RegisterForm registerUser={this.register} errors={this.props.user.errors} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

RegisterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(RegisterContainer);
