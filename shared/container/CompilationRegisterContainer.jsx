import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CompilationBuildContainer from './CompilationBuildContainer';
import Modal from '../components/Modal';
import RegisterForm from '../components/RegisterForm';

class CompilationRegisterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
    this.back = this.back.bind(this);
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPropertyUser('loggingIn', undefined));
    this.props.dispatch(Actions.setPropertyUser('errors', undefined));
  }
  back() {
    if (this.props.params.next === 'post') {
      return this.context.router.push(`/compilations/${this.props.compilation._id}/post-next`);
    }

    return this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  register(name, email, password) {
    this.props.dispatch(Actions.registerUser({ name, email, password }, this.back));
  }
  renderLoginLink() {
    let link = `/compilations/${this.props.compilation._id}/build/login`;
    if (this.props.params.next === 'post') {
      link += '/post';
    }
    return <Link to={link}>Already have an account? Click here to login and connect this Email Book.</Link>;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div>
          <h3>Just give us some info and we will save your Email Book for later.</h3>
          <RegisterForm registerUser={this.register} errors={this.props.user.errors} user={this.props.user} />
          <div className="top-bumper">
            {this.renderLoginLink()}
          </div>
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

CompilationRegisterContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationRegisterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationRegisterContainer);
