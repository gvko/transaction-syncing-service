// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { get } from 'env-var';

export const config = () => ({
  ethNode: {
    apiUrl: get('ETH_NODE_API_URL').required().asString(),
    apiKey: get('ETH_NODE_API_KEY').required().asString(),
    wsUrl: get('ETH_NODE_WS_URL').required().asString(),
  },
});

export type ConfigShape = ReturnType<typeof config>;
