/* eslint react/prop-types: 0 */
/* eslint no-useless-constructor: 0 */
/* eslint react/jsx-first-prop-new-line: 0 */
/* eslint react/jsx-closing-bracket-location: 0 */

import React from 'react';
import fonts from '../utils/fonts';
import {
  getMeasurementProps,
  getDateProps,
  toStringWrapper,
  hexToRgba,
} from '../utils/helpers';

import BackCoverBase from './BackCoverBase';
import FrontCoverBase from './FrontCoverBase';
import SpineCoverBase from './SpineCoverBase';

export class CoverBase {
  constructor(props) {
    const showBleed = false;
    // const showBleed = props.showBleed || false;

    const primerColor = props.primerColor || '#ff0c0c';
    const backgroundColor = props.backgroundColor || '#444';
    const textColor = props.textColor || '#FFF';

    this.props = {
      showBleed,
      compilation: props.compilation,
      ...getDateProps(props),
      ...getMeasurementProps(props),

      primerColor,
      backgroundColor,
      textColor,

      primaryFont: fonts.abril,
      secondaryFont: fonts.raleway,
      spineFont: 'secondaryFont',
      backCoverFont: 'secondaryFont',
      spineFontWeight: 100,
      backCoverFontWeight: 100,

      selectImage: props.selectImage,
    };

    this.props.opaqueBackgroundColor = hexToRgba(this.props.backgroundColor, 0.7);
    this.props.outerBackgroundColor = showBleed ? this.props.opaqueBackgroundColor : this.props.backgroundColor;

    this.props.outerBoardBaseStyle = {
      display: 'inline-block',
      position: 'relative',
      verticalAlign: 'top',
      width: this.props.coverWidth,
      height: this.props.coverHeight,
    };

    this.props.innerBoardBaseStyle = {
      position: 'relative',
      height: this.props.boardHeight,
      width: this.props.boardWidth,
      marginTop: this.props.bleedWidth,
      marginBottom: this.props.bleedWidth,
    };

    this.props.mainStyle = {
      textAlign: 'left',
      color: this.props.textColor,
      fontSize: '20px',
      letterSpacing: '0.5px',
      fontWeight: '100',
    };
  }
  getCoverDimentions() {
    return { width: this.props.fullWidthPx, height: this.props.fullHeightPx };
  }
  renderDateRange() {
    if (this.props.startDate && this.props.endDate) {
      return <span>{this.props.prettyStartDate} - {this.props.prettyEndDate}</span>;
    }
  }
  renderBackCover() {
    return (<BackCoverBase {...this.props}>
      <div style={{
        position: 'absolute',
        textAlign: 'center',
        bottom: 0,
        marginBottom: '60px',
        width: '100%',
        fontSize: '12px',
      }}>
        <div>www.missionarymemoir.com</div>
      </div>
    </BackCoverBase>);
  }
  renderSpine() {
    const {
      compilation,
      prettyStartDateSmall,
      prettyEndDateSmall,
    } = this.props;

    return (<SpineCoverBase {...this.props}>
      {compilation.title} &middot; {prettyStartDateSmall} - {prettyEndDateSmall}
    </SpineCoverBase>);
  }
  renderFrontCover() {
    const { compilation, prettyStartDate, prettyEndDate } = this.props;

    return (<FrontCoverBase {...this.props}>
      <div style={{
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1>{compilation.title}</h1>
        <h3>{compilation.subtitle}</h3>
        <h5>{prettyStartDate} - {prettyEndDate}</h5>
      </div>
    </FrontCoverBase>);
  }
  render() {
    return (<div
      style={{
        ...this.props.mainStyle,
        width: this.props.fullWidth,
        height: this.props.fullHeight,
        backgroundColor: this.props.primerColor,
      }}
    >
      {this.renderBackCover()}
      {this.renderSpine()}
      {this.renderFrontCover()}
    </div>);
  }
  renderWrappedFrontCover() {
    return (<div
      className="wrapper"
      style={{
        ...this.props.mainStyle,
        width: this.props.coverWidth,
        height: this.props.coverHeight,
        backgroundColor: this.props.primerColor,
      }}
    >
      {this.renderFrontCover()}
    </div>);
  }
  toString() {
    return toStringWrapper({ render: this.render.bind(this), ...this.props });
  }
  frontCoverToString() {
    return toStringWrapper({ render: this.renderWrappedFrontCover.bind(this), ...this.props });
  }
}



export default CoverBase;
