var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')


describe('# Admin::User request', () => {

  context('go to admin user page', () => {
    describe('if normal user log in', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({name: 'User1'})
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
        await db.User.create({name: 'User1'})
      })

      it('should see all user list', (done) => {
        request(app)
          .get('/admin/users')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('User1')
            done();
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