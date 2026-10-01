# Icons & images rules

Moved verbatim from CLAUDE.md: Icons8-only policy, icon metaphors, ImageKit image policy, business photo sourcing.

## Icons style
We use Apple SF Symbols Regular style from Icons8. When on a light colored background, we use the dark version of the color, for example when the background is pink, the icon is red or dark red. 

Icons are 24x24 by default. 

### Only genuine Icons8 please

**IMPORTANT**: All icons must be sourced through Icons8 MCP (Model Context Protocol). No icons should be used without going through the Icons8 MCP system. This ensures consistency and proper licensing. 

We use icons in the SVG format wherever possible, stored in `/public/icons/icons8/`. Be VERY careful to don't:
☠️ Draw your own icons
☠️ Use Lucida and think they are Icons8 (Icons8 is better made and much more diverse)
☠️ Store third party icons from points 1-2 in the icons8 folder and think it's Icons8.

### Metaphors
Some of the icon metaphors:
- Baños de Lujo — plumbing (not bathtub, as we don't have it, and not a palm tree)
- Aislamiento Acústico — no sound (crossed speaker)
- Windsurfing — wind (not sailboat)
- Calisthenics — Pull up bar
- Gimnasio — dumbbell (gym/fitness equipment)
- Horse Riding — horse
- Tennis — tennis ball
- Laptop/Work — laptop computer (remote work)
- Meat/Parrilla — steak

## Image Policy
We use the imagekit for scaling down the images to the visible size. 

The endpoint is: https://ik.imagekit.io/icons8/ilbuco/
Therefore, if we want to scale down https://ilbuco.com.ar/gallery/hero-villa-exterior.jpeg, we use the following URL: https://ik.imagekit.io/icons8/ilbuco/gallery/hero-villa-exterior.jpeg?tr=w-400,h-300

## Images for businesses
NEVER use stock images, images from other websites, or AI-generated images for business listings. Always use real photos of the business, ideally from:

Google Images, Bing Images and similar - look for images, not webpages. If you get a link to the image, use it. If it's a webpage, don't bother parsing it and finding images.

Don't use images from social media: they tend to be random (not only how the business looks, but also ads, related content, etc.). Also they are protected from scraping.
