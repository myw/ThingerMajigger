ThingerMajigger
===============

_An easy way to view your Things database when you're away_

Copyright 2011, Mikhail Wolfson

### Things

[Things][0] is a great GTD to-do list app for the Mac. Unfortunately, some of
us lack iPhones, but still want to have a nice interface to their Things
database (which holds all of the necessary information) remotely.

[0]: http://culturedcode.com/things/

### Usage
If you want to try it out, first find an appropriately accessible location for
your Things folder (`~/Library/Application Support/Cultured Code/Things/`), for
example your Dropbox, or the folder that corresponds some local server on your
machine. Quit Things, move your Things folder there, and make a symbolic link
from the new location of the Things folder to its original location. Finally,
`git clone` (or just copy) your repo of ThingerMajigger into a _first-level
subdirectory_ of that folder. Name that folder something useful, like `html`.

An example may look something like this:

	#  Things folder                                       Accessible location
	mv ~/Library/Application\ Support/Cultured\ Code/Things ~/Public
	ln -s ~/Public/Things ~/Library/Application\ Support/Cultured\ Code/Things
	cd ~/Public/Things
	git clone ~/Projects/ThingerMajigger ./html

The code knows to look for the `Database.xml` file in the directory above it and does not change anything in the file, so it's completely safe. 

This is currently in an incredibly alpha phase. If it doesn't work for you, let
me know: I'm keen on improving it, as at this point, it's the result of literally
only a few hours of work.

I hope to add the ability to do more than just observe soon, but this will
likely increase the dependencies severely, since plain old browser JavaScript
does not let you write to the filesystem.

### Requirements
This project currently uses jQuery 1.5.2 and the meyerweb.com CSS reset, both
included. It should work on any browser and require no server-side integration.
Just open the `index.html` page up in a browser, and your things database should
be visible.

As Cultured Code has told me, Things will eventually move to an SQLite database,
which will require a WebKit-based browser (or maybe Google Gears) to read.

### MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

