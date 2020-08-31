import PropTypes from 'prop-types';
import React from 'react';
import Button from '../Button';
import i18n from '@cdo/locale';
import firehoseClient from '@cdo/apps/lib/util/firehose';

// https://developers.google.com/classroom/brand
const styles = {
  label: {
    paddingLeft: 16,
    fontFamily: 'Roboto',
    fontWeight: 700
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start'
  }
};
class GoogleClassroomShareButton extends React.Component {
  static propTypes = {
    buttonId: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    itemtype: PropTypes.string.isRequired,
    title: PropTypes.string,
    height: PropTypes.number,
    courseid: PropTypes.number,
    analyticsData: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.loadApi = this.loadApi.bind(this);
    this.waitForGapi = this.waitForGapi.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.onShareStart = this.onShareStart.bind(this);
    this.onShareComplete = this.onShareComplete.bind(this);
    this.logEvent = this.logEvent.bind(this);
  }

  componentDidMount() {
    // Use unique callback names since we're adding to the global namespace
    window[this.onShareStartName()] = this.onShareStart;
    window[this.onShareCompleteName()] = this.onShareComplete;

    if (this.gapiReady()) {
      this.renderButton();
    } else {
      this.loadApi();
    }
  }

  /* The Google Classroom Share Button is only available through their js api,
   * so we have to add it to the page on load. Each instance of this
   * component will wait until the api is ready before rendering the button,
   * but only the first will kick of the loading process.
   */
  loadApi() {
    if (!document.getElementById('gapi')) {
      window.___gcfg = {
        parsetags: 'explicit'
      };

      const gapi = document.createElement('script');
      gapi.src = 'https://apis.google.com/js/platform.js';
      gapi.id = 'gapi';
      gapi.addEventListener('load', this.waitForGapi);
      document.body.appendChild(gapi);
    } else {
      this.waitForGapi();
    }
  }

  waitForGapi() {
    if (this.gapiReady()) {
      this.renderButton();
    } else {
      setTimeout(() => {
        this.waitForGapi();
      }, 100);
    }
  }

  gapiReady = () =>
    window.gapi && typeof window.gapi.sharetoclassroom !== 'undefined';

  onShareStartName = () => 'onShareStart_' + this.props.buttonId;

  onShareCompleteName = () => 'onShareComplete_' + this.props.buttonId;

  onShareStart() {
    this.logEvent('share_started');
  }

  onShareComplete() {
    this.logEvent('share_completed');
  }

  logEvent(event) {
    firehoseClient.putRecord({
      study: 'google-classroom-button',
      study_group: 'v0',
      event: event,
      data_json: JSON.stringify(this.props.analyticsData)
    });
  }

  renderButton() {
    window.gapi.sharetoclassroom.render(this.props.buttonId, {
      url: this.props.url,
      itemtype: this.props.itemtype,
      title: this.props.title,
      size: this.props.height,
      courseid: this.props.courseid,
      onsharestart: `${this.onShareStartName()}`,
      onsharecomplete: `${this.onShareCompleteName()}`
    });
  }

  render() {
    return (
      <span style={styles.container}>
        <span id={this.props.buttonId} />
        <span style={styles.label}>{i18n.loginTypeGoogleClassroom()}</span>
      </span>
    );
  }
}

GoogleClassroomShareButton.defaultProps = {
  itemtype: 'assignment',
  height: Button.ButtonHeight.default
};

export default GoogleClassroomShareButton;
