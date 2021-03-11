/**
 * @fileoverview Onboarding of Discord users.
 */

const { run: checkMissing } = require('./logic/check-missing.ent');
const { run: followUpJoined1 } = require('./logic/followup-joined1.ent');
const { run: followUpDaily } = require('./logic/followup-daily.ent');

const onboarding = (module.exports = {});

// export the methods
onboarding.followUpJoined1 = followUpJoined1;
onboarding.followUpDaily = followUpDaily;
onboarding.checkMissing = checkMissing;
