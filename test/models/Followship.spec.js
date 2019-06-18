// process.env.NODE_ENV = 'test'

// var chai = require('chai');
// var sinon = require('sinon');
// chai.use(require('sinon-chai'));

// const { expect } = require('chai')
// const {
//   sequelize,
//   dataTypes,
//   checkModelName,
//   checkUniqueIndex,
//   checkPropertyExists
// } = require('sequelize-test-helpers')

// const db = require('../../models')
// const FollowshipModel = require('../../models/followship')

// describe('# Followship Model', () => {
  
//   // start with a fresh DB 
//   before(done => {
//     db.sequelize.sync({ force: true, match: /_test$/, logging: false })
//     .then(() => {
//       // console.log('==== db.sequelize.sync ====')
//       return done()
//     })

//   })

//   const Followship = FollowshipModel(sequelize, dataTypes)
//   const followship = new Followship()
//   checkModelName(Followship)('Followship')

//   context('properties', () => {
//     ;[
//     ].forEach(checkPropertyExists(followship))
//   })

//   context('associations', () => {
//     const User = 'User';
//     before(() => {
//       Followship.associate({ User })
//     })

//     it('should belong to user', (done) => {
//       expect(Followship.belongsTo).to.have.been.calledWith(User)
//       done()
//     })
//   })

//   context('action', () => {

//     let data = null

//     it('create', (done) => {
//       db.Followship.create({}).then((followship) => {   
//         data = followship
//         done()
//       })
//     })
//     it('read', (done) => {
//         db.Followship.findByPk(data.id).then((followship) => {  
//           expect(data.id).to.be.equal(followship.id)
//           done()
//         })

//       // db.Followship.create({}).then((data) => {
//       //   db.Followship.findByPk(data.id).then((followship) => {  
//       //     expect(data.id).to.be.equal(followship.id)
//       //     done()
//       //   })
//       // })
//     })
//     it('update', (done) => {
//       db.Followship.update({}, { where: { id: data.id }}).then(() => {
//         db.Followship.findByPk(data.id).then((followship) => { 
//           expect(data.updatedAt).to.be.not.equal(followship.updatedAt) 
//           done()
//         })
//       })

//       // db.Followship.create({}).then((data) => {
//       //   db.Followship.update({}, { where: { id: data.id }}).then(() => {
//       //     db.Followship.findByPk(data.id).then((followship) => { 
//       //       expect(data.updatedAt).to.be.not.equal(followship.updatedAt) 
//       //       done()
//       //     })
//       //   })
//       // })
//     })
//     it('delete', (done) => {
//       db.Followship.destroy({ where: { id: data.id }}).then(() => {
//         db.Followship.findByPk(data.id).then((followship) => { 
//           expect(followship).to.be.equal(null) 
//           done()
//         })
//       })

//       // db.Followship.create({}).then((data) => {
//       //   db.Followship.destroy({ where: { id: data.id }}).then(() => {
//       //     db.Followship.findByPk(data.id).then((followship) => { 
//       //       expect(followship).to.be.equal(null) 
//       //       done()
//       //     })
//       //   })
//       // })
//     })
//   })

// })
