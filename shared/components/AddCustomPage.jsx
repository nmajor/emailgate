import React, { PropTypes, Component } from 'react';

class AddCustomPage extends Component {
  render() {
    return (<div onClick={this.props.add} className="add-page-link">
      Add a custom page here
    </div>);
  }
}

AddCustomPage.propTypes = {
  add: PropTypes.func.isRequired,
};

export default AddCustomPage;
