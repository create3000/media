#!/usr/bin/env node
"use strict";

const
   path   = require ("path"),
   fs     = require ("fs"),
   { sh } = require ("shell-tools");

const
   cwd      = process .cwd (),
   examples = path .join (cwd, "docs/examples"),
   includes = new Set (process .argv .slice (2)),
   media    = "https://create3000.github.io/media/examples";

function html (folder)
{
   const
      base      = path .basename (folder),
      component = path .basename (path .dirname (folder));

   if (includes .size && !includes .has (base))
      return;

   console .log (component, base);

   let html = sh (`cat ${cwd}/example-template.html`);
   html = html .replace (/BASE/sg, base);
   html = html .replace (/FILE_NAME/sg, `${base}.x3d`);
   html = html .replace (/URL/sg, `${media}/${component}/${base}/${base}.x3d`);

   fs .writeFileSync (`${folder}/example.html`, html);
}

const files = sh (`find '${examples}' -maxdepth 2 -mindepth 2 -type d`) .trim () .split ("\n") .sort ();

for (const folder of files)
   html (folder);
