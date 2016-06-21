import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CompilationsList from '../components/CompilationsList';
import Loading from '../components/Loading';

class CompilationsListContainer extends Component {
  componentDidMount() {
    if (this.props.compilations.length < 1 && !this.props.fetching.compilations) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  renderCompilationsList() {
    if (this.props.fetching.compilations) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return <CompilationsList compilations={this.props.compilations} />;
  }

  render() {
    return (
      <div className="compilations-list-container">
        {this.renderCompilationsList()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    fetching: store.fetching,
  };
}

CompilationsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationsListContainer);
