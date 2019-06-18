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
const ReplyModel = require('../../models/reply')

describe('# Reply Model', () => {
  
  // start with a fresh DB 
  before(done => {
    // db.sequelize.sync({ force: true, match: /_test$/, logging: false })
    // .then(() => {
    //   // console.log('==== db.sequelize.sync ====')
    //   return done()
    // })
    done()

  })

  const Reply = ReplyModel(sequelize, dataTypes)
  const like = new Reply()
  checkModelName(Reply)('Reply')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      Reply.associate({ User })
      Reply.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      expect(Reply.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      expect(Reply.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Reply.create({}).then((like) => {   
        data = like
        done()
      })
    })
    it('read', (done) => {
        db.Reply.findByPk(data.id).then((like) => {  
          expect(data.id).to.be.equal(like.id)
          done()
        })

    })
    it('update', (done) => {
      db.Reply.update({}, { where: { id: data.id }}).then(() => {
        db.Reply.findByPk(data.id).then((like) => { 
          expect(data.updatedAt).to.be.not.equal(like.updatedAt) 
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Reply.destroy({ where: { id: data.id }}).then(() => {
        db.Reply.findByPk(data.id).then((like) => { 
          expect(like).to.be.equal(null) 
          done()
        })
      })
    })
  })

})
