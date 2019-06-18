var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
const db = require('../../models')

describe('# followship request', () => {

  context('#create', () => {
    describe('when user1 wants to follow user2', () => {
      before(async() => {
        console.log(' \t===== before ===== ')
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Following: []});
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
        await db.User.create({})
        await db.User.create({})
      })

      it('will show following', (done) => {
        request(app)
          .post('/followships')
          .send('id=2')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done()
          });
      })
      it('can not follow self', (done) => {
        request(app)
          .post('/followships')
          .send('id=1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        console.log(' \t===== after =====')
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
      })
    })
  })

  context('#destroy', () => {
    describe('when user1 wants to unfollow user2', () => {
      before(async() => {
        console.log(' \t===== before ===== ')
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Following: []});
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
        await db.User.create({})
        await db.User.create({})
        await db.Followship.create({userId: 1, followingId: 2})
      })

      it('will show following', (done) => {
        request(app)
          .delete('/followships/2')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        console.log(' \t===== after =====')
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Followship.destroy({where: {},truncate: true})
      })
    })
  })

});