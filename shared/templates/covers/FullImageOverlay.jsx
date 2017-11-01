/* eslint react/prop-types: 0 */
/* eslint no-useless-constructor: 0 */
/* eslint react/jsx-first-prop-new-line: 0 */
/* eslint react/jsx-closing-bracket-location: 0 */

import React from 'react';
import CoverBase from './base/CoverBase';
import FrontCoverBase from './base/FrontCoverBase';
import CoverImage from './utils/CoverImage';
import fonts from './utils/fonts';

class FullImageOverlay extends CoverBase {
  constructor(props) {
    super(props);

    this.props.backgroundColor = '#333';

    this.props.outerBackgroundColor = this.props.showBleed ? this.props.opaqueBackgroundColor : this.props.backgroundColor;

    this.props.textColor = '#FFF';
    this.props.primaryFont = fonts.raleway;
    this.props.secondaryFont = fonts.lato;
  }
  renderFrontCover() {
    const {
      compilation,
      boardHeightPx,
      boardWidthPx,
      boardHeight,
      boardWidth,
      selectImage,
      primaryFont,
      secondaryFont,
    } = this.props;

    const aspect = (boardWidthPx / boardHeightPx);

    const imageWidth = boardWidthPx;
    const imageHeight = boardHeightPx;

    const defaultImage = {
      url: '/img/cover-images/field-standing.jpg',
      crop: {
        height: 911,
        naturalHeight: 945,
        naturalWidth: 900,
        width: 573,
        x: 150,
        y: 34,
      },
    };

    const contentPad = 30;
    const contentWidth = boardWidthPx - (contentPad * 2);

    const coverProps = {
      aspect,
      key: 'full-image-overlay-front',
      defaultImage,
    };

    return (<FrontCoverBase {...this.props}>
      <div className="1" style={{
        position: 'absolute',
        top: 0,
        height: boardHeight,
        width: boardWidth,
        opacity: 0.6,
      }}>
        <CoverImage
          height={imageHeight}
          width={imageWidth}
          selectImage={selectImage}
          coverProps={coverProps}
          compilation={compilation}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: 40,
        fontSize: '35px',
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        left: contentPad,
        width: `${contentWidth}px`,
        letterSpacing: '3px',
        fontFamily: primaryFont.family,
      }}>{compilation.title}</div>
      <div style={{
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
        left: contentPad,
        width: `${contentWidth}px`,
      }}>
        <div style={{
          fontSize: '25px',
          fontStyle: 'italic',
          fontFamily: secondaryFont.family,
        }}>{compilation.subtitle}</div>
        <div style={{
          marginTop: '15px',
          fontSize: '18px',
          fontWeight: '200',
          fontFamily: primaryFont.family,
        }}>{this.renderDateRange()}</div>
      </div>
    </FrontCoverBase>);
  }
}

export default FullImageOverlay;
