var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')

describe('# Admin::Tweet request', () => {

  context('go to admin user page', () => {
    describe('if normal user log in', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
      })


      it('should redirect to root path', (done) => {
        request(app)
          .get('/admin/tweets')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
      })
    })

    describe('if admin user log in', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'admin'});
        await db.User.create({})
        await db.User.create({})
        await db.Tweet.create({UserId: 2, description: 'Tweet1'})
      })

      it('should see all tweets instance', (done) => {
        request(app)
          .get('/admin/tweets')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Tweet1')
            done();
          });
      })
      it('can delete other users tweet', (done) => {
        request(app)
          .delete('/admin/tweets/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            db.Tweet.findAll().then(tweets => {
              expect(tweets).to.be.an('array').that.is.empty;
              done()
            })
          });
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })

  })
});