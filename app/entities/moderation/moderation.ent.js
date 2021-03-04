/**
 * @fileoverview Moderation related entities.
 */

const { moderationBan } = require('./logic/moderation-ban.ent');
const { moderationUnban } = require('./logic/moderation-unban.ent');
const { moderationList } = require('./logic/moderation-list.ent');
const { moderationListAll } = require('./logic/moderation-list-all.ent');

const entity = (module.exports = {});

entity.moderationBan = moderationBan;
entity.moderationUnban = moderationUnban;
entity.moderationList = moderationList;
entity.moderationListAll = moderationListAll;
