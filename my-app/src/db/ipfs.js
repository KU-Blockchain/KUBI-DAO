import { create } from 'ipfs-http-client';
const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECTID + ':' + process.env.NEXT_PUBLIC_INFURA_IPFS).toString('base64');
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  },

});

export default ipfs;
