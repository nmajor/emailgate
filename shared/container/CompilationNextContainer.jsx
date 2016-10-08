import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class CompilationNextContainer extends Component {
  componentWillMount() {
    console.log('blah');
    if (!this.props.compilation.title) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/title`);
    // } else if (_.find(this.props.compilationPages, { type: 'message-page' })) {
    //   this.context.router.push(`/compilations/${this.props.compilation._id}/build/message`);
    } else if (this.props.compilationEmails.length === 0) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/add-emails`);
    } else {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
    }
  }
  render() {
    return (<div></div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationNextContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationNextContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationNextContainer);
