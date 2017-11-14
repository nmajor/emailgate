import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class WebpageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.params.compilationId) {
      this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    } else {
      this.compilation = {};
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
  }
  renderChildren() {
    if (this.props.children && !_.isEmpty(this.compilation)) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation });
      });
    }
  }
  render() {
    return (
      <div className="new-compilation-container">
        <Header />
        {this.renderChildren()}
        <Footer />
      </div>
    );
  }
}

WebpageContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, { compilationId: params.compilationId }, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    user: store.user,
    compilations: store.compilations,
  };
}

WebpageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

WebpageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  compilations: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(WebpageContainer);
