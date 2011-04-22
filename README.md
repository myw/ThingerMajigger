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
If you want to try it out, put the project directory  onto some server (or your
Dropbox), and replace the `Database.xml` file in there with your own
`Database.xml` file. Then make a hard link (`ln`, but without `-s`) back to its
original place (in `~/Library/Application Support/Cultured Code/Things/`).
Right now, the code does not change anything in the file, so it's completely
safe. This will probably change as development continues.

This is currently in an incredibly alpha phase. If it doesn't work for you, let
me know: I'm keen on improving it, as it's currently the result of literally
only a few hours of work.

I hope to add the ability to do more than just observe soon.

### MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

