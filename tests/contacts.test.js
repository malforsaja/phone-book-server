const chai = require('chai');
const expect = chai.expect;

const app = require('../app')

//chai-http used to send async requests to our app
const http = require('chai-http');
chai.use(http);

describe('Contact api routes', () => {

  it('Should exists the app', () => {
    expect(app).to.be.a('function');
  })

  it('it should list the available contacts', (done) => {
    chai.request(app).get('/api/contacts')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        let response = res.body;
        response.forEach(contact => {
          //console.log('res: ', city);
          expect(contact.id).to.be.a('number');
          expect(contact.firstname).to.be.a('string');
          expect(contact.lastname).to.be.a('string');
        });
        done();
      }).catch(err => {
        console.log(err.message);
      });
  })

  it('it should retrieve the details for a contact', (done) => {

    chai.request(app).get('/api/contacts/1')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('id');
        expect(res.body).to.haveOwnProperty('firstname');
        expect(res.body).to.haveOwnProperty('lastname');
        expect(res.body).to.haveOwnProperty('numbers');

        done();
      }).catch(err => {
        console.log(err.message);
      });
  })

  it('it should add a contact', (done) => {
    //send a GET request to /
    chai.request(app).post('/api/contacts')
      .send({
        firstname: "Malfor",
        lastname: "Saja",
        numbers: [
          {
            type: "Work",
            number: "67854639"
          }
        ]
      })
      .then(res => {
        expect(res).to.have.status(200);
        done();
      }).catch(err => {
        console.log(err);
      });
  })

  it('it should update the specified contact', (done) => {
    //send a GET request to /
    chai.request(app).put('/api/contacts/6')
      .send({
        firstname: "Malfor",
        lastname: "Saja",
        numbers: [
          {
            type: "Work",
            number: "67854639"
          }
        ]
      })
      .then(res => {
        expect(res).to.have.status(200);
        done();
      }).catch(err => {
        console.log(err);
      });
  })

  it('it should delete the specified contact', (done) => {
    //send a GET request to /
    chai.request(app).delete('/api/contacts/6')
      .then(res => {
        expect(res).to.have.status(200);
        done();
      }).catch(err => {
        console.log(err);
      });
  })

  after((done) => {
    //stop server
    console.log('All tests completed, stopping server....')
    process.exit();
    done();
  });
})
