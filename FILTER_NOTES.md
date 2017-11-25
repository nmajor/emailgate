// https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
// https://github.com/kig/canvasfilters
// http://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/

// https://stackoverflow.com/questions/726549/algorithm-for-additive-color-mixing-for-rgb-values
// http://mashable.com/2013/10/20/photoshop-instagram-filters/#m9VYuCVBmPq3
// http://photodoto.com/instagram-filters-tutorial-amaro-mayfair/

// https://softwareengineering.stackexchange.com/questions/336794/algorithms-for-color-blending-modes-hue-saturation-color-luminosity
// https://dev.w3.org/SVG/modules/compositing/master/
// src-over: https://stackoverflow.com/questions/7438263/alpha-compositing-algorithm-blend-modes

// Sc  - The source element color value.
// Sa  - The source element alpha value.
// Dc  - The canvas color value prior to compositing.
// Da  - The canvas alpha value prior to compositing.
// Dc' - The canvas color value post compositing.
// Da' - The canvas alpha value post compositing.
//

// src-over
// f(Sc,Dc) = Sc
// X        = 1
// Y        = 1
// Z        = 1
//
// Dca' = Sca × Da + Sca × (1 - Da) + Dca × (1 - Sa)
//      = Sca + Dca × (1 - Sa)
// Da'  = Sa × Da + Sa × (1 - Da) + Da × (1 - Sa)
//      = Sa + Da - Sa × Da

// dst-over
// f(Sc,Dc) = Dc
// X        = 1
// Y        = 1
// Z        = 1
//
// Dca' = Dca × Sa + Sca × (1 - Da) + Dca × (1 - Sa)
//      = Dca + Sca × (1 - Da)
// Da'  = Da × Sa + Sa × (1 - Da) + Da × (1 - Sa)
//      = Sa + Da - Sa × Da


// Vignette Notes
// http://forums.codeguru.com/showthread.php?452138-radial-gradient
// https://bsou.io/posts/color-gradients-with-python
// https://stackoverflow.com/questions/22607043/color-gradient-algorithm

// Hue Saturation
// https://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation
// https://gist.github.com/mjackson/5311256
