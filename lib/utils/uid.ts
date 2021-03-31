import { NoUserIdError } from 'lib/errors';
import { getState } from 'lib/state';

let sonarIdCount = 0;

let generateUniqueSonarId = () => {
  sonarIdCount += 1;
  let userId = getState().userId ?? NoUserIdError();
  let timestamp = Date.now().toString();
  return `${userId}-${timestamp}.${sonarIdCount}`;
};

export { generateUniqueSonarId };
