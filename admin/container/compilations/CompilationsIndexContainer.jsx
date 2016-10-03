import React, { PropTypes, Component } from 'react';
import CompilationsList from '../../components/compilations/CompilationsList';

class CompilationsIndexContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Compilations</h1>
      <CompilationsList compilations={this.props.compilations} />
    </div>);
  }
}

CompilationsIndexContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array.isRequired,
};

export default CompilationsIndexContainer;
