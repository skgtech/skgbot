/**
 * @fileoverview Test Follow-up joined 1.
 */

const testLib = require('../lib/test.lib');
const { createMulty, deleteMulti } = require('../setup/member.setup');
const { followUpJoined1 } = require('../../app/entities/onboarding');
const guildEnt = require('../../app/entities/discord/logic/guild.ent');

describe('Follow-up Joined 1', () => {
  testLib.init();

  describe('Happy Path', () => {
    test('Will produce 3 follow up actions', async () => {
      const sendMock = jest.fn(() => Promise.resolve());
      guildEnt.getGuildMemberUid = jest.fn(() =>
        Promise.resolve({
          send: sendMock,
        }),
      );

      // create 3 new members and 2 full members.
      const allMembers = await createMulty([
        { memberType: 'new' },
        { memberType: 'new' },
        { memberType: 'new' },
        {},
        {},
      ]);

      // execute the follow up 1 task.
      await followUpJoined1();

      expect(sendMock.mock.calls.length).toBe(3);

      await deleteMulti(allMembers);
    });
  });
});