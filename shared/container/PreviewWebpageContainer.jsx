import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Vanilla from '../templates/webpage/Vanilla';
// import * as Actions from '../redux/actions/index';

class PreviewWebpageContainer extends Component {
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    const template = new Vanilla({ compilation: this.props.compilation });

    return <div>{template.render()}</div>;
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
