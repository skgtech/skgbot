/**
 * @fileoverview Test Followup daily.
 */

const subDt = require('date-fns/sub');

const testLib = require('../lib/test.lib');
const { createMulty, deleteMulti } = require('../setup/member.setup');
const { followUpDaily } = require('../../app/entities/onboarding-followup');
const guildEnt = require('../../app/entities/discord/logic/guild.ent');

describe('FollowUp Daily', () => {
  testLib.init();

  describe('Happy Path', () => {
    let sendMock;
    let allMembers;
    beforeEach(async () => {
      sendMock = jest.fn(() => Promise.resolve());
      guildEnt.getGuildMemberUid = jest.fn(() =>
        Promise.resolve({
          send: sendMock,
        }),
      );

      // create 3 new members and 2 full members.
      const nowDt = new Date();
      const dtFrom = subDt(nowDt, {
        minutes: 10,
      });

      const followUpDt = new Date('01/20/2021');
      const followUpDtIso = followUpDt.toISOString();
      allMembers = await createMulty([
        {
          memberType: 'new',
          joinedAt: dtFrom,
          followUpType: 'joined1',
          followUpCreatedAt: followUpDtIso,
        },
        { memberType: 'new', joinedAt: dtFrom },
        { memberType: 'new', joinedAt: dtFrom },
        { memberType: 'new', joinedAt: dtFrom, onboardingState: 'first_name' },
        { memberType: 'new', joinedAt: dtFrom, onboardingState: 'last_name' },
        { memberType: 'new', joinedAt: dtFrom, onboardingState: 'email' },
        { memberType: 'new', joinedAt: dtFrom, onboardingState: 'bio' },
        { memberType: 'new', joinedAt: dtFrom, onboardingState: 'nickname' },
        {
          memberType: 'new',
          joinedAt: dtFrom,
          onboardingState: 'email_verification',
        },
        {},
        {},
      ]);
    });
    afterEach(async () => {
      // await deleteMulti(allMembers);
    });
    test('Will produce daily follow up actions', async () => {
      // execute the daily follow task.
      await followUpDaily();
    });
  });
});
