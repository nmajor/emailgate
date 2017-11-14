import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class PreviewWebpageContainer extends Component {
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    return (<div className="container-fluid">
      <div className="content-box">
        <h1>Preview</h1>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    compilations: store.compilations,
  };
}

PreviewWebpageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

PreviewWebpageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PreviewWebpageContainer);
