import { join } from 'path'
import fs from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express';

const PUBLIC_FOLDER_NAME = 'public'
export function setupPublicFolder(app: NestExpressApplication) {
  fs.mkdirSync(`./${PUBLIC_FOLDER_NAME}`, { recursive: true })
  app.useStaticAssets(join(__dirname, '..', PUBLIC_FOLDER_NAME), {
    prefix: `/${PUBLIC_FOLDER_NAME}/`,
  });
}

setupPublicFolder.PUBLIC_FOLDER_NAME = PUBLIC_FOLDER_NAME;
