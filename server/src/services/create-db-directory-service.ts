import { promises as fs } from 'fs';

import constants from '../constants';

import isFileExistService from './is-file-exist-service';

export default async function createDbDirectoryService(): Promise<void> {
  try {
    if(await isFileExistService(constants.dbDirectoryPath)) return;
    await fs.mkdir(constants.dbDirectoryPath);
    console.log('Create DB Directory : DB Directory Created');
  }
  catch(error) {
    console.error('Create DB Directory : Error', error);
    throw error;
  }
}
