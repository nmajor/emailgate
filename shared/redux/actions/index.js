
import * as ActionTypes from '../constants';

// import socket from '../../../client/socket';

export * from './userActions';
export * from './accountActions';
export * from './compilationActions';
export * from './filteredAccountEmails';
export * from './filteredAccountEmailsCount';

export function setCurrentFilteredEmailMid(mid) {
  return {
    type: ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID,
    mid,
  };
}

export function setSelectedCompilationEmailId(id) {
  return {
    type: ActionTypes.SET_SELECTED_COMPILATION_EMAIL_ID,
    id,
  };
}

export function setEditingSelectedCompilationEmail(val) {
  return {
    type: ActionTypes.SET_EDITING_SELECTED_COMPILATION_EMAIL,
    val,
  };
}
