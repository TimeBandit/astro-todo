import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = import.meta.env.REGION;
const IDENTITY_POOL_ID = import.meta.env.IDENTITY_POOL_ID; // An Amazon Cognito Identity Pool ID.
const USER_POOL_ID = import.meta.env.USER_POOL_ID;

let docClient: DynamoDBDocumentClient | null = null;

// Create an Amazon DynaomDB service client object.
const createDocClient = (idToken: string): DynamoDBDocumentClient => {
  console.info("Creating doc client");
  console.info({ REGION, IDENTITY_POOL_ID, USER_POOL_ID });
  const dynamoClient = new DynamoDBClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
      },
    }),
  });

  const docClient = DynamoDBDocumentClient.from(dynamoClient);
  return docClient;
};

const getDocClient = (idToken: string | null): DynamoDBDocumentClient => {
  console.info({ idToken });
  if (!docClient) {
    if (!idToken) throw new Error("No token provided");
    docClient = createDocClient(idToken);
  }
  return docClient;
};

export { getDocClient };
