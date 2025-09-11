#!/usr/bin/env node
"use strict";

const
   path               = require ("path"),
   yargs              = require ("yargs"),
   { sh, systemSync } = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = `${cwd}/docs/examples`,
   includes = new Set (process .argv .slice (2));

const args = yargs (process .argv) .option ("delay",
{
   type: "number",
   alias: "d",
   requiresArg: true,
   default: 0,
})
.argv;

let extra = "";

if (args .delay)
   extra += `-d ${args .delay}`;

function image (folder)
{
   const base = path .basename (folder);

   if (includes .size && !includes .has (base))
      return;

   console .log (base);

   process .chdir (folder);
   systemSync (`npx --yes x3d-image ${extra} -s 1000x562 -i ${base}.x3d -o screenshot.png`);
   systemSync (`magick screenshot.png screenshot.avif`);
   systemSync (`magick screenshot.png -resize 110x62 screenshot-small.png`);
   systemSync (`rm screenshot.png`);
}

function main ()
{
   const files = sh (`find '${examples}' -maxdepth 2 -mindepth 2 -type d`) .trim () .split ("\n") .sort ();

   for (const folder of files)
      image (folder);
}

main ();
