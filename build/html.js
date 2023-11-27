#!/usr/bin/env node
"use strict";

const
   path = require ("path"),
   fs   = require ("fs");

function sh (strings, ... values)
{
   const { execSync } = require ("child_process");

   return execSync (String .raw ({ raw: strings }, ... values), { encoding: "utf8", maxBuffer: Infinity });
}

const
   cwd      = process .cwd (),
   examples = path .join (cwd, "docs/examples"),
   media    = "https://create3000.github.io/media/examples";

function example (folder)
{
   const
      base      = path .basename (folder),
      component = path .basename (path .dirname (folder));

   console .log (component, base);

   let html = sh`cat ${cwd}/example-template.html`;
   html = html .replace (/BASE/sg, base);
   html = html .replace (/FILE_NAMEsg/, `${base}.x3d`);
   html = html .replace (/URL/sg, `${media}/${component}/${base}/${base}.x3d`);

   fs .writeFileSync (`${folder}/example.html`, html);
}

for (const folder of sh`find ${examples} -maxdepth 2 -mindepth 2 -type d` .split ("\n") .sort ())
   example (folder);
