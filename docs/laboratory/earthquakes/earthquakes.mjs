// https://earthquake.usgs.gov/earthquakes/feed/v1.0/atom.php

$("x3d-canvas") .on ("load", init);
$("#time") .on ("change", selectTime);

function init ()
{
	console .log ("init");
	selectTime ();
}

function selectTime ()
{
	loadData (parseInt (jQuery ("#time") .val ()));
}

function loadData (index)
{
	var urls = [
		"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom",
		"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.atom",
		"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.atom",
		"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.atom",
	];

	var
		Browser = X3D .getBrowser (),
		loading = Browser .currentScene .getNamedNode ("LoadingSwitch");

	loading .whichChoice = 1;

	jQuery .ajax ({
		type: "GET",
		url: urls [index],
		dataType: "xml",
		success: function (xml)
		{
			parseAtom (xml);
			loading .whichChoice = 0;
		},
	});
}

function parseAtom (xml)
{
	console .log ("parseAtom");

	for (var i = 0, length = xml .childNodes .length; i < length; ++ i)
		generatePoints (parseFeed (xml .childNodes [i]));
}

function parseFeed (xml)
{
	var earthquakes = [ ];

	for (var i = 0, length = xml .childNodes .length; i < length; ++ i)
	{
		var earthquake = parseEntry (xml .childNodes [i]);

		if (earthquake)
			earthquakes .push (earthquake);
	}

	return earthquakes;
}

function parseEntry (xml)
{
	if (xml .nodeName !== "entry")
		return;

	var earthquake = { }

	for (var i = 0, length = xml .childNodes .length; i < length; ++ i)
	{
		var childNode = xml .childNodes [i];

		switch (childNode .nodeName)
		{
			case "title":
			{
				var match = childNode .innerHTML .match (/^M\s+([\d\.]+)\s+-\s+(.*?)$/);

				if (! match)
					break;

				earthquake .magnitude = parseFloat (match [1]);
				earthquake .location  = match [2];
				break;
			}
			case "georss:point":
			{
				var point = childNode .innerHTML .split (" ");

				earthquake .point = [
					parseFloat (point [0]),
					parseFloat (point [1]),
				];

				break;
			}
		}
	}

	if (earthquake .magnitude === undefined)
		return;

	return earthquake;
}

function generatePoints (earthquakes)
{
	var
		Browser = X3D .getBrowser (),
		coord   = Browser .currentScene .getNamedNode ("EarthQuakesCoord"),
		color   = Browser .currentScene .getNamedNode ("EarthQuakesColor"),
		red     = new X3D .SFColor (1, 0, 0),
		yellow  = new X3D .SFColor (1, 1, 0);

	earthquakes .sort (function (lhs, rhs)
	{
		if (lhs .magnitude < rhs .magnitude)
			return 1;

		if (lhs .magnitude > rhs .magnitude)
			return -1;

		return 0;
	});

	coord .point .length = 0;
	color .color .length = 0;

	earthquakes .forEach (function (earthquake)
	{
		var m = earthquake .magnitude / 10;

		coord .point .push (new X3D .SFVec3d (earthquake .point [0], earthquake .point [1], 100000 + 1000000 * m));
		color .color .push (yellow .lerp (red, m));
	});

	var locations = jQuery (".locations") .empty ();

	var list = jQuery ("<ul></ul>")
		.addClass ("link-list")
		.css ({"overflow": "scroll", "height": "250px"})
		.appendTo (locations);

	earthquakes .forEach (function (earthquake)
	{
		list .append (jQuery ("<li></li>")
			.append (jQuery ("<a></a>")
				.css ({ "cursor": "pointer" })
				.text (earthquake .magnitude .toFixed (1) + " - " + earthquake .location)
				.click (selectEarthQuake .bind (null, earthquake))));
	});

	selectEarthQuake (earthquakes [0])
}

function selectEarthQuake (earthquake)
{
	// Red point

	var
		Browser = X3D .getBrowser (),
		coord   = Browser .currentScene .getNamedNode ("EarthQuakeCoord"),
		timer   = Browser .currentScene .getNamedNode ("EarthQuakeAnimationTimer"),
		m       = earthquake .magnitude / 10,
		now     = Date .now () / 1000;

	coord .point [0] = new X3D .SFVec3d (earthquake .point [0], earthquake .point [1], 100000 + 1000000 * m);

	timer .stopTime  = now;
	timer .startTime = now;

	// Viewpoint

	var
		timer        = Browser .currentScene .getNamedNode ("ViewpointAnimationTimer"),
		interpolator = Browser .currentScene .getNamedNode ("ViewpointPositionInterpolator");

	Browser .changeViewpoint ("Viewpoint");

	interpolator .keyValue [0]    = interpolator .geovalue_changed;
	interpolator .keyValue [1] .x = earthquake .point [0];
	interpolator .keyValue [1] .y = earthquake .point [1];

	timer .stopTime  = now;
	timer .startTime = now;
}
