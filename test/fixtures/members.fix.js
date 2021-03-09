/**
 * @fileoverview Member fixtures.
 */

const faker = require('faker');

const fix = (module.exports = {});

function randomEmail() {
  return `${Date.now()}${faker.random.number(9999999)}@example.com`;
}

/**
 * A fully joined member with a bio and social fields filled in.
 *
 * @return {Object} The fixture.
 */
fix.memberFull = () => ({
  discord_uid: faker.random.number(999999999999999999),
  email: randomEmail(),
  username: faker.internet.userName(),
  nickname: faker.internet.userName(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  bio: faker.commerce.productDescription(),
  twitter: `https://twitter.com/${faker.internet.userName()}`,
  linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
  is_onboarded: true,
  onboarded_at: new Date(),
  onboarding_state: 'member',
});

/**
 * A member that just joined with optionally a custom onboarding state.
 *
 * @param {string} [onboardingState=joined] Define onboarding state if needed.
 * @return {Object} The fixture.
 */
fix.memberNew = (onboardingState = 'joined') => ({
  discord_uid: faker.random.number(999999999999999999),
  username: faker.internet.userName(),
  is_onboarded: false,
  onboarding_state: onboardingState,
});
