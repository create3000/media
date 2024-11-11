#!/usr/bin/env node
"use strict";

const
   path = require ("path"),
   fs   = require ( "fs")

function main ()
{
   console .log ("Updating docs/examples/config.json...");

   const
      filePath = path .join (__dirname, "../docs/examples/config.json"),
      config   = require (filePath);

   fs .writeFileSync (filePath, JSON .stringify (config, null, 2));
}

main ();
