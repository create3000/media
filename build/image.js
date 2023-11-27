#!/usr/bin/env node
"use strict";

const
   path  = require ("path"),
   yargs = require ("yargs");

const { sh, system } = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2));

const args = yargs (process .argv) .option ("delay",
{
   type: "number",
   alias: "d",
})
.argv;

let extra = "";

if (args .delay)
   extra += `-d ${args .delay}`;

async function image (folder)
{
   const base = path .basename (folder);

   if (includes .size && !includes .has (base))
      return;

   console .log (base);

   process .chdir (folder);
   await system (`npx --yes x3d-image ${extra} -s 1000x562 -i ${base}.x3d -o screenshot.png`);
   await system (`convert -resize 110x62 screenshot.png screenshot-small.png`);
}

async function main ()
{
   const files = sh`find '${examples}' -maxdepth 2 -mindepth 2 -type d` .trim () .split ("\n") .sort ();

   for (const folder of files)
      await image (folder);
}

main ();
