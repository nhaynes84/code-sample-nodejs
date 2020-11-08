const AWS = require('aws-sdk');

const { buildQuery, getAllItems } = require('./utils');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-west-2',
  accessKeyId: 'fakeKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
  // what could you do to improve performance?
});

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = async (event) => {
  // TODO (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)
  const query = buildQuery(event);

  // TODO use the AWS.DynamoDB.DocumentClient to write a query against the 'SchoolStudents' table and return the results.
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
  let results = { Items: [] };
  do {
    const { LastEvaluatedKey, Items } = await getAllItems(
      {...query, ExclusiveStartKey: results.LastEvaluatedKey}
    );
    results.Items = [...results.Items, ...Items];
    results.LastEvaluatedKey = LastEvaluatedKey;
  } while (results.LastEvaluatedKey);

  return results.Items;
};