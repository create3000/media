#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

$cwd      = cwd ();
$examples = "$cwd/docs/examples";

sub example {
   $folder = shift;
   chomp $folder;

   $base = basename $folder;
   $orig = "$folder/$base.O.x3d";
   $x3d  = "$folder/$base.x3d";
   $x3dv = "$folder/$base.x3dv";
   $x3dj = "$folder/$base.x3dj";

   system "npx", "../x3d-tidy", "-s", "COMPACT", "-f", "-m", "-i", $orig, "-o", $x3d;
   system "npx", "../x3d-tidy", "-s", "COMPACT", "-f", "-m", "-i", $orig, "-o", $x3dv;
   system "npx", "../x3d-tidy", "-s", "COMPACT", "-f", "-m", "-i", $orig, "-o", $x3dj;

   exit;
}

example $_ foreach sort `find $examples -maxdepth 2 -mindepth 2 -type d`;
