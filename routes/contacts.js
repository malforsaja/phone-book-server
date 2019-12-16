const fs = require('fs');
const express = require('express');
const router = express.Router();
const Rest = require('../controller/lib');

const dataPath = './data/contacts.json';

let contactREST = new Rest(dataPath);

// READ
router.get('/', (req, res) => {
  contactREST.findContacts((error, data) => {
    if (error) {
      console.log('err: ', error);
      //throw error
    }
    let parsedData = JSON.parse(data);
    parsedData.sort((a, b) => (a.firstname > b.firstname) ? 1 : (a.firstname === b.firstname) ? ((a.lastname > b.lastname) ? 1 : -1) : -1)

    res.send(parsedData);
  })
});

// READ 1 Contact
router.get('/:id', (req, res) => {
  contactREST.contactDetails(req.params.id)
    .then((data) => {
      if (data.length === 0) {
        return res.status(204).send({ msg: "Contact not found!" })
      }
      res.send(data);
    })
    .catch(err => res.send("Something was wrong while retrieving the contact!"));
});

// CREATE
router.post('/', (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.numbers) {
    return res.status(400).send({
      error: "Format is wrong, add an contact like message",
      message: {
        firstname: "name",
        lastname: "surname",
        numbers: [
          {
            type: "Work/Cellphone/Home",
            number: "67854639"
          }
        ]
      }
    })
  }

  if (!req.body.numbers.every(contact => contact.type.includes("Work") || contact.type.includes("Home") || contact.type.includes("Cellphone"))
    || !req.body.numbers.every(contact => contact.number)) {
    return res.status(400).send("Type of contact is wrong or number is missing! Please choose one of: Work/Cellphone/Home")
  }

  contactREST.addContact(req.body)
    .then(data => res.status(200).send(data[data.length - 1]))
    .catch(err => res.send("Something was wrong while adding the contact!"));
});


// UPDATE
router.put('/:id', (req, res) => {

  if (!req.body.firstname || !req.body.lastname || !req.body.numbers) {
    return res.status(400).send({
      error: "Format is wrong, add an contact like message",
      message: {
        firstname: "name",
        lastname: "surname",
        numbers: [
          {
            type: "Work/Cellphone/Home",
            number: "67854639"
          }
        ]
      }
    })
  }

  if (!req.body.numbers.every(contact => contact.type.includes("Work") || contact.type.includes("Home") || contact.type.includes("Cellphone"))
    || !req.body.numbers.every(contact => contact.number)) {
    return res.status(400).send("Type of contact is wrong or number is missing! Please choose one of: Work/Cellphone/Home")
  }

  let contactData = {
    id: parseInt(req.params.id),
    ...req.body
  }
  contactREST.updateContact(req.params.id, contactData)
    .then(() => {
      res.send(`Contact with id: ${req.params.id} is updated`);
    })
    .catch(err => res.send("Something was wrong while updating the contact!"));
});


// DELETE
router.delete('/:id', (req, res) => {
  contactREST.deleteContact(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(204).send({ msg: "Contact not found!" })
      }
      res.send(`Contact with id: ${req.params.id} is removed`);
    })
    .catch(err => res.send("Something was wrong while deleting the contact!"));
});


module.exports = router;