/**
 * @fileoverview Test Follow-up joined 1.
 */

const subDt = require('date-fns/sub');

const testLib = require('../lib/test.lib');
const { createMulty, deleteMulti } = require('../setup/member.setup');
const { followUpJoined1 } = require('../../app/entities/onboarding');
const guildEnt = require('../../app/entities/discord/logic/guild.ent');
const { followupJoined1 } = require('../../app/entities/onboarding/messages');
const {
  getByMemberIds,
} = require('../../app/entities/onboarding-followup/sql/onboard-track.sql');

describe('Follow-up Joined 1', () => {
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

      // create members.
      const nowDt = new Date();
      const dtFrom = subDt(nowDt, {
        minutes: 10,
      });
      allMembers = await createMulty([
        { memberType: 'new', joinedAt: dtFrom },
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
      await deleteMulti(allMembers);
    });
    test('Will produce 3 follow up actions', async () => {
      // execute the follow-up-1 task.
      await followUpJoined1();

      expect(sendMock.mock.calls.length).toBe(3);
    });
    test('Will produce expected messages to members', async () => {
      // execute the follow-up-1 task.
      await followUpJoined1();

      const { calls } = sendMock.mock;

      const allCallMessages = [calls[0][0], calls[1][0], calls[2][0]];

      expect(allCallMessages).toInclude(
        followupJoined1(allMembers[0].username),
      );
      expect(allCallMessages).toInclude(
        followupJoined1(allMembers[1].username),
      );
      expect(allCallMessages).toInclude(
        followupJoined1(allMembers[2].username),
      );
    });
    test('Will produce expected records', async () => {
      // execute the follow-up-1 task.
      await followUpJoined1();

      const memberIds = [
        allMembers[0].discord_uid,
        allMembers[1].discord_uid,
        allMembers[2].discord_uid,
      ];
      const records = await getByMemberIds(memberIds);

      records.forEach((record) => {
        expect(memberIds).toInclude(record.discord_uid);
        expect(record.followup_type).toEqual('joined1');
      });
    });
  });
});
