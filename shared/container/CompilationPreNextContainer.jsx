import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class CompilationPreNextContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.compilationHasCoverTemplate = this.compilationHasCoverTemplate.bind(this);
    this.compilationHasEmails = this.compilationHasEmails.bind(this);
  }
  componentWillMount() {
    if (!this.compilationHasCoverTemplate()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/title`);
    // } else if (_.find(this.props.compilationPages, { type: 'message-page' })) {
    //   this.context.router.push(`/compilations/${this.props.compilation._id}/build/message`);
    } else if (!this.compilationHasEmails()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/add-emails`);
    } else {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
    }
  }
  compilationHasCoverTemplate() {
    console.log(this.props.compilation);
    return !!(this.props.compilation.coverTemplate);
  }
  compilationHasEmails() {
    const emailIds = this.props.compilation.emails || [];
    return emailIds.length > 0;
  }
  render() {
    return (<div></div>);
  }
}

// function mapStateToProps(store) {
//   return {
//     compilationEmails: store.compilationEmails,
//     compilationPages: store.compilationPages,
//   };
// }

CompilationPreNextContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreNextContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  // compilationEmails: PropTypes.array.isRequired,
  // compilationPages: PropTypes.array.isRequired,
};

export default connect()(CompilationPreNextContainer);
