import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationView from '../../components/compilations/CompilationView';
import * as Actions from '../../redux/actions/index';

class CompilationShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.buildPdf = this.buildPdf.bind(this);
    this.buildCoverPdf = this.buildCoverPdf.bind(this);
    this.submitSpineWidth = this.submitSpineWidth.bind(this);
    this.resaveAllComponents = this.resaveAllComponents.bind(this);
    this.clearCompilationLogs = this.clearCompilationLogs.bind(this);
  }
  buildPdf() {
    this.props.dispatch(Actions.buildCompilationPdf(this.props.compilation._id));
  }
  buildCoverPdf() {
    this.props.dispatch(Actions.buildCompilationCoverPdf(this.props.compilation._id));
  }
  submitSpineWidth(spineWidth) {
    this.props.dispatch(Actions.updateCompilation(this.props.compilation._id, { cover: { spineWidth } }));
  }
  resaveAllComponents() {
    this.props.dispatch(Actions.resaveAllComponents(this.props.compilation._id));
  }
  clearCompilationLogs() {
    this.props.dispatch(Actions.clearCompilationLogs(this.props.compilation._id));
  }
  render() {
    return (<div>
      <CompilationView compilation={this.props.compilation} buildPdf={this.buildPdf} buildCoverPdf={this.buildCoverPdf} submitSpineWidth={this.submitSpineWidth} resaveAllComponents={this.resaveAllComponents} clearCompilationLogs={this.clearCompilationLogs} />
    </div>);
  }
}

CompilationShowContainer.propTypes = {
  dispatch: PropTypes.func,
  compilation: PropTypes.object,
};

export default connect()(CompilationShowContainer);
