import React, { PropTypes, Component } from 'react';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import AccountFormContainer from './AccountFormContainer';
// import { connect } from 'react-redux';

class CompilationNewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.back = this.back.bind(this);
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/post-next`);
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/build/add-emails`;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <AccountFormContainer new account={{}} submitForm={this.create} back={this.back} userReturnTo={this.userReturnTo()} />
      </Modal>
    </div>);
  }
}

CompilationNewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationNewAccountContainer.propTypes = {
  compilation: PropTypes.array.isRequired,
};

export default CompilationNewAccountContainer;
