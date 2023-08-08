
zip:
	build/zip.pl

html:
	build/html.pl

table:
	build/table.pl

files:
	build/files.pl

publish:
	git checkout main
	git merge development
	git push origin
	git checkout development
