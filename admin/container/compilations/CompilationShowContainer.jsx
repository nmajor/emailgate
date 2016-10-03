import React, { PropTypes, Component } from 'react';
import CompilationView from '../../components/compilations/CompilationView';

class CompilationShowContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <CompilationView compilation={this.props.compilation} />
    </div>);
  }
}

CompilationShowContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationShowContainer;
