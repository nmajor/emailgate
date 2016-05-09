import React, { PropTypes, Component } from 'react';
import CompilationBuildContainer from './CompilationBuildContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
  }

  render() {
    return (<CompilationBuildContainer currentEmail={this.currentEmail} compilation={this.props.compilation} >
      {this.props.children}
    </CompilationBuildContainer>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

CompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEmailsContainer.propTypes = {
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationEmailsContainer);
