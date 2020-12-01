export default {
  jwt: {
    secret: process.env.APP_SECRET || 'OOKOK',
    expireTime: '1d',
  },
};
