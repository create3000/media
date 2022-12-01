#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

$COLUMNS = 7;

$cwd      = cwd ();
$examples = "$cwd/docs/examples";
@examples = ();
@table    = ();

push @examples, sort `find $examples/X3D -type f -name 'example.html'`;
push @examples, sort grep !m|/X3D/|, `find $examples -type f -name 'example.html'`;

for ($i = 0; $i < @examples; ++ $i)
{
	$column = int ($i / $COLUMNS);

	$table [$column] = [ ] if ! exists $table [$column];

	push @{$table [$column]}, $examples [$i];
}

$output = "";

$output .= "<table class=\"examples\">\n";

foreach $row (@table)
{
	$output .= "  <tr>\n";

	foreach $example (@$row)
	{
		chomp $example;

		$folder    = dirname $example;
		$basename  = basename $folder;
		$component = basename dirname $folder;

		$folder =~ s|$cwd/docs/||;

		$output .= "    <td>\n";
		$output .= "      <a href=\"https://create3000.github.io/media/$folder/$basename.x3d\" title=\"$component » $basename\">\n";
		$output .= "        <img src=\"https://create3000.github.io/media/$folder/screenshot-small.png\" alt=\"$basename\"/>\n";
		$output .= "      </a>\n";
		$output .= "    </td>\n";
	}

	$output .= "  </tr>\n";
}

$output .= "</table>\n";

# Wiki

chdir "$cwd/../x_ite/docs/_posts";
$index = `cat getting-started.md`;
$index =~ s|<table class="examples">.*?</table>\n|$output|sgo;

open INDEX, ">", "getting-started.md";
print INDEX $index;
close INDEX;
