#!/usr/bin/env node
"use strict";

const
   path               = require ("path"),
   { sh, systemSync } = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2));

function zip (folder)
{
   const base = path .basename (folder);

   if (includes .size && !includes .has (base))
      return;

   console .log (base);

   process .chdir (path .dirname (folder));
   systemSync (`zip -q ${base}.zip ${base}/ -r -x */${base}.O.x3d -x */${base}.zip -x */screenshot-small.png`);
   systemSync (`mv ${base}.zip ${base}/`);
}

function main ()
{
   const files = sh`find '${examples}' -maxdepth 2 -mindepth 2 -type d` .trim () .split ("\n") .sort ();

   for (const folder of files)
      zip (folder);
}

main ();

