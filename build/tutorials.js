#!/usr/bin/env node
"use strict";

const
   fs             = require ("fs"),
   path           = require ("path"),
   { systemSync } = require ("shell-tools"),
   cwd            = process .cwd ();

function zip (folder)
{
   const base = path .basename (folder);

   process .chdir (path .dirname (folder));

   systemSync (`zip -q ${base}.zip ${base}/ -r -x */${base}.zip`);
   systemSync (`mv ${base}.zip ${base}/`);
}

function main ()
{
   zip (path .join (cwd, "docs/tutorials/hello-world"));

   const scenes = path .join (cwd, "docs/tutorials/scenes");

   for (const folder of fs .readdirSync (scenes))
      zip (path .join (scenes, folder));
}

main ();
