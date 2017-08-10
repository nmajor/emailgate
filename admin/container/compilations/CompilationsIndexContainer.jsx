import React, { PropTypes, Component } from 'react';
import CompilationsList from '../../components/compilations/CompilationsList';
import _ from 'lodash';

class CompilationsIndexContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.state = {
      hideTmp: false,
      hideAdmin: false,
    };

    this.toggleHideTmp = this.toggleHideTmp.bind(this);
    this.toggleHideAdmin = this.toggleHideAdmin.bind(this);
  }
  filteredCompilations() {
    let compilations = [...this.props.compilations];

    if (this.state.hideTmp) {
      compilations = _.filter(compilations, (compilation) => {
        return !compilation._user.isTmp;
      });
    }

    if (this.state.hideAdmin) {
      compilations = _.filter(compilations, (compilation) => {
        const adminEmails = ['nick@nmajor.com', 'king.benjamin012@gmail.com'];
        return adminEmails.indexOf(compilation._user.email) === -1;
      });
    }
    return compilations;
  }
  toggleHideTmp() {
    this.setState({ hideTmp: !this.state.hideTmp });
  }
  toggleHideAdmin() {
    this.setState({ hideAdmin: !this.state.hideAdmin });
  }
  renderHideTmpButton() {
    if (this.state.hideTmp) {
      return (<span className="btn btn-default" onClick={this.toggleHideTmp}>Show Compilations Created By a Temp User</span>);
    }

    return (<span className="btn btn-success" onClick={this.toggleHideTmp}>Hide Compilations Created By a Temp User</span>);
  }
  renderHideAdminButton() {
    if (this.state.hideAdmin) {
      return (<span className="btn btn-default" onClick={this.toggleHideAdmin}>Show Compilations Created By an Admin</span>);
    }

    return (<span className="btn btn-success" onClick={this.toggleHideAdmin}>Hide Compilations Created By an Admin</span>);
  }
  renderFilterActions() {
    return (<div>
      {this.renderHideTmpButton()}
      <span className="left-bumper" />
      {this.renderHideAdminButton()}
    </div>);
  }
  render() {
    const compilations = this.filteredCompilations();

    return (<div>
      <h1>Showing {compilations.length} Compilations</h1>
      {this.renderFilterActions()}
      <CompilationsList compilations={compilations} />
    </div>);
  }
}

CompilationsIndexContainer.propTypes = {
  dispatch: PropTypes.func,
  compilations: PropTypes.array,
};

export default CompilationsIndexContainer;
