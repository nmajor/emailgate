import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationHeader from '../components/CompilationHeader';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    this.currentCompilationPath = this.props.routes[this.props.routes.length - 1].path.split('/')[3];

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
    this.props.dispatch(Actions.setCompilationEmails([]));
    this.props.dispatch(Actions.setCompilationPages([]));
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
        <CompilationNav
          compilationId={this.props.params.compilationId}
          currentPath={this.currentCompilationPath}
          emailCount={this.props.compilationEmails.length}
        />
        <div className="container">
          { this.renderChildren() }
        </div>
      </div>);
    }

    return 'Loading Compilation ...';
  }

  render() {
    return (
      <div>
        {this.renderCompilation()}
      </div>
    );
  }
}

CompilationEmailsContainer.need = [
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
  // (params, cookie) => {
  //   return Actions.getCompilationEmailPageMap.bind(null, params.compilationId, cookie)();
  // },
];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  accounts: PropTypes.array,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  compilationPages: PropTypes.array,
  params: PropTypes.object,
  routes: PropTypes.array,
};

export default connect(mapStateToProps)(CompilationEmailsContainer);
