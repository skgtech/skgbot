/**
 * @fileoverview Moderation related entities.
 */

const { canJoin, canOnboard } = require('./logic/moderation-check.ent');
const { moderationBan } = require('./logic/moderation-ban.ent');
const { moderationUnban } = require('./logic/moderation-unban.ent');
const { moderationList } = require('./logic/moderation-list.ent');
const { moderationListAll } = require('./logic/moderation-list-all.ent');
const modSql = require('./sql/moderation.sql');

const entity = (module.exports = {});

entity.canJoin = canJoin;
entity.canOnboard = canOnboard;
entity.moderationBan = moderationBan;
entity.moderationUnban = moderationUnban;
entity.moderationList = moderationList;
entity.moderationListAll = moderationListAll;
entity.getByMemberIds = modSql.getByMemberIds;
