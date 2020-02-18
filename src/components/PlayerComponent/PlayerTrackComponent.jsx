import React from 'react';
import './PlayerTrackComponent.scss';

export default class PlayerTrack extends React.Component {
  constructor() {
    super();
    this.state = {
      hoverBarWidth: 0,
      instTime: '',
      showHoverTime: false,
      seekLoc: 0
    };
    this.sArea = React.createRef();
  }

  showHover = event => {
    const { trackDuration } = this.props;
    const sArea = this.sArea.current;
    const seekBarPos = sArea.getBoundingClientRect();
    const newHoverBarWidth = event.clientX - seekBarPos.left;
    const newSeekLoc = (trackDuration * newHoverBarWidth) / sArea.offsetWidth;

    const cM = newSeekLoc / 60;

    let ctMinutes = Math.floor(cM);
    let ctSeconds = Math.floor(newSeekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = '0' + ctMinutes;
    if (ctSeconds < 10) ctSeconds = '0' + ctSeconds;

    const newInstTime =
      isNaN(ctMinutes) || isNaN(ctSeconds) ? '--:--' : ctMinutes + ':' + ctSeconds;

    this.setState({
      instTime: newInstTime,
      showHoverTime: true,
      hoverBarWidth: newHoverBarWidth,
      seekLoc: newSeekLoc
    });
  };

  hideHover = () => {
    this.setState({
      showHoverTime: false,
      hoverBarWidth: 0
    });
  };

  clickedPos = () => {
    const { playFromClickedPos } = this.props;
    const { hoverBarWidth, seekLoc } = this.state;

    playFromClickedPos(hoverBarWidth, seekLoc);
    this.hideHover();
  };

  showHoverTimeIndicator = () => {
    const { showHoverTime, instTime, hoverBarWidth } = this.state;
    if (!showHoverTime) {
      return null;
    }
    return (
      <div className="ins-time" style={{ left: hoverBarWidth }}>
        {instTime ? instTime : ''}
      </div>
    );
  };

  render() {
    const { hoverBarWidth } = this.state;
    const { currentSong, tProgress, tTime, seekBarWidth, playing } = this.props;
    const songInfo = currentSong ? currentSong : { album: '', trackName: '' };
    const barWidth = seekBarWidth ? seekBarWidth : 0;
    const trackPlayerClass = playing ? 'player-track active' : 'player-track';

    return (
      <div className={trackPlayerClass}>
        <div className="album-name">{songInfo.album}</div>
        <div className="track-name">{songInfo.trackName}</div>
        <div className="track-time">
          <div className="current-time">{tProgress ? tProgress : ''}</div>
          <div className="track-length">{tTime ? tTime : ''}</div>
        </div>
        <div
          className="s-area"
          ref={this.sArea}
          onClick={this.clickedPos}
          onMouseMove={event => this.showHover(event)}
          onMouseLeave={this.hideHover}
        >
          {this.showHoverTimeIndicator()}
          <div className="s-hover" style={{ width: hoverBarWidth }} />
          <div className="seek-bar" style={{ width: barWidth }} />
        </div>
      </div>
    );
  }
}
