export default {
  provider: process.env.APP_MAIL_PROVIDER || 'ethereal',
  default: {
    from: {
      name: 'Caio Cesar',
      email: 'caio.crd@progerencial.com.br',
    },
  },
};
