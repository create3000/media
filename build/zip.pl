#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use Cwd;
use File::Basename qw(basename dirname);
use List::MoreUtils qw(any);

$cwd      = cwd ();
$examples = "$cwd/docs/examples";

sub zip {
   $folder = shift;
   chomp $folder;

   $base = basename $folder;

   say $base;

   chdir dirname $folder;
   system "zip", "$base.zip", "$base/", "-r", "-x", "*/$base.O.x3d", "-x", "*/$base.zip", "-x", "*/screenshot-small.png";
   system "mv", "$base.zip", "$base/";
}

@files = sort `find $examples -maxdepth 2 -mindepth 2 -type d`;
@files = grep { $s = $_; any { index ($s, $_) != -1 } @ARGV } @files if @ARGV;

zip $_ foreach @files;
