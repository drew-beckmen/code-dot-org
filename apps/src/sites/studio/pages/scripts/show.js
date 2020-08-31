import $ from 'jquery';
import {renderCourseProgress} from '@cdo/apps/code-studio/progress';
import {
  setVerified,
  setVerifiedResources
} from '@cdo/apps/code-studio/verifiedTeacherRedux';
import {
  setUserProviders,
  setCurrentUserId
} from '@cdo/apps/templates/currentUserRedux';
import {getStore} from '@cdo/apps/code-studio/redux';
import {registerReducers} from '@cdo/apps/redux';
import plcHeaderReducer, {
  setPlcHeader
} from '@cdo/apps/code-studio/plc/plcHeaderRedux';
import scriptAnnouncementReducer, {
  addAnnouncement
} from '@cdo/apps/code-studio/scriptAnnouncementsRedux';
import locales, {setLocaleEnglishName} from '../../../../redux/localesRedux';

$(document).ready(initPage);

function initPage() {
  const script = document.querySelector('script[data-scriptoverview]');
  const config = JSON.parse(script.dataset.scriptoverview);

  const {scriptData, plcBreadcrumb} = config;
  const store = getStore();
  registerReducers({locales});
  store.dispatch(setLocaleEnglishName(scriptData.locale));

  if (plcBreadcrumb) {
    // Dispatch breadcrumb props so that ScriptOverviewHeader can add the breadcrumb
    // as appropriate
    registerReducers({plcHeader: plcHeaderReducer});
    store.dispatch(
      setPlcHeader(plcBreadcrumb.unit_name, plcBreadcrumb.course_view_path)
    );
  }

  if (scriptData.has_verified_resources) {
    store.dispatch(setVerifiedResources(true));
  }

  if (scriptData.is_verified_teacher) {
    store.dispatch(setVerified());
  }

  if (scriptData.user_providers) {
    store.dispatch(setUserProviders(scriptData.user_providers));
  }

  if (scriptData.user_id) {
    store.dispatch(setCurrentUserId(scriptData.user_id));
  }

  if (scriptData.script_announcements) {
    registerReducers({scriptAnnouncements: scriptAnnouncementReducer});
    scriptData.script_announcements.forEach(announcement =>
      store.dispatch(
        addAnnouncement(
          announcement.notice,
          announcement.details,
          announcement.link,
          announcement.type,
          announcement.visibility
        )
      )
    );
  }

  renderCourseProgress(scriptData);
}
