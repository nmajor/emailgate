import React, { PropTypes, Component } from 'react';
import CompilationPdf from '../components/CompilationPdf';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;
  }
  componentDidMount() {
    this.props.dispatch(Actions.getCompilationPdf(this.props.params.compilationId));
  }

  render() {
    return (
      <div className="edit-account-container container">
        <h1>Compilation Preview</h1>
        <div className="row">
          <div className="col-md-12">
            <CompilationPdf compilation={this.compilation} />
          </div>
        </div>
      </div>
    );
  }
}

CompilationPreviewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(CompilationPreviewContainer);
