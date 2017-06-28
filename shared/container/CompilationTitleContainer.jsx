import React, { PropTypes, Component } from 'react';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationTitleContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.update = this.update.bind(this);
    this.back = this.back.bind(this);
  }
  update(props) {
    this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, props, (compilation) => {
      this.context.router.push(`/compilations/${compilation._id}/build`);
    }));
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  render() {
    return (<div className="container compilation-container">
      <div className="compilation-content-box">
        <h1 className="text-center">Customize Cover</h1>
        <CompilationTitleForm compilation={this.props.compilation} submitForm={this.update} fetching={this.props.compilation.saving} back={this.back} />
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

CompilationTitleContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationTitleContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
  compilationEmails: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationTitleContainer);
