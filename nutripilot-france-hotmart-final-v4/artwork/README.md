# Module artwork

Six existing digitally generated WebP images were recovered from the owner's NutriPilot V18.2.0 image-review package and checked against the module names before integration. They illustrate nutrition, recipes, training, scanner, menopause wellbeing and sleep. They are illustrative images, not screenshots, medical evidence or endorsements by the depicted people.

Nine original local SVG illustrations provide the remaining module visuals and reusable vector assets. Current module tiles select the six photographs where available and the SVG for nutrients, supplements and coach. The SVGs contain no external references or executable scripts. All image requests stay on the application's origin.

Artwork is decorative: the app button supplies its localized accessible name, and images have empty alt text with a hidden decorative wrapper. CSS reserves tile geometry and image loading is deferred. The browser acceptance checks load every active image and open a module before visiting Plans.
