WINK

Wink Toolkit is a lightweight JavaScript toolkit which will help you build great 
mobile web apps. It is designed and developed to meet the specific constraints 
of the mobile environment.

Components
----------

View the index.html file to have an overview of the various components included in Wink.


Build
-----

In the "utils/build folder", you will find utilities to optimize WINK.
The "build_wink_core" target of the "build.xml" file, will build
the core of the kit. It will create a "wink" folder in the "utils/build" directory
and build the "wink.min.js" file (the concatenated and optimized core) that you should
use in your project.

The core is composed of:

- _amd
- _base/_kernel
- _base/_base
- _base/error
- _base/json
- _base/topics
- _base/ua
- _base/_feat
- _base/_feat/featjson
- _base/_feat/featcss
- _base/_feat/featevent
- _base/_feat/featdom
- fx/_xy
- net/xhr
- math/_basics
- ui/xy/layer
- ux/touch
- ux/event

If you want to build your own version of wink and add some more components,
you should first modify the "profiles.json" file to fit your needs and then just
run the default target of the build ("called "build_wink")

Builder
-------

You will also find a build utility in the utils/builder folder. It's a graphical web interface
where you can pick and choose the modules you want to build. The builder will generate the minified JS
and CSS files for you and give you the choice between downloading them as a ZIP file or 
retrieve them via a local address.

The builder generates a build url that you can also use to always work with a minifed version 
while under development.


Documentation
-------------

The documentation can be generated from the source code using JSDoc. A specific
wink template and configuration file are available in the utils/doc folder. Have
a look at the README file at the root of the utils/doc folder if you want to
generate the documentation


Utilities
---------

In the "utils" folder, you will also find a utility to base64 encode images.


Licence
-------

The WINK project is released under the "Simplified BSD license". See the 
"licence.txt" file for more details.