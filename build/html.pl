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

   say $base;

   $x3d = "x3dv" if -f "$folder/$base.x3dv";
   $x3d = "x3d"  if -f "$folder/$base.x3d";

   $html = `cat $cwd/example-template.html`;
   $html =~ s/BASE/$base/sgo;
   $html =~ s/FILE_NAME/$base.$x3d/sgo;

   open FILE, ">", "$folder/example.html";
   print FILE $html;
   close FILE;
}

example $_ foreach sort `find $examples -maxdepth 2 -mindepth 2 -type d`;
