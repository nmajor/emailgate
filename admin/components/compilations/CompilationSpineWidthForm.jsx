import React, { Component, PropTypes } from 'react';

class CompilationSpineWidthForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();

    const spineWidthRef = this.refs.spineWidth;
    if (spineWidthRef.value) {
      this.props.submit(spineWidthRef.value);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  renderForm() {
    return (<form onSubmit={this.handleSubmit} className="form-inline">
      {this.renderSpineWidthFormGroup()}
      <button className="btn btn-success left-bumper" onClick={this.submit}>Submit</button>
    </form>);
  }
  renderSpineWidthFormGroup() {
    return (
      <div className="form-group">
        <label className="right-bumper" htmlFor="login-password">SpineWidth:</label>
        <input
          defaultValue={this.props.compilation.cover.spineWidth}
          ref="spineWidth"
          className="form-control"
          type="text"
          id="spine-width"
        />
      </div>
    );
  }
  render() {
    return (<div>
      <div><strong>Example ISBN</strong>: 9783161484100</div>
      <div><strong>CompilationPdfPages</strong>: {this.props.compilation.pdf.pageCount}</div>
      <div><a target="_blank" href="https://myaccount.lightningsource.com/Portal/Tools/SpineCalculator">Spine Width Calculator</a></div>
      {this.renderForm()}
    </div>);
  }
}

CompilationSpineWidthForm.propTypes = {
  submit: PropTypes.func.isRequired,
  compilation: PropTypes.object,
};

export default CompilationSpineWidthForm;
