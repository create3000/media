#!/usr/bin/env node
"use strict";

const path = require ("path");

const { sh, system } = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2));

async function zip (folder)
{
   const base = path .basename (folder);

   if (includes .size && !includes .has (base))
      return;

   console .log (base);

   process .chdir (path .dirname (folder));
   await system (`zip -q ${base}.zip ${base}/ -r -x */${base}.O.x3d -x */${base}.zip -x */screenshot-small.png`);
   await system (`mv ${base}.zip ${base}/`);
}

async function main ()
{
   const files = sh`find '${examples}' -maxdepth 2 -mindepth 2 -type d` .trim () .split ("\n") .sort ();

   for (const folder of files)
      await zip (folder);
}

main ();

