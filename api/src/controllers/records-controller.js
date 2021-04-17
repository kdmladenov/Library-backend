import express from 'express';
import { paging } from '../common/constants.js';
import recordsServices from '../services/records-services.js';
import recordsData from '../data/records-data.js';
import { authMiddleware } from '../authentication/auth.middleware.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import errorHandler from '../middleware/errorHandler.js';

const recordsController = express.Router();

// To Do:  ?Test SORT

recordsController
  // get all - search, sort, paging To check
  .get('/', authMiddleware, loggedUserGuard, errorHandler(async (req, res) => {
    const { role, userId } = req.user;
    const {
      search = '', searchBy = 'title', sort = 'record_id', order = 'ASC',
    } = req.query;

    let { pageSize = paging.DEFAULT_BOOKS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_RECORDS_PAGESIZE) pageSize = paging.MAX_RECORDS_PAGESIZE;
    if (+pageSize < paging.MIN_RECORDS_PAGESIZE) pageSize = paging.MIN_RECORDS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const record = await recordsServices.getAllRecords(recordsData)(search, searchBy, sort, order, +pageSize, +page, role, +userId);

    res.status(200).send(record);
  }));

export default recordsController;
