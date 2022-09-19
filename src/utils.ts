import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = (importMeta) => dirname(fileURLToPath(importMeta.url));
