#!/usr/bin/env node

const fs = require('fs');

const commentTemplate = `/** */`;

import * as Entities from './Entities';

(() => {
    let [_, AllFiles] = await makeDirTree();
    generateComments(AllFiles);
})();