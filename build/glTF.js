#!/usr/bin/env node
"use strict";

const path = require ("node:path");
const fs   = require ("node:fs");
const { sh, systemSync } = require ("shell-tools");

const
   examples = path .join (__dirname, "../docs/glTF"),
   includes = new Set (process .argv .slice (2));

function config ()
{
   console .log ("Updating docs/glTF/config.json...");

   const
      filePath = path .join (examples, "config.json"),
      config   = require (filePath);

   const tree = config .reduce ((p, c) => Object .assign (p, { [c .name]: c }), { });
   const files = sh (`find '${examples}' -type f  -name "*.gltf" -o -name "*.glb"`) .trim () .split ("\n") .sort ();

   for (const filePath of files)
   {
      const [name, basename] = filePath .split ("/") .splice (-2, 2);

      const object = tree [name] ??= { };

      object .name     = name;
      object .basename = basename;
   }

   const modified = Object .values (tree)
      .sort ((a, b) => a .name .localeCompare (b .name));

   fs .writeFileSync (filePath, JSON .stringify (modified, null, 2));
}

function image ()
{
   const
      filePath = path .join (examples, "config.json"),
      config   = require (filePath);

   for (const { name, basename } of config)
   {
      if (includes .size && !includes .has (name))
         continue;

      console .log (name);

      const folder = path .join (examples, name);

      fs .mkdirSync (path .join (folder, "screenshots"), { recursive: true });

      process .chdir (folder);

      systemSync (`npx --yes x3d-image -s 1000x562 -a -i '${basename}' -o screenshots/screenshot.png`);
      systemSync (`magick screenshots/screenshot.png screenshots/screenshot.avif`);
      systemSync (`magick screenshots/screenshot.png -resize 110x62 -quality 99 -define heic:lossless=true -define heic:chroma=444 screenshots/screenshot-small.avif`);
      systemSync (`rm screenshots/screenshot.png`);
   }
}

function main ()
{
   config ();
   image ();
}

main ();
