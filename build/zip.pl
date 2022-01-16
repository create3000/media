#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

$cwd      = cwd ();
$examples = "$cwd/docs/examples";

sub zip {
   $folder = shift;
   chomp $folder;

   $base = basename $folder;

   say $base;

   chdir dirname $folder;
   system "zip '$base.zip' '$base/' -r -x '*$base.O.x3d' -x '*$base.zip' -x 'screenshot-small.png'";
   system "mv '$base.zip' '$base/'";
}

zip $_ foreach sort `find $examples -maxdepth 2 -mindepth 2 -type d`;
