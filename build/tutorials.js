#!/usr/bin/env node
"use strict";

const
   fs                 = require ("fs"),
   path               = require ("path"),
   { sh, systemSync } = require ("shell-tools"),
   cwd                = process .cwd (),
   media              = "https://create3000.github.io/media/tutorials";

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

function zip (folder)
{
   const base = path .basename (folder);

   process .chdir (path .dirname (folder));

   systemSync (`zip -q ${base}.zip ${base}/ -r -x */${base}.zip`);
   systemSync (`mv ${base}.zip ${base}/`);
}

function example (folder)
{
   html (folder);
   zip (folder);
}

function main ()
{
   example (path .join (cwd, "docs/tutorials/hello-world"));

   const scenes = path .join (cwd, "docs/tutorials/scenes");

   for (const folder of fs .readdirSync (scenes))
      example (path .join (scenes, folder));
}

main ();
