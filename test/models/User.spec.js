process.env.NODE_ENV = 'test'

var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const UserModel = require('../../models/user')

describe('# User Model', () => {
  
  // start with a fresh DB 
  before(done => {
    // db.sequelize.sync({ force: true, match: /_test$/, logging: false })
    // .then(() => {
    //   // console.log('==== db.sequelize.sync ====')
    //   return done()
    // })
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;[
      'name',
    ].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const Reply = 'Reply'
    const Tweet = 'Tweet'
    const Like = 'Like'
    // const Followship = 'Followship'
    before(() => {
      User.associate({ Reply })
      User.associate({ Tweet })
      User.associate({ Like })
      // User.associate({ Followship })
    })

    it('should have many replies', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many tweets', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Tweet)
      done()
    })
    it('should have many likes', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Like)
      done()
    })
    // it('should have many followships', (done) => {
    //   expect(User.hasMany).to.have.been.calledWith(Followship)
    //   done()
    // })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {   
        data = user
        done()
      })
    })
    it('read', (done) => {
        db.User.findByPk(data.id).then((user) => {  
          expect(data.id).to.be.equal(user.id)
          done()
        })

      // db.User.create({}).then((data) => {
      //   db.User.findByPk(data.id).then((user) => {  
      //     expect(data.id).to.be.equal(user.id)
      //     done()
      //   })
      // })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id }}).then(() => {
        db.User.findByPk(data.id).then((user) => { 
          expect(data.updatedAt).to.be.not.equal(user.updatedAt) 
          done()
        })
      })

      // db.User.create({}).then((data) => {
      //   db.User.update({}, { where: { id: data.id }}).then(() => {
      //     db.User.findByPk(data.id).then((user) => { 
      //       expect(data.updatedAt).to.be.not.equal(user.updatedAt) 
      //       done()
      //     })
      //   })
      // })
    })
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id }}).then(() => {
        db.User.findByPk(data.id).then((user) => { 
          expect(user).to.be.equal(null) 
          done()
        })
      })

      // db.User.create({}).then((data) => {
      //   db.User.destroy({ where: { id: data.id }}).then(() => {
      //     db.User.findByPk(data.id).then((user) => { 
      //       expect(user).to.be.equal(null) 
      //       done()
      //     })
      //   })
      // })
    })
  })

})
