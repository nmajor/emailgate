import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
// import _ from 'lodash';

class ScreencastHelpForm extends Component { // eslint-disable-line
  render() {
    const {
      fields: {
        videoUrl,
      },
      error,
      submitting,
      handleSubmit,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Video Url</label>
            <input type="text" className="form-control" {...videoUrl} />
          </div>
        </div>
      </div>
      <div className="form-group text-right">
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-success marginless-right" type="submit">Submit</button>
        {submitting && <div>saving</div>}
      </div>
    </form>);
  }
}

ScreencastHelpForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

const form = compose(
  connect((state, props) => ({ form: `setting-${props.setting.name}` })),
  reduxForm({ // eslint-disable-line no-class-assign
    form: 'screencastHelp',
    fields: [
      'videoUrl',
    ],
  })
)(ScreencastHelpForm);

export default form;
