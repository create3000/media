#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use Cwd;
use File::Basename qw(basename dirname);
use List::MoreUtils qw(any);
use Getopt::Long;

$cwd      = cwd ();
$examples = "$cwd/docs/examples";

sub image {
   $folder = shift;
   chomp $folder;

   $base = basename $folder;

   say $base;

   chdir $folder;
   system "npx", "--yes", "x3d-image", @extra, "-s", "1000x562", "-i", "$base.x3d", "-o", "screenshot.png";
   system "convert", "-resize", "110x62", "screenshot.png", "screenshot-small.png";
}

@extra = ();
$delay = 0;
GetOptions ("delay=i" => \$delay);
push @extra, "-d", $delay;

@files = sort `find $examples -maxdepth 2 -mindepth 2 -type d`;
@files = grep { $s = $_; any { index ($s, $_) != -1 } @ARGV } @files if @ARGV;

image $_ foreach @files;
