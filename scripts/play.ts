#!/usr/bin/env zx
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { $, cd } from 'zx';

cd(join(dirname(fileURLToPath(import.meta.url)), '../playground'));
// FIXME prompts display error when run by $``
$`nr play`;
