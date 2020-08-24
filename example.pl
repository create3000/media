#!/usr/bin/perl

use v5.10.0;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

system "pwd";

sub example {
    $filename = shift;
    print $filename;
    chomp $filename;

    say $filename;
    return;

    # example.html

    $file = `cat '$filename'`;

    $filename =~ s|$o|$n|;

    open FILE, ">", $filename;
    print FILE $file;
    close FILE;

    # zip

    $p = dirname $filename;
    $d = basename $p;
    $p = dirname $p;

    chdir "$p";
    system "zip '$d.zip' '$d/' -r -x '*$d.O.x3d' -x '*$d.zip' -x 'screenshot-small.png'";
    system "mv '$d.zip' '$d/'";
}

$docs = "/Volumes/Home/Projekte/media/docs/";
$cwd  = cwd ();

example $_ foreach `find $docs -type f -name 'example.html'`;
