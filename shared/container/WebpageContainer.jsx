import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import WebpageProgressHeader from '../components/WebpageProgressHeader';

class WebpageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.params.compilationId) {
      this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    } else {
      this.compilation = {};
    }

    this.currentCompilationPath = this.getCurrentPath(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
    this.currentCompilationPath = this.getCurrentPath(nextProps);
  }
  getCurrentPath(props) {
    const path = props.routes[props.routes.length - 1].path;
    return path.split('/')[4];
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
        <WebpageProgressHeader compilation={this.compilation} currentPath={this.currentCompilationPath} />
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
