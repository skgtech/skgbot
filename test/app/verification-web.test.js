/**
 * @fileoverview Test the bot verification step via web.
 */

const subDt = require('date-fns/sub');

const testLib = require('../lib/test.lib');

const discordHelpers = require('../../app/entities/discord');
const {
  create: createMember,
  delete: deleteMember,
} = require('../setup/member.setup');
const { step7Success } = require('../../app/entities/onboarding/messages');
const { getById: getMemberById } = require('../../app/entities/members');

describe('Verification Web', () => {
  testLib.init();

  describe('Happy Path', () => {
    let memberFix;
    let sendMock;
    beforeEach(async () => {
      sendMock = jest.fn(() => Promise.resolve());
      discordHelpers.getGuildMemberLocal = jest.fn(() =>
        Promise.resolve({
          send: sendMock,
        }),
      );
      discordHelpers.applyRoles = jest.fn(() => Promise.resolve());

      // create members.
      const nowDt = new Date();
      const dtFrom = subDt(nowDt, {
        minutes: 10,
      });
      memberFix = await createMember({
        memberType: 'new',
        joinedAt: dtFrom,
        isOnboarded: false,
        onboardingState: 'email_verification',
      });
    });
    afterEach(async () => {
      await deleteMember(memberFix);
    });
    test('Will successfully verify via web and update record', async () => {
      const agent = testLib.getAgent();
      const res = await agent.get(`/verify/${memberFix.verification_code}`);

      expect(res.statusCode).toEqual(200);

      const memberRecord = await getMemberById(memberFix.discord_uid);

      expect(memberRecord.onboarding_state).toEqual('member');
      expect(memberRecord.is_onboarded).toBeTrue();
    });
    test('Will successfully verify via web and send appropriate message', async () => {
      const agent = testLib.getAgent();
      const res = await agent.get(`/verify/${memberFix.verification_code}`);

      expect(res.statusCode).toEqual(200);

      const { calls } = sendMock.mock;
      console.log(calls);
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toEqual(step7Success());
    });
  });
});
