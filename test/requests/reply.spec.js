var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
var expect = chai.expect;
const db = require('../../models')

describe('# reply request', () => {

  context('#index', () => {
    describe('GET /tweets/:id/replies', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});

        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})

        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'test'})
        await db.Reply.create({UserId: 1, TweetId: 1, comment: 'Tweet1 的 comment'})
      })

      it('should render index', (done) => {
        request(app)
          .get('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Tweet1 的 comment')
            return done();
          });
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
      })
    })
  })

  context('#post', () => {
    describe('POST /tweets/1/replies successfully', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'test'})
      })

      it('will redirect to index', (done) => {
        request(app)
          .post('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
      it('when successfully save', (done) => {
        db.Reply.findOne({where: {userId: 1}}).then(reply => {
          expect(reply).to.not.be.null
          done()
        })
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Reply.destroy({where: {},truncate: true})
      })
    })

    describe('POST /tweets/1/replies fail', () => {
      before(async() => {
        
      })

      it('will redirect index', (done) => {
        request(app)
          .post('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })

      after(async () => {
        
      })
    })
  })
});