require('dotenv').config();

import { get } from 'env-var';

export const config = () => ({
  auth: {
    jwt: {
      secret: get('AUTH_JWT_SECRET').required().asString(),
      expiresIn: get('JWT_DEFAULT_EXPIRES_IN').default('30m').asString(),
    },
  },
  ethereumNode: {
    apiUrl: get('ETHEREUM_NODE_API_URL').required().asString(),
    apiKey: get('ETHEREUM_NODE_API_KEY').required().asString(),
    contractAddress: get('CONTRACT_ADDRESS').required().asString(),
  },
});

export type ConfigShape = ReturnType<typeof config>;
