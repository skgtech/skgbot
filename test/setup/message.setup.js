/**
 * @fileoverview Setup cases inbound discord message objects.
 * @see https://discord.js.org/#/docs/main/stable/class/Message
 */

const setup = (module.exports = {});

/**
 * Create a discord message object.
 *
 * @param {Object=} options Options:
 * @param {string=} options.content The content of the message.
 * @param {string=} options.uid The author discord member id.
 * @return {Promise<Object>} The Discord Message Object.
 */
setup.create = async (options = {}) => {
  const message = {
    channel: {
      type: 'dm',
      send: jest.fn(() => Promise.resolve()),
    },
    author: { id: options.uid },
    content: options.content,
  };

  return message;
};
