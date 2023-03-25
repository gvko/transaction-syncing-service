require('dotenv').config();

import { get } from 'env-var';

export const config = () => ({
  ethereumNode: {
    apiUrl: get('ETHEREUM_NODE_API_URL').required().asString(),
    apiKey: get('ETHEREUM_NODE_API_KEY').required().asString(),
  },
});

export type ConfigShape = ReturnType<typeof config>;
