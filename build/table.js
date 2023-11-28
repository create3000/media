#!/usr/bin/env node
"use strict";

const
   path   = require ("path"),
   fs     = require ("fs"),
	{ sh } = require ("shell-tools");

const COLUMNS = 7;

const
	cwd      = process .cwd (),
	examples = `${cwd}/docs/examples`;

const
	X3D   = sh`find '${examples}/X3D' -type f -name 'example.html'` .trim () .split ("\n") .sort (),
	other = sh`find '${examples}' -type f -name 'example.html' -not -path '*/X3D/*'` .trim () .split ("\n") .sort (),
	html  = [... X3D, ... other],
	table = Array .from ({ length: Math .floor ((html .length - 1) / COLUMNS) + 1 }, () => [ ]);

for (const [i, example] of html .entries ())
	table [Math .floor (i / COLUMNS)] .push (example);

let output = "";

output += `<table class="examples">\n`;

for (const row of table)
{
	output += `  <tr>\n`;

	for (const example of row)
	{
		let
			folder    = path .dirname (example),
			basename  = path .basename (folder),
			component = path .basename (path .dirname (folder));

		folder = folder .replace (new RegExp (`${cwd}/docs/`), "");

		output += `    <td>\n`;
		output += `      <a href="https://create3000.github.io/media/${folder}/${basename}.x3d" title="${component} » ${basename}" componentName="${component}" typeName="${basename}">`;
		output += `<img src="https://create3000.github.io/media/${folder}/screenshot-small.png" alt="${basename}"/>`;
		output += `</a>\n`;
		output += `    </td>\n`;
	}

	output += `  </tr>\n`;
}

output += `</table>\n`;

// Wiki

let index = sh`cat '${cwd}/../x_ite/docs/_posts/getting-started.md'`;
index = index .replace (/<table class="examples">.*?<\/table>\n/sg, output);

fs .writeFileSync (`${cwd}/../x_ite/docs/_posts/getting-started.md`, index);
