#!/usr/bin/perl

use v5.10.0;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

system "pwd";

sub example {
    $filename = shift;
    chomp $filename;

    $folder = dirname $filename;
    $base   = basename dirname $filename;

    say $base;
 
    # example.html

    $x3d = "x3dv" if -f "$folder/$base.x3dv"; 
    $x3d = "x3d"  if -f "$folder/$base.x3d";

    $html = `cat $cwd/example.html`;
    $html =~ s/BASE/$base/sgo;
    $html =~ s/FILE_NAME/$base.$x3d/sgo;

    open FILE, ">", "$folder/example.html";
    print FILE $html;
    close FILE;

    # zip

    chdir dirname $folder;
    system "zip '$base.zip' '$base/' -r -x '*$base.O.x3d' -x '*$base.zip' -x 'screenshot-small.png'";
    system "mv '$base.zip' '$base/'";
}

$cwd  = cwd ();
$docs = "$cwd/docs/";

example $_ foreach `find $docs -type f -name 'example.html'`;
