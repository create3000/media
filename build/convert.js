#!/usr/bin/env node
"use strict";

const
   path                   = require ("path"),
   { default: Semaphore } = require ("semaphore-async-await");

function sh (strings, ... values)
{
   const { execSync } = require ("child_process");

   return execSync (String .raw ({ raw: strings }, ... values), { encoding: "utf8", maxBuffer: Infinity });
}

function system (command)
{
   return new Promise (async (resolve, reject) =>
   {
      const { exec } = require ("child_process");

      const childProcess = exec (command);

      childProcess .stdout .on ("data", data => console .log (data));
      childProcess .stderr .on ("data", data => console .error (data));

      childProcess .on ("exit",  resolve);
      childProcess .on ("error", reject);
   });
}

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2)),
   lock     = new Semaphore (4);

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

   queue (x3d,  () => system (`npx --yes x3d-tidy            -r -m -i '${orig}' -o '${x3d}' `));
   queue (x3dv, () => system (`npx --yes x3d-tidy -s COMPACT -r -m -i '${orig}' -o '${x3dv}'`));
   queue (x3dj, () => system (`npx --yes x3d-tidy -s COMPACT -r -m -i '${orig}' -o '${x3dj}'`));
}

const files = sh`find '${examples}' -maxdepth 2 -mindepth 2 -type d` .trim () .split ("\n") .sort ();

for (const folder of files)
   convert (folder);


