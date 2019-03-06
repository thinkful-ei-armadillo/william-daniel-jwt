const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615',
    },
  ]
}
function makethingsArray(users) {
  return [
    {
      id: 1,
      title: 'First test post!',
      style: 'How-to',
      author_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      title: 'Second test post!',
      style: 'Interview',
      author_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      title: 'Third test post!',
      style: 'News',
      author_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 4,
      title: 'Fourth test post!',
      style: 'Listicle',
      author_id: users[3].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}
function makereviewsArray(users, things) {
  return [
    {
      id: 1,
      text: 'First test review!',
      thing_id: things[0].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      text: 'Second test review!',
      thing_id: things[0].id,
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      text: 'Third test review!',
      thing_id: things[0].id,
      user_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      text: 'Fourth test review!',
      thing_id: things[0].id,
      user_id: users[3].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 5,
      text: 'Fifth test review!',
      thing_id: things[things.length - 1].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 6,
      text: 'Sixth test review!',
      thing_id: things[things.length - 1].id,
      user_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 7,
      text: 'Seventh test review!',
      thing_id: things[3].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}
function makeExpectedthing(users, thing, reviews=[]) {
  const author = users
    .find(user => user.id === thing.author_id)
  const number_of_reviews = reviews
    .filter(review => review.thing_id === thing.id)
    .length
  return {
    id: thing.id,
    style: thing.style,
    title: thing.title,
    content: thing.content,
    date_created: thing.date_created,
    number_of_reviews,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created,
    },
  }
}
function makeExpectedthingreviews(users, thingId, reviews) {
  const expectedreviews = reviews
    .filter(review => review.thing_id === thingId)
  return expectedreviews.map(review => {
    const reviewUser = users.find(user => user.id === review.user_id)
    return {
      id: review.id,
      text: review.text,
      date_created: review.date_created,
      user: {
        id: reviewUser.id,
        user_name: reviewUser.user_name,
        full_name: reviewUser.full_name,
        nickname: reviewUser.nickname,
        date_created: reviewUser.date_created,
        date_modified: null,
      }
    }
  })
}
function makeMaliciousThing(user) {
  const maliciousthing = {
    id: 911,
    style: 'How-to',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedthing = {
    ...makeExpectedthing([user], maliciousthing),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousthing,
    expectedthing,
  }
}
function makeThingsFixtures() {
  const testUsers = makeUsersArray()
  const testthings = makethingsArray(testUsers)
  const testreviews = makereviewsArray(testUsers, testthings)
  return { testUsers, testthings, testreviews }
}
function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      thingful_things,
      thingful_users,
      thingful_reviews
      RESTART IDENTITY CASCADE`
  )
}
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db
    .into('thingful_users')
    .insert(preppedUsers)
}
function seedthingsTables(db, users, things, reviews=[]) {
  return seedUsers(db, users)
    .then(() =>
      db
        .into('thingful_things')
        .insert(things)
    )
    .then(() =>
      reviews.length && db.into('thingful_reviews').insert(reviews)
    )
}
function seedMaliciousthing(db, user, thing) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('thingful_things')
        .insert([thing])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makethingsArray,
  makeExpectedthing,
  makeExpectedthingreviews,
  makeMaliciousThing,
  makereviewsArray,
  makeThingsFixtures,
  cleanTables,
  seedthingsTables,
  seedMaliciousthing,
  makeAuthHeader,
  seedUsers,
}