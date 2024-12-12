#!/usr/bin/env node
"use strict";

const
   path                   = require ("path"),
   os                     = require ("os"),
   { default: Semaphore } = require ("semaphore-async-await"),
   { sh, system }         = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2)),
   lock     = new Semaphore (os .cpus () .length);

async function queue (name, fn)
{
   await lock .acquire ();
   console .log (name);
   await fn ();
   lock .release ();
}

function convert (folder)
{
   const
      base = path .basename (folder),
      orig = `${folder}/${base}.O.x3d`,
      x3d  = `${folder}/${base}.x3d`,
      x3dv = `${folder}/${base}.x3dv`,
      x3dj = `${folder}/${base}.x3dj`;

   if (includes .size && !includes .has (base))
      return;

   let cmd = `npx --yes x3d-tidy -r -m`;

   cmd += ` -s TIDY    -i '${orig}' -o '${x3d}' `;
   cmd += ` -s COMPACT -i '${orig}' -o '${x3dv}'`;
   cmd += ` -s COMPACT -i '${orig}' -o '${x3dj}'`;

   queue (x3d, () => system (cmd));
}

const files = sh (`find '${examples}' -maxdepth 2 -mindepth 2 -type d`) .trim () .split ("\n") .sort ();

for (const folder of files)
   convert (folder);


