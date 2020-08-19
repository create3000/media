<?php
	header ("Access-Control-Allow-Origin: *");
	header ('Content-Type: model/x3d+vrml');

	echo "#X3D V3.3 utf8\n\n";

	echo "PROTO Data [
		inputOutput MFString files [ ]
	]
	{ }\n";

	echo "Data {\n";
	echo "  files [\n";

	$audio = scandir ("audio");

	foreach ($audio as $file)
	{
		if ($file [0] == '.')
			continue;
	
		echo "\"http://media.create3000.de/components/Sound/AudioClip/assets/audio/" . $file . "\"\n";
	}

	echo "  ]\n";
	echo "}\n";
?>

