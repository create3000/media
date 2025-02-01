#!/usr/bin/env node
"use strict";

const
   fs                 = require ("fs"),
   path               = require ("path"),
   { sh, systemSync } = require ("shell-tools"),
   cwd                = process .cwd (),
   media              = "https://create3000.github.io/media/tutorials",
   includes           = new Set (process .argv .slice (2));

function html (folder)
{
   const
      base     = path .basename (folder),
      basename = fs .existsSync (path .join (folder, `${base}.x3d`)) ? `${base}.x3d`: `${base}.x3dv`,
      file     = path .join (folder, basename),
      relative = path .relative (path .join (cwd, "docs/tutorials/"), file);

   console .log (relative);

   let html = sh (`cat ${cwd}/example-template.html`);
   html = html .replace (/BASE/sg, base);
   html = html .replace (/FILE_NAME/sg, basename);
   html = html .replace (/URL/sg, `${media}/${relative}`);

   fs .writeFileSync (`${folder}/example.html`, html);
}

function image (folder)
{
   const base = path .basename (folder);

   console .log (base);
   process .chdir (folder);

   systemSync (`npx --yes x3d-image -s 1000x562 -i ${base}.x3dv -o screenshot.png`);
   systemSync (`convert screenshot.png screenshot.avif`);
   systemSync (`rm screenshot.png`);
}

function zip (folder)
{
   const base = path .basename (folder);

   process .chdir (path .dirname (folder));

   systemSync (`zip -q ${base}.zip ${base}/ -r -x */${base}.zip`);
   systemSync (`mv ${base}.zip ${base}/`);
}

function example (folder)
{
   const base = path .basename (folder);

   if (base .startsWith ("."))
      return;

   if (includes .size && !includes .has (base))
      return;

   html (folder);
   image (folder);
   zip (folder);
}

function main ()
{
   const
      scenes  = path .join (cwd, "docs/tutorials/scenes"),
      folders = Array .from (fs .readdirSync (scenes));

   for (const folder of folders)
      example (path .join (scenes, folder));
}

main ();
