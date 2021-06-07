import AWS from 'aws-sdk';

 const myDocClient=new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    apiVersion: 'latest',
  });

export default myDocClient;