const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const adminAuth = require('@/controllers/coreControllers/adminAuth');
const employeeAuth = require('@/controllers/coreControllers/employeeAuth');

// Admin authentication routes
router.route('/login').post(catchErrors(adminAuth.login));
router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));
router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

// Employee Authentication Routes
router.route('/employee/login').post(catchErrors(employeeAuth.login));
router.route('/employee/forgetpassword').post(catchErrors(employeeAuth.forgetPassword));
router.route('/employee/resetpassword').post(catchErrors(employeeAuth.resetPassword));
router
  .route('/employee/logout')
  .post(employeeAuth.isValidAuthToken, catchErrors(employeeAuth.logout));

module.exports = router;
