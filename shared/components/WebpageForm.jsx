import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import DragCropImageSelector from './DragCropImageSelector';
import _ from 'lodash';
import Loading from './Loading';

class WebpageForm extends Component { // eslint-disable-line
  constructor(props) {
    super(props);

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
  }
  handleImageChange(props) {
    this.props.fields.webpage.imageCrop.onChange(props);
  }
  handleNewImage(props, cb) {
    this.props.submitImage(props, cb);
  }
  render() {
    const {
      fields: {
        slug,
        webpage,
        startingDate,
        endingDate,
        mission,
      },
      submitting,
      error,
      handleSubmit,
    } = this.props;

    const slugPlaceholder = 'elderjohnjohnson';

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 text-center bottom-bumper">
          <DragCropImageSelector
            url={_.get(this.props.compilation, 'webpage.image.url')}
            crop={_.get(this.props.compilation, 'webpage.imageCrop')}
            onImageChange={this.handleImageChange}
            onNewImage={this.handleNewImage}
            height={500}
            width={500}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Page Title</label>
            <input type="text" className="form-control" {...webpage.title} placeholder="Elder John Johnson's Mission" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Subdomain</label>
            <input type="text" className="form-control" {...slug} placeholder={slugPlaceholder} />
            <div className="help-block">Pleople will be able to access your webpage by going to:<br />{slug.value || slugPlaceholder}.missionarymemoir.com</div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Mission Start Date</label>
            <DatePicker
              className="form-control"
              {...startingDate}
              name="Start Date"
              showYearDropdown
              fixedHeight
              dateFormat="YYYY/M/D"
              minDate={moment(new Date, 'YYYY/M/D')}
              selected={startingDate.value ? moment(startingDate.value, 'YYYY/M/D') : null}
              onChange={(params) => { startingDate.onChange(params); }}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Mission End Date</label>
            <DatePicker
              className="form-control"
              {...endingDate}
              name="Start Date"
              showYearDropdown
              fixedHeight
              dateFormat="YYYY/M/D"
              minDate={moment(new Date, 'YYYY/M/D')}
              selected={endingDate.value ? moment(endingDate.value, 'YYYY/M/D') : null}
              onChange={(params) => { endingDate.onChange(params); }}
            />
          </div>
        </div>
      </div>
      <hr />
      <h3 className="text-center">Mission Home Information</h3>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Mission Name</label>
            <input type="text" className="form-control" {...mission.name} placeholder="Guatemala Guatemala City South Mission" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Address 1</label>
            <input type="text" className="form-control" {...mission.address_1} />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Address 2</label>
            <input type="text" className="form-control" {...mission.address_2} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">City</label>
            <input type="text" className="form-control" {...mission.city} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">State</label>
            <input type="text" className="form-control" {...mission.state} placeholder="" />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Postal Code</label>
            <input type="text" className="form-control" {...mission.postal_code} placeholder="" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Country</label>
            <input type="text" className="form-control" {...mission.country} placeholder="" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group text-right">
            {error && <div className="text-danger">{error}</div>}
            <button className="btn btn-success marginless-right" type="submit">Submit {submitting && <span className="button-loading"><Loading /></span>}</button>
          </div>
        </div>
      </div>
    </form>);
  }
}

WebpageForm.propTypes = {
  compilation: PropTypes.object.isRequired,
  submitImage: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

WebpageForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'webpage',
  fields: [
    'slug',
    'webpage.title',
    'webpage.imageCrop',
    'startingDate',
    'endingDate',
    'mission.name',
    'mission.address_1',
    'mission.address_2',
    'mission.city',
    'mission.state',
    'mission.postal_code',
    'mission.country',
  ],
})(WebpageForm);

export default WebpageForm;
