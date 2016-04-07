import React, { PropTypes, Component } from 'react';

class AdminDashboard extends Component {
  renderCompilationPdfLink(compilation) {
    if (compilation.pdf && compilation.pdf.url) {
      return (<a href={compilation.pdf.url} className="btn btn-primary btn-xs">
        <span className="glyphicon glyphicon-open-file" aria-hidden="true"></span>
      </a>);
    }
  }
  renderCompilations() {
    return this.props.compilations.map((compilation) => {
      return <div>{compilation.name} {this.renderCompilationPdfLink(compilation)}</div>;
    });
  }
  renderUsers() {
    return this.props.users.map((user) => {
      return <div>{user.name} - {user.email}</div>;
    });
  }
  render() {
    return (<div className="container">
      <h1>Compilations</h1>
      {this.renderCompilations()}

      <h1>Users</h1>
      {this.renderUsers()}
    </div>);
  }
}

AdminDashboard.propTypes = {
  compilations: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default AdminDashboard;
