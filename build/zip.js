#!/usr/bin/env node
"use strict";

const path = require ("path");

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

