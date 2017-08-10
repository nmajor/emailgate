import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import CompilationsListItem from './CompilationsListItem';

class CompilationsList extends Component {
  renderCompilationListItems(compilations) {
    return compilations.map((compilation, index) => {
      return <CompilationsListItem key={compilation._id | index} compilation={compilation} />;
    });
  }
  renderCompilationsList() {
    const compDateGroups = _.reduce(this.props.compilations, (acc, compilation) => {
      const dateKey = new Date(compilation.updatedAt).toDateString();
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(compilation);
      return acc;
    }, {});

    const compDateGroupsArray = _.sortBy(_.map(compDateGroups, (val, key) => {
      return { date: key, compilations: val };
    }), (compGroup) => { return new Date(compGroup.date); }).reverse();

    return _.map(compDateGroupsArray, (compGroup, index) => {
      return (<div key={index}>
        <h3>{moment(compGroup.date).format('LL')}</h3>
        {this.renderCompilationListItems(compGroup.compilations)}
      </div>);
    });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          {this.renderCompilationsList()}
        </div>
      </div>
    );
  }
}

CompilationsList.propTypes = {
  compilations: PropTypes.array.isRequired,
};

export default CompilationsList;
