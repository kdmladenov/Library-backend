import express from 'express';
import validateBody from '../middleware/validate-body.js';
import serviceErrors from '../services/service-errors.js';
import createRecordSchema from '../validator/create-record-schema.js';
import recordsServices from '../services/records-services.js';
import recordsData from '../data/records-data.js';

const recordsController = express.Router();
// To Do: Gamification, getAllRecords, updateRecord, additional fields in records  ?

recordsController
  // Borrow a book
  .post('/books/:bookId', validateBody('record', createRecordSchema), async (req, res) => {
    const { userId } = req.body;
    const { bookId } = req.params;

    const { error, record } = await recordsServices.createRecord(recordsData)(+userId, +bookId);

    if (error === serviceErrors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already borrowed!' });
    } else {
      res.status(201).send(record);
    }
  })
  // Return a book
  .delete('/books/:bookId', async (req, res) => {
    const { bookId } = req.params;

    const { error, record } = await recordsServices.deleteRecord(recordsData)(+bookId);

    if (error === serviceErrors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this id is currently not borrowed!' });
    } else {
      res.status(200).send(record);
    }
  });

export default recordsController;
