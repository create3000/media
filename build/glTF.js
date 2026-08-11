#!/usr/bin/env node
"use strict";

const path = require ("node:path");
const fs   = require ("node:fs");
const { sh, systemSync } = require ("shell-tools");

function config ()
{
   console .log ("Updating docs/glTF/config.json...");

   const
      examples = path .join (__dirname, "../docs/glTF"),
      filePath = path .join (examples, "config.json"),
      config   = require (filePath);

   const tree = config .reduce ((p, c) => [p, Object .assign (p [c .component] ??= { }, { [c .name]: c })] [0], { });
   const files = sh (`find '${examples}' -maxdepth 1 -mindepth 1 -type d`) .trim () .split ("\n") .sort ();

   for (const folder of files)
   {
      const [component, name] = folder .split ("/") .splice (-2, 2);

      tree [component]        ??= { };
      tree [component] [name] ??= { };

      const object = tree [component] [name];

      object .name      = name;
      object .component = component;
   }

   const modified = Object .values (tree) .flatMap (component => Object .values (component))
      .sort ((a, b) => a .name .localeCompare (b .name))
      .sort ((a, b) => a .component .localeCompare (b .component));

   fs .writeFileSync (filePath, JSON .stringify (modified, null, 2));
}

function image (folder)
{
}

function main ()
{
   config ();
}

main ();
