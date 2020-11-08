const AWS = require('aws-sdk');

const {getDynamo} = require('./utils');
const TableName = 'SchoolStudents';

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = async (event) => {
  // TODO validate that all expected attributes are present (assume they are all required)
  const requiredFields = ['schoolId', 'schoolName', 'studentId', 'studentFirstName', 'studentLastName', 'studentGrade'];
  const missingFields = requiredFields
    .map(field =>
      Object.keys(event).includes(field) ? '' : field)
    .filter(Boolean);

  if (missingFields.length) {
    throw new Error(`Missing required fields ${missingFields.join(', ')}`);
  }

  // TODO use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
  const Params = {
    TableName,
    Item: {
      ...event
    }
  }

  try {
    await getDynamo().put(Params).promise();
  } catch (ex) {
    console.error({ ex })
    throw ex;
  }

  return;
};