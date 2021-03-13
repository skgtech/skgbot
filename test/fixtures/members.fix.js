/**
 * @fileoverview Member fixtures.
 */

const addDt = require('date-fns/add');
const faker = require('faker');
const { v4: uuid } = require('uuid');

const fix = (module.exports = {});

function randomEmail() {
  return `${Date.now()}${faker.random.number(9999999)}@example.com`;
}

/**
 * A fully joined member with a bio and social fields filled in.
 *
 * @return {Object} The fixture.
 */
fix.memberFull = () => {
  const dUid = faker.random.number(999999999999999999);
  const verificationToken = `${dUid}_${uuid()}`;
  const nowDt = new Date();

  return {
    discord_uid: dUid,
    email: randomEmail(),
    username: faker.internet.userName(),
    nickname: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    bio: faker.commerce.productDescription(),
    twitter: `https://twitter.com/${faker.internet.userName()}`,
    linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
    is_onboarded: true,
    onboarded_at: nowDt,
    onboarding_state: 'member',
    verification_code: verificationToken,
    verification_code_expires_at: addDt(nowDt, {
      days: 10,
    }),
  };
};

/**
 * A member that just joined with optionally a custom onboarding state.
 *
 * @param {string} [onboardingState=joined] Define onboarding state if needed.
 * @return {Object} The fixture.
 */
fix.memberNew = (onboardingState = 'joined') => {
  const dUid = faker.random.number(999999999999999999);
  const verificationToken = `${dUid}_${uuid()}`;
  const nowDt = new Date();

  return {
    discord_uid: dUid,
    username: faker.internet.userName(),
    is_onboarded: false,
    onboarding_state: onboardingState,
    verification_code: verificationToken,
    verification_code_expires_at: addDt(nowDt, {
      days: 10,
    }),
  };
};
