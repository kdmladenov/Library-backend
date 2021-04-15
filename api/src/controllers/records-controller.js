import express from 'express';
import { paging } from '../common/constants.js';
import recordsServices from '../services/records-services.js';
import recordsData from '../data/records-data.js';
import { authMiddleware } from '../authentication/auth.middleware.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';


const recordsController = express.Router();

// To Do:  ?

recordsController
  // get all - search, sort, paging
  //Test SORT
  .get('/', authMiddleware, loggedUserGuard, async (req, res) => {
    const {
      search = '', searchBy = 'title', sort = 'record_id', order = 'ASC',
    } = req.query;
    let { pageSize = paging.DEFAULT_BOOKS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_RECORDS_PAGESIZE) pageSize = paging.MAX_RECORDS_PAGESIZE;
    if (+pageSize < paging.MIN_RECORDS_PAGESIZE) pageSize = paging.MAX_RECORDS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const record = await recordsServices.getAllRecords(recordsData)(search, searchBy, sort, order, +pageSize, +page);

    res.status(200).send(record);
  });

export default recordsController;

// GET //book/:booksId/records
// GET /records/:

/**
 * POST   books/bookId/records
 * DELETE books/bookId/records
 * GET    ???/records(userId from authMiddleware) ${if(role !== roleEnum.admin) {
 *                                                'WHERE userId = r.user_id'}}
 *         filter by bookId
 */