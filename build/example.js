#!/usr/bin/env node
"use strict";

const { systemSync } = require ("shell-tools");

function main ()
{
   const argv = new Set (process .argv .slice (2));

   systemSync ("npm", "run", "convert", "--", ... argv);
   systemSync ("npm", "run", "image",   "--", ... argv);
   systemSync ("npm", "run", "zip",     "--", ... argv);
   systemSync ("npm", "run", "html",    "--", ... argv);
   systemSync ("npm", "run", "config");
}

main ();
