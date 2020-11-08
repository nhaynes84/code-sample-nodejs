const AWS = require('aws-sdk');

// what could you do to improve performance?
let dynamodb;
const getDynamo = () => {
    if (dynamodb) return dynamodb;

    dynamodb = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        endpoint: new AWS.Endpoint('http://localhost:8000'),
        region: 'us-west-2',
        accessKeyId: 'fakeKeyId',
        secretAccessKey: 'fakeSecretAccessKey',
      });
    return dynamodb;
}

const buildQuery = ({ schoolId, studentId, studentLastName }) => {
    const TableName = 'SchoolStudents';
    const studentLastNameGsiName = 'studentLastNameGsi';

    let query = {
        TableName,
        Limit: 5
    };

    if (schoolId) {
        query.KeyConditionExpression = [
            ["schoolId = :schoolId"]
        ]
        query.ExpressionAttributeValues = {
            ":schoolId": schoolId
        }
    }
    if (studentId) {
        query.KeyConditionExpression = [
            ...query.KeyConditionExpression,
            ["studentId = :studentId"]
        ].join(' and ');
        query.ExpressionAttributeValues = {
            ...query.ExpressionAttributeValues,
            ":studentId": studentId
        }
    }

    // TODO (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.
    if (studentLastName) {
        query.IndexName = studentLastNameGsiName;
        query.KeyConditionExpression = "studentLastName = :studentLastName";
        query.ExpressionAttributeValues = {
            ":studentLastName": studentLastName,
        };
    }
    return query;
}

const getAllItems = async (itemsQuery) => {
    let response;
    try {
      response = await getDynamo().query(itemsQuery).promise();
    } catch (ex) {
      console.error({ ex })
      throw ex;
    }
    return response;
  }

module.exports = {
    buildQuery,
    getAllItems,
    getDynamo
}