// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { get } from 'env-var';

export const config = () => ({
  db: {
    username: get('DB_USERNAME').required().asString(),
    password: get('DB_PASSWORD').required().asString(),
    dbName: get('DB_NAME').required().asString(),
  },
  ethNode: {
    apiUrl: get('ETH_NODE_HTTP_URL').required().asString(),
    wsUrl: get('ETH_NODE_WS_URL').required().asString(),
  },
  polygonNode: {
    apiUrl: get('POLYGON_NODE_HTTP_URL').required().asString(),
    wsUrl: get('POLYGON_NODE_WS_URL').required().asString(),
  },
});

export type ConfigShape = ReturnType<typeof config>;
