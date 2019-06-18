var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
const db = require('../../models')

describe('# user request', () => {

  context('# tweets', () => {
    before(async() => {
      console.log(' \t===== before ===== ')
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Following: []});
      await db.User.create({})
      await db.User.create({})
    })

    describe('go to current_user page', () => {
      it('will show current users tweets', (done) => {
        request(app)
          .get('/users/1/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })
    describe('go to other user page', () => {
      it('will show other users tweets', (done) => {
        request(app)
          .get('/users/2/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    after(async () => {
      console.log(' \t===== after =====')
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })
  })

  context('# edit', () => {
    before(async() => {
      console.log(' \t===== before ===== ')
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Following: []});
      await db.User.create({})
      await db.User.create({})
    })

    describe('go to edit page', () => {
      it('will render edit page', (done) => {
        request(app)
          .get('/users/1/edit')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
      it('will redirect if not this user', (done) => {
        request(app)
          .get('/users/2/edit')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    after(async () => {
      console.log(' \t===== after =====')
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })
  })

  context('#update', () => {
    before(async() => {
      console.log(' \t===== before ===== ')
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Following: []});
      await db.User.create({})
    })

    describe('successfully update', () => {
      it('will change users intro', (done) => {
        request(app)
          .post('/users/1/edit')
          .send('name=abc')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    after(async () => {
      console.log(' \t===== after =====')
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
    })
  })

  context('#followings #followers', () => {
    before(async() => {
      console.log(' \t===== before ===== ')
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Following: []});
      await db.User.create({})
      await db.User.create({})
      await db.Followship.create({userId: 1, followingId: 2,})
    })

    describe('go to following page', () => {
      it('will show all following users', (done) => {
        request(app)
          .get('/users/1/followings')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    describe('go to follower page', () => {
      it('can see follower on other user page', (done) => {
        request(app)
          .get('/users/1/followers')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    after(async () => {
      console.log(' \t===== after =====')
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
      await db.Followship.destroy({where: {},truncate: true})

    })
  })

  context('#likes', () => {
    before(async() => {
      console.log(' \t===== before ===== ')
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Following: []});
      await db.User.create({})
      await db.Tweet.create({UserId: 1})
      await db.Like.create({UserId: 1, TweetId: 1})
    })

    describe('go to likes page', () => {
      it('show users like tweets', (done) => {
        request(app)
          .get('/users/1/likes')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })

    after(async () => {
      console.log(' \t===== after =====')
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.User.destroy({where: {},truncate: true})
      await db.Tweet.destroy({where: {},truncate: true})
      await db.Like.destroy({where: {},truncate: true})
    })
  })

});