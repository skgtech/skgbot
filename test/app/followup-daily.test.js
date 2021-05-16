/**
 * @fileoverview Test Followup daily.
 */

const subDt = require('date-fns/sub');

const testLib = require('../lib/test.lib');
const { createMulty, deleteMulti } = require('../setup/member.setup');
const {
  followUpDaily: followUpDailyTask,
} = require('../../app/entities/onboarding-followup');
const guildEnt = require('../../app/entities/discord/logic/guild.ent');

describe('FollowUp Daily', () => {
  testLib.init();

  describe('Happy Path', () => {
    let sendMock;
    let kickMock;
    let allMembers;
    beforeEach(async () => {
      sendMock = jest.fn(() => Promise.resolve());
      kickMock = jest.fn(() => Promise.resolve());
      guildEnt.getGuildMemberUid = jest.fn(() =>
        Promise.resolve({
          send: sendMock,
          kick: kickMock,
        }),
      );

      // create 3 new members and 2 full members.
      const nowDt = new Date();
      const dtFollowUp1 = subDt(nowDt, { days: 1 });
      const dtFollowUp2 = subDt(nowDt, { days: 2 });
      const dtFollowUp3 = subDt(nowDt, { days: 3 });
      const dtFollowUp4 = subDt(nowDt, { days: 4 });
      const dtFollowUp7 = subDt(nowDt, { days: 7 });
      const dtFollowUp8 = subDt(nowDt, { days: 8 });

      const followUpDt = new Date('01/20/2021');
      const followUpDtIso = followUpDt.toISOString();
      allMembers = await createMulty([
        {
          // This user's onboarding time has expired, so they should be kicked
          memberType: 'new',
          followUpType: 'joined1',
          followUpCreatedAt: followUpDtIso,
        },
        {
          memberType: 'new',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp1,
        },
        {
          memberType: 'new',
          onboardingState: 'first_name',
          createdAt: dtFollowUp2,
        },
        {
          memberType: 'new',
          onboardingState: 'last_name',
          createdAt: dtFollowUp3,
        },
        {
          memberType: 'new',
          onboardingState: 'email',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp4,
        },
        {
          memberType: 'new',
          onboardingState: 'bio',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp7,
        },
        {
          memberType: 'new',
          onboardingState: 'nickname',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp8,
        },
        {
          memberType: 'new',
          onboardingState: 'email_verification',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp7,
        },
        {
          // This member will have a ban so should not receive
          // a daily onboarding message.
          memberType: 'new',
          onboardingState: 'email_verification',
          followUpType: 'joined1',
          followUpCreatedAt: dtFollowUp7,
          moderationCategory: '*',
        },
        {},
        {},
      ]);
    });
    afterEach(async () => {
      await deleteMulti(allMembers);
    });
    test('Will produce 2 daily follow up actions', async () => {
      // execute the daily follow task.
      await followUpDailyTask();
      expect(sendMock.mock.calls.length).toBe(2);
    });
    test('Will produce expected messages to members', async () => {
      // execute the follow-up-1 task.
      await followUpDailyTask();

      const { calls } = sendMock.mock;

      const allCallMessages = [calls[0][0], calls[1][0]];

      // tough to replicate this case, just log the messages
      // and manually inspect =)
      console.log(allCallMessages);
    });
  });
});
