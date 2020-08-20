
print "hello\n";
system "pwd";

sub example {
    $filename = shift;
    print $filename;
    chomp $filename;

    $file = `cat '$filename'`;



    return;

    open FILE, ">", $filename;
    print FILE $filename;
    close FILE;
}

$cwd = `pwd`;
chomp $cwd;
example $_ foreach `find $cwd -type f -name 'example.html'`;
