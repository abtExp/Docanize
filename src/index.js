#!/usr/bin/env node

import * as Entities from './Entities';

(() => {
    let [_, AllFiles] = await makeDirTree();
    generateComments(AllFiles);
})();