import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class CompilationPreNextContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.compilationHasTitle = this.compilationHasTitle.bind(this);
    this.compilationHasEmails = this.compilationHasEmails.bind(this);
  }
  componentWillMount() {
    if (!this.compilationHasTitle()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/title`);
    // } else if (_.find(this.props.compilationPages, { type: 'message-page' })) {
    //   this.context.router.push(`/compilations/${this.props.compilation._id}/build/message`);
    } else if (!this.compilationHasEmails()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/add-emails`);
    } else {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
    }
  }
  compilationHasTitle() {
    return !!(this.props.compilation.title);
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
