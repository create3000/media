#!/usr/bin/perl

use v5.10.0;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

$COLUMNS = 8;

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

say "<table>";

foreach $row (@table)
{
	say "  <tr>";

	foreach $example (@$row)
	{
		chomp $example;

		$folder   = dirname $example;
		$basename = basename $folder;

		$folder =~ s|$cwd/docs/||;

		say "    <td>";#
		say "      <a href=\"https://create3000.github.io/media/$folder/example.html\" title=\"$basename\">";
		say "        <img src=\"https://create3000.github.io/media/$folder/screenshot-small.png\" alt=\"$basename\"/>";
		say "      </a>";
		say "    </td>";
	}

	say "  </tr>";
}

say "</table>";
