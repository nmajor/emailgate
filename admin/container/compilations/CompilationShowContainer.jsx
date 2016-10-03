import React, { PropTypes, Component } from 'react';
import CompilationView from '../../components/compilations/CompilationView';

class CompilationShowContainer extends Component { // eslint-disable-line
  buildPdf() {
    
  }
  render() {
    return (<div>
      <CompilationView compilation={this.props.compilation} buildPdf={this.buildPdf} />
    </div>);
  }
}

CompilationShowContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationShowContainer;
