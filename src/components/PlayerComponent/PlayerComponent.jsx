import React from 'react';
import './PlayerComponent.scss';
import { connect } from 'react-redux';
import rootActions from '../../actions/rootActions';
import PlayerTrack from './PlayerTrackComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PlayerComponent extends React.Component {
  audio = new Audio();
  bTime = 0;
  nTime = 0;
  buffInterval = null;

  state = {
    currIndex: null,
    seekBarWidth: 0,
    tProgress: '00:00',
    tTime: '00:00',
    buffering: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(rootActions.tracksActions.fetchTracks()).then(() => {
      this.selectTrack(0);
      this.audio.loop = false;
      this.audio.addEventListener('timeupdate', this.updateCurrTime);
    });
  }

  componentWillUnmount() {
    this.audio.removeEventListener('timeupdate', () => {});
  }

  selectTrack = flag => {
    const { currIndex } = this.state;
    const { trackList } = this.props;
    const newIndex =
      currIndex + flag >= 0 && currIndex + flag < trackList.length
        ? currIndex + flag
        : flag < 0
        ? 0
        : trackList.length - 1;

    if (newIndex !== currIndex) {
      this.setState({
        currIndex: newIndex,
        seekBarWidth: 0,
        tProgress: '00:00',
        tTime: '00:00'
      });

      this.audio.src = trackList[newIndex].trackUrl;
      this.nTime = 0;
      this.bTime = new Date();
      this.bTime = this.bTime.getTime();

      if (flag !== 0) {
        this.audio.play();
        clearInterval(this.buffInterval);
        this.setState({ buffering: false });
        this.checkBuffering();
      }
    }
  };

  updateCurrTime = () => {
    this.nTime = new Date();
    this.nTime = this.nTime.getTime();

    let curMinutes = Math.floor(this.audio.currentTime / 60);
    let curSeconds = Math.floor(this.audio.currentTime - curMinutes * 60);
    let playProgress = (this.audio.currentTime / this.audio.duration) * 100;

    if (curMinutes < 10) curMinutes = '0' + curMinutes;
    if (curSeconds < 10) curSeconds = '0' + curSeconds;

    let durMinutes = Math.floor(this.audio.duration / 60);
    let durSeconds = Math.floor(this.audio.duration - durMinutes * 60);

    if (durMinutes < 10) durMinutes = '0' + durMinutes;
    if (durSeconds < 10) durSeconds = '0' + durSeconds;
    const duration =
      isNaN(durMinutes) || isNaN(durSeconds) ? '00:00' : durMinutes + ':' + durSeconds;

    let timeProg = isNaN(curMinutes) || isNaN(curSeconds) ? '00:00' : curMinutes + ':' + curSeconds;

    if (playProgress === 100) {
      playProgress = 0;
      timeProg = '00:00';
      this.setState({ buffering: false });
      clearInterval(this.buffInterval);
    }

    this.setState({
      seekBarWidth: `${playProgress}%`,
      tProgress: timeProg,
      tTime: duration
    });
  };

  isReproducingAudio() {
    return this.audio && !this.audio.ended && !this.audio.paused;
  }

  getPlayButton = () => {
    if (!this.isReproducingAudio()) {
      return <FontAwesomeIcon icon="play" />;
    }
    return <FontAwesomeIcon icon="pause" />;
  };

  getAlbumArt = () => {
    const { currIndex, buffering } = this.state;
    const { trackList } = this.props;
    const currentSong = trackList[currIndex];

    if (!currentSong || !currentSong.img || buffering) {
      return <div className="buffer-box">Buffering ...</div>;
    }
    return <img src={currentSong.img} alt="Album Cover" />;
  };

  playFromClickedPos = (hoverBarWidth, seekLoc) => {
    this.audio.currentTime = seekLoc;
    this.setState({
      seekBarWidth: `${hoverBarWidth}%`
    });
  };

  onClickPlay = () => {
    setTimeout(() => {
      if (this.audio.paused) {
        this.checkBuffering();
        this.audio.play();
      } else {
        clearInterval(this.buffInterval);
        this.audio.pause();
      }
    }, 300);
  };

  checkBuffering = () => {
    clearInterval(this.buffInterval);
    this.buffInterval = setInterval(() => {
      if (this.nTime === 0 || this.bTime - this.nTime > 1000) this.setState({ buffering: true });
      else this.setState({ buffering: false });

      this.bTime = new Date();
      this.bTime = this.bTime.getTime();
    }, 100);
  };

  render() {
    const { trackList } = this.props;
    const { currIndex, seekBarWidth, tProgress, tTime, buffering } = this.state;
    const currentSong = trackList.length ? trackList[currIndex] : null;

    let albumImgClass = this.isReproducingAudio() ? 'album-art active' : 'album-art';
    albumImgClass = buffering ? `${albumImgClass} buffering` : albumImgClass;

    return (
      <div className="player">
        <PlayerTrack
          playing={this.isReproducingAudio()}
          currentSong={currentSong}
          seekBarWidth={seekBarWidth}
          tProgress={tProgress}
          tTime={tTime}
          trackDuration={this.audio.duration}
          playFromClickedPos={this.playFromClickedPos}
        />
        <div className="player-content">
          <div className={albumImgClass}>{this.getAlbumArt()}</div>
          <div className="player-controls">
            <div className="button" onClick={() => this.selectTrack(-1)}>
              <FontAwesomeIcon icon="backward" />
            </div>
            <div className="button" onClick={this.onClickPlay}>
              {this.getPlayButton()}
            </div>
            <div className="button" onClick={() => this.selectTrack(1)}>
              <FontAwesomeIcon icon="forward" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    trackList: state.Tracks.trackList || []
  };
})(PlayerComponent);
