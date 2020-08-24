#!/usr/bin/perl

use v5.10.0;
use open qw/:std :utf8/;

use File::Basename qw(basename dirname);
use Cwd;

print "hello\n";

$cwd = cwd ();
say $cwd;

while (<"$cwd/docs/tutorials/scenes/*/*.x3dv">)
{
    $base = basename $_, ".x3dv";

    say $base;

    $html = `cat example.html`;
    $html =~s/BASE/$base/sgo;
    $html =~s/FILE_NAME/$base.x3dv/sgo;

    open FILE, ">", "$cwd/docs/tutorials/scenes/$base/example.html";
    print FILE $html;
    close FILE;
}
