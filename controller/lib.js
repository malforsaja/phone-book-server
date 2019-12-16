const fs = require('fs');
const { readFile, writeFile } = require("../helper");

class REST {
  constructor(dataPath) {
    this.data = dataPath;
  }

  findContacts(callback) {
    fs.readFile(this.data, 'utf-8', (error, data) => {
      if (error) {
        throw error;
      }

      callback(error, data);
    });
  }

  contactDetails(contactId) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.data, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }
        
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (err) {
          console.log(err);
          return;
        }

        let foundContact = [];
        parsedData.map(contact => {
          if (contact.id == contactId) {
            foundContact.push(contact);
          }
        })
        resolve(foundContact[0]);
      });
    });
  }

  addContact(contactData) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.data, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }

        let parsedData = JSON.parse(data);
        const newContactId = parsedData.length + 1;

        // add the new contact
        parsedData[parsedData.length] = {
          id: newContactId,
          ...contactData
        };

        writeFile(JSON.stringify(parsedData, null, 2), () => {
          resolve(parsedData);
        });
      });
    });
  }

  // UPDATE
  updateContact(contactId, contactData) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.data, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (err) {
          console.log(err);
          return;
        }
        
        let foundContact = [];
        parsedData.map(contact => {
          if (contact.id == contactId) {
            foundContact.push(contact);
          }
        })
        if (foundContact.length === 0) {
          resolve();
          return;
        }
        let index = parsedData.indexOf(foundContact[0]);
        parsedData.splice(index, 1, contactData);
        writeFile(JSON.stringify(parsedData, null, 2), () => {
          resolve(foundContact);
        });
      });
    });
  }

  // DELETE
  deleteContact(contactId) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.data, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (err) {
          console.log(err);
          return;
        }

        let foundContact = [];
        parsedData.map(contact => {
          if (contact.id == contactId) {
            foundContact.push(contact);
          }
        })
        if (foundContact.length === 0) {
          resolve();
          return;
        }
        let index = parsedData.indexOf(foundContact[0]);
        parsedData.splice(index, 1);
        writeFile(JSON.stringify(parsedData, null, 2), () => {
          resolve(foundContact);
        });
      });
    });
  }
}

module.exports = REST;