import { addToIpfs } from '../src/contexts/IPFScontext';
const ipfsResult = await addToIpfs(JSON.stringify(accountsDataJson));