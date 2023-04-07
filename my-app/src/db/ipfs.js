import Box from '3box';
import IPFS from 'ipfs-http-client';

export const ipfs = IPFS.create({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

export const getProfile = async (address) => {
  const profile = await Box.getProfile(address);
  return profile;
};

export const saveDataToIPFS = async (data) => {
  const { path } = await ipfs.add(JSON.stringify(data));
  return path;
};

export const getDataFromIPFS = async (hash) => {
  const stream = ipfs.cat(hash);
  let data = '';

  for await (const chunk of stream) {
    data += chunk.toString();
  }

  return JSON.parse(data);
};

export const saveHashTo3Box = async (provider, address, key, value) => {
  const box = await Box.openBox(address, provider);
  await box.syncDone;
  await box.private.set(key, value);
  box.close();
};

export const getHashFrom3Box = async (address, key) => {
  const box = await Box.openBox(address, null);
  await box.syncDone;
  const value = await box.private.get(key);
  box.close();
  return value;
};
