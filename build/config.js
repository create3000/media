#!/usr/bin/env node
"use strict";

const
   path   = require ("path"),
   fs     = require ( "fs"),
   { sh } = require ("shell-tools")

function main ()
{
   console .log ("Updating docs/examples/config.json...");

   const
      examples = path .join (__dirname, "../docs/examples"),
      filePath = path .join (examples, "config.json"),
      config   = require (filePath);

   const tree = config .reduce ((p, c) => [p, Object .assign (p [c .component] ??= { }, { [c .name]: c })] [0], { });
   const files = sh (`find '${examples}' -maxdepth 2 -mindepth 2 -type d`) .trim () .split ("\n") .sort ();

   for (const folder of files)
   {
      const [component, name] = folder .split ("/") .splice (-2, 2);

      tree [component]        ??= { };
      tree [component] [name] ??= { };

      const object = tree [component] [name];

      object .name      = name;
      object .component = component;
   }

   const modified = Object .values (tree) .flatMap (component => Object .values (component));

   fs .writeFileSync (filePath, JSON .stringify (modified, null, 2));
}

main ();
