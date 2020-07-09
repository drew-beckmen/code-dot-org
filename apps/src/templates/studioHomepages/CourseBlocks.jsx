import $ from 'jquery';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ContentContainer from '../ContentContainer';
import CourseBlocksTools from './CourseBlocksTools';
import SpecialAnnouncement from './SpecialAnnouncement';
import CourseBlocksInternationalGradeBands from './CourseBlocksInternationalGradeBands';
import {NotificationResponsive} from '@cdo/apps/templates/Notification';
import ProtectedStatefulDiv from '../ProtectedStatefulDiv';
import i18n from '@cdo/locale';
import {pegasus} from '@cdo/apps/lib/util/urlHelpers';

class ExpressCourses extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired
  };

  componentDidMount() {
    $('#pre-express')
      .appendTo(ReactDOM.findDOMNode(this.refs.pre_express))
      .show();
    $('#express')
      .appendTo(ReactDOM.findDOMNode(this.refs.express))
      .show();
  }

  render() {
    const {locale} = this.props;
    return (
      <ContentContainer
        heading={i18n.courseBlocksCsfExpressHeading()}
        description={i18n.courseBlocksCsfExpressDescription()}
      >
        <div className="row">
          <ProtectedStatefulDiv ref="pre_express" />
          <ProtectedStatefulDiv ref="express" />
        </div>
        <AcceleratedAndUnplugged locale={locale} />
      </ContentContainer>
    );
  }
}

class CoursesAToF extends Component {
  render() {
    return (
      <div>
        <ContentContainer
          heading={i18n.courseBlocksCsfYoungHeading()}
          description={i18n.courseBlocksCsfYoungDescription()}
        >
          <CourseBlocks tiles={['#coursea', '#courseb']} />
        </ContentContainer>

        <ContentContainer
          heading={i18n.courseBlocksCsfOlderHeading()}
          description={i18n.courseBlocksCsfOlderDescription()}
        >
          <CourseBlocks
            tiles={['#coursec', '#coursed', '#coursee', '#coursef']}
          />
        </ContentContainer>
      </div>
    );
  }
}

const LegacyCSFNotification = () => (
  <NotificationResponsive
    type="bullhorn"
    notice={i18n.courseBlocksLegacyNotificationHeading()}
    details={i18n.courseBlocksLegacyNotificationBody()}
    detailsLinkText={i18n.courseBlocksLegacyNotificationDetailsLinkText()}
    detailsLink={pegasus('/educate/curriculum/csf-transition-guide')}
    detailsLinkNewWindow={true}
    dismissible={false}
    buttons={[
      {
        text: i18n.courseBlocksLegacyNotificationButtonCourses14(),
        link: pegasus('/educate/curriculum/cs-fundamentals-international'),
        newWindow: true
      },
      {
        text: i18n.courseBlocksLegacyNotificationButtonCoursesAccelerated(),
        link: '/s/20-hour',
        newWindow: true
      }
    ]}
  />
);

class Courses1To4 extends Component {
  render() {
    return (
      <ContentContainer
        heading={i18n.csf()}
        description={i18n.csfDescription()}
        link={'/home/#recent-courses'}
        linkText={i18n.viewMyRecentCourses()}
      >
        <CourseBlocks
          tiles={['#course1', '#course2', '#course3', '#course4']}
        />
      </ContentContainer>
    );
  }
}

class AcceleratedAndUnplugged extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired
  };

  componentDidMount() {
    const {locale} = this.props;
    // [FND-1203] - replace this 'es-MX' conditional once full localization customization is implemented.
    if (locale !== 'es-MX') {
      $('#20-hour')
        .appendTo(ReactDOM.findDOMNode(this.refs.twenty_hour))
        .show();
    }
    $('#unplugged')
      .appendTo(ReactDOM.findDOMNode(this.refs.unplugged))
      .show();
  }

  render() {
    return (
      <div className="row">
        <ProtectedStatefulDiv ref="twenty_hour" />
        <ProtectedStatefulDiv ref="unplugged" />
      </div>
    );
  }
}

const ViewMoreTile = () => (
  <div className="tutorial-block">
    <div className="courseblock-span3 courseblock-tall">
      <a href={pegasus('/hourofcode/overview')}>
        <img src="/shared/images/more_arrow.png" width="100%" height="120px" />
        <div className="course-container">
          <h3 className="heading">{i18n.viewMore()}</h3>
          <div className="text smalltext">
            {i18n.teacherCourseHocLinkText()}
          </div>
        </div>
      </a>
    </div>
  </div>
);

export class CourseBlocks extends Component {
  static propTypes = {
    // Array of jQuery selectors to course blocks.
    tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    showViewMoreTile: PropTypes.bool
  };

  render() {
    return (
      <div className="tutorial-row">
        {this.props.tiles.map((tile, index) => (
          <ProtectedStatefulDiv
            className="tutorial-block"
            key={tile}
            ref={el => {
              if (el) {
                $(tile).appendTo(ReactDOM.findDOMNode(el));
              }
            }}
          />
        ))}

        {this.props.showViewMoreTile && <ViewMoreTile />}
      </div>
    );
  }
}

export class CourseBlocksHoc extends Component {
  static propTypes = {
    isInternational: PropTypes.bool
  };

  tiles() {
    return this.props.isInternational
      ? ['#dance-2019', '#aquatic', '#frozen']
      : ['#dance-2019', '#aquatic', '#oceans'];
  }

  render() {
    return (
      <ContentContainer
        heading={i18n.teacherCourseHoc()}
        description={i18n.teacherCourseHocDescription()}
        linkText={i18n.teacherCourseHocLinkText()}
        link={pegasus('/hourofcode/overview')}
      >
        <CourseBlocks tiles={this.tiles()} showViewMoreTile />
      </ContentContainer>
    );
  }
}

export class CourseBlocksIntl extends Component {
  static propTypes = {
    isTeacher: PropTypes.bool.isRequired,
    showModernElementaryCourses: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired
  };

  componentDidMount() {
    $('.csf-courses-header')
      .appendTo(ReactDOM.findDOMNode(this.refs.csfCoursesHeader))
      .show();
  }

  render() {
    const {
      isTeacher,
      showModernElementaryCourses: modernCsf,
      locale
    } = this.props;
    const AcceleratedCourses = () => (
      <ContentContainer>
        <AcceleratedAndUnplugged locale={locale} />
      </ContentContainer>
    );
    return (
      <div>
        {modernCsf ? (
          <ExpressCourses locale={locale} />
        ) : (
          <AcceleratedCourses />
        )}

        <CourseBlocksHoc isInternational />

        <SpecialAnnouncement isEnglish={false} isTeacher={isTeacher} />

        {modernCsf ? <CoursesAToF /> : <Courses1To4 />}

        {modernCsf && <LegacyCSFNotification />}

        <CourseBlocksInternationalGradeBands />

        <CourseBlocksTools isEnglish={false} />
      </div>
    );
  }
}
