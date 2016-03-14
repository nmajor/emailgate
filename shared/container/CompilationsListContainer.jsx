import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CompilationsList from '../components/CompilationsList';

class CompilationsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }
  }

  render() {
    return (
      <div className="compilations-list-container">
        <h3>Compilations</h3>
        <CompilationsList compilations={this.props.compilations} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
  };
}

CompilationsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
};

export default connect(mapStateToProps)(CompilationsListContainer);
