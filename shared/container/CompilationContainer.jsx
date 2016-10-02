import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import CompilationNav from '../components/CompilationNav';
import CompilationHeader from '../components/CompilationHeader';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import * as sharedHelpers from '../helpers';
import _ from 'lodash';

class CompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    this.currentCompilationPath = this.props.routes[this.props.routes.length - 1].path.split('/')[3];
  }
  componentDidMount() {
    if (this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationEmails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails(this.props.params.compilationId));
    }

    if (this.props.compilationPages.length < 1) {
      this.props.dispatch(Actions.getCompilationPages(this.props.params.compilationId));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
    this.currentCompilationPath = nextProps.routes[nextProps.routes.length - 1].path.split('/')[3];
  }
  componentWillUnmount() {
    if (window.previousLocation) {
      this.props.dispatch(Actions.setCompilationEmails([]));
      this.props.dispatch(Actions.setCompilationPages([]));
    }
  }

  actionStatusMap() {
    return sharedHelpers.actionStatusMap(this.compilation, this.props.compilationEmails, this.props.compilationPages);
  }
  renderChildren() {
    if (this.props.children && !_.isEmpty(this.compilation)) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation });
      });
    }
  }
  renderCompilation() {
    if (!_.isEmpty(this.compilation)) {
      return (<div>
        <Header />
        <CompilationHeader compilation={this.compilation} />
        <div className="container-fluid compilation-container">
          {this.renderChildren()}
        </div>
        <Footer />
      </div>);
    }

    return 'Loading Compilation ...';
  }

  render() {
    return (<div>
      {this.renderCompilation()}
    </div>);
  }
}

CompilationContainer.need = [
  (params, cookie) => {
    return Actions.getAccounts.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationPages.bind(null, params.compilationId, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationEmails.bind(null, params.compilationId, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    accounts: store.accounts,
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  accounts: PropTypes.array,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  compilationPages: PropTypes.array,
  fetching: PropTypes.object.isRequired,
  params: PropTypes.object,
  routes: PropTypes.array,
};

export default connect(mapStateToProps)(CompilationContainer);
