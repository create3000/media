#!/usr/bin/perl

use v5.10.0;
use utf8;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;
use threads;
use Thread::Semaphore;

$cwd       = cwd ();
$examples  = "$cwd/docs/examples";
$semaphore = new Thread::Semaphore (8);
@threads   = ();

sub add {
   $function = shift;
   $semaphore -> down ();
   push @threads, async {
      $function -> ();
      $semaphore -> up ();
   };
}

sub example {
   $folder = shift;
   chomp $folder;

   $base = basename $folder;
   $orig = "$folder/$base.O.x3d";
   $x3d  = "$folder/$base.x3d";
   $x3dv = "$folder/$base.x3dv";
   $x3dj = "$folder/$base.x3dj";

   say $base;

   add sub { system "npx ../x3d-tidy            -r -m -i '$orig' -o '$x3d'  2>/dev/null" };
   add sub { system "npx ../x3d-tidy -s COMPACT -r -m -i '$orig' -o '$x3dv' 2>/dev/null" };
   add sub { system "npx ../x3d-tidy -s COMPACT -r -m -i '$orig' -o '$x3dj' 2>/dev/null" };
}

example $_ foreach sort `find $examples -maxdepth 2 -mindepth 2 -type d`;

$_ -> join () foreach @threads;