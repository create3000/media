
print "hello\n";
system "pwd";

sub example {
    $filename = shift;
    print $filename;
    chomp $filename;

    $file = `cat '$filename'`;

    $file =~ s|http://code\.create3000\.de/x_ite/latest/dist/x_ite\.css|https://create3000.github.io/code/x_ite/latest/dist/x_ite.css|sgo;
    $file =~ s|http://code\.create3000\.de/x_ite/latest/dist/x_ite\.min/.js|https://create3000.github.io/code/x_ite/latest/dist/x_ite.min.js|sgo;
    $file =~ s|http://create3000\.de/x_ite/|https://github.com/create3000/x_ite/wiki|sgo;
    $file =~ s| target="_blank"||sgo;

    $filename =~ s|$o|$n|;

    open FILE, ">", $filename;
    print FILE $file;
    close FILE;
}

$o = "/Volumes/Home/Projekte/create3000.de/media/htdocs/components/";
$n = "/Volumes/Home/Projekte/media/docs/examples/";

$cwd = `pwd`;
chomp $cwd;
example $_ foreach `find $o -type f -name 'example.html'`;
