var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('# tweet request', () => {

  context('# index', () => {
    describe('user not login', () => {
      before((done) => {
        done()
      })

      it('will redirect to log in page', (done) => {
        request(app)
          .post('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })
    describe('user log in', () => {
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

      it('can render index', (done) => {
        request(app)
          .get('/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })

      after(async () => {
        console.log(' \t===== after =====')
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
      })
    })

    // describe('user behaviour', () => {
    //   it('show current_user as log in user', (done) => {
    //     done()
    //   })
    //   it('can show all popular user', (done) => {
    //     done()
    //   })
    // })

    // describe('tweets behaviour', () => {
    //   it('will show 200', (done) => {
    //     done()
    //   })
    //   it('can see all tweets instance', (done) => {
    //     done()
    //   })
    //   it('have tweet instance', (done) => {
    //     done()
    //   })
    // })
  })

  context('# post', () => {
    describe('when successfully save', () => {
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
      it('will redirect to index', (done) => {
        request(app)
          .post('/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will create current users tweet', (done) => {
        db.Tweet.findOne({where: {userId: 1}}).then(tweet => {
          expect(tweet).to.not.be.null
          done()
        })
      })

      after(async () => {
        console.log(' \t===== after =====')
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })

    describe('when failed', () => {
      before(async() => {
        console.log(' \t===== before ===== ')
      })

      it('will redirect index', (done) => {
        request(app)
          .post('/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        console.log(' \t===== after =====')
      })
    })
  })

  context('# iike', () => {
    describe('like first tweet', () => {
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
      })

      it('will redirect index', (done) => {
         request(app)
          .post('/tweets/1/likes')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will save like', (done) => {
        db.Like.findOne({where: {userId: 1}}).then(like => {
          expect(like).to.not.be.null
          done()
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
  })

  context('# unlike', () => {
    describe('like first tweet', () => {
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

      it('will redirect index', (done) => {
        request(app)
          .post('/tweets/1/unlike')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will delete like', (done) => {
        db.Like.findOne({where: {userId: 1}}).then(like => {
          expect(like).to.be.null
          done()
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
  })

});