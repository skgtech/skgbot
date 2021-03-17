/**
 * @fileoverview Test the bot verification step via the bot.
 */

const subDt = require('date-fns/sub');
const { v4: uuid } = require('uuid');

const testLib = require('../lib/test.lib');

const discordEnt = require('../../app/entities/discord');
const {
  create: createMember,
  delete: deleteMember,
} = require('../setup/member.setup');
const {
  step7Success,
  step7Error,
} = require('../../app/entities/onboarding/messages');
const { getById: getMemberById } = require('../../app/entities/members');
const { create: createMessage } = require('../setup/message.setup');
const { _onMessage } = require('../../app/entities/message-router');

describe('Verification Bot', () => {
  testLib.init();

  let memberFix;
  beforeEach(async () => {
    discordEnt.getGuildMemberLocal = jest.fn(() => Promise.resolve({}));
    discordEnt.applyRolesToNewMember = jest.fn(() => Promise.resolve());
    discordEnt.getMainChannel = jest.fn(() => {
      return {
        send: jest.fn(() => Promise.resolve()),
      };
    });
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
  describe('Happy Path', () => {
    test('Will successfully verify via bot and update record', async () => {
      const message = await createMessage({
        uid: memberFix.discord_uid,
        content: memberFix.verification_code,
      });

      await _onMessage(message);

      const memberRecord = await getMemberById(memberFix.discord_uid);

      expect(memberRecord.onboarding_state).toEqual('member');
      expect(memberRecord.is_onboarded).toBeTrue();
    });
    test('Will successfully verify via bot and send appropriate message', async () => {
      const message = await createMessage({
        uid: memberFix.discord_uid,
        content: memberFix.verification_code,
      });
      await _onMessage(message);

      const { send: sendMock } = message.channel;
      expect(sendMock.mock.calls.length).toBe(1);
      const { calls } = sendMock.mock;
      expect(calls[0][0]).toEqual(step7Success());
    });
  });
  describe('Erroneous Cases', () => {
    test('Should not verify with random string', async () => {
      const message = await createMessage({
        uid: memberFix.discord_uid,
        content: 'nope',
      });
      await _onMessage(message);

      const memberRecord = await getMemberById(memberFix.discord_uid);

      expect(memberRecord.onboarding_state).toEqual('email_verification');
      expect(memberRecord.is_onboarded).toBeFalse();

      const { send: sendMock } = message.channel;
      expect(sendMock.mock.calls.length).toBe(1);
      const { calls } = sendMock.mock;
      expect(calls[0][0]).toEqual(step7Error());
    });
    test('Should not verify with wrong uuid token', async () => {
      const message = await createMessage({
        uid: memberFix.discord_uid,
        content: `${memberFix.discord_uid}_${uuid()}`,
      });
      await _onMessage(message);

      const memberRecord = await getMemberById(memberFix.discord_uid);

      expect(memberRecord.onboarding_state).toEqual('email_verification');
      expect(memberRecord.is_onboarded).toBeFalse();

      const { send: sendMock } = message.channel;
      expect(sendMock.mock.calls.length).toBe(1);
      const { calls } = sendMock.mock;
      expect(calls[0][0]).toEqual(step7Error());
    });
  });
});
