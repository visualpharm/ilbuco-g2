# Places & business card rules

Moved verbatim from CLAUDE.md: business info via Google Maps API, golden-standard business card design.

# Business info
How to present the businesses and places:
1. Use google maps api to get the raging, # of reviews, distance from Il Buco, all reviews it allows to get. For google maps api, use the key from the environment variable `GOOGLE_MAPS_API_KEY`.
2. Present the business in a card with the following information:
   - Name
  -  Description based on the reviews. Think jobs to be done style, what kind of jobs does this business does for its customers?
   - Rating
   - Number of reviews
   - Distance from Il Buco: walking with the icon of a walking person, and driving with the icon of a car
   - Link to the business profile in Google Maps - do no-follow

## Golden Standard Business Card Design

**This is the perfect format for business cards - use this exact structure for all business listings:**

### Layout Structure:
```
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
  
  {/* Header: Name + Rating */}
  <div className="flex items-start justify-between mb-3">
    <h5 className="text-xl font-bold text-gray-800">[Business Name]</h5>
    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
      ⭐ [Rating] ([Number] reseñas)
    </div>
  </div>
  
  {/* Description: Jobs-to-be-done style */}
  <p className="text-gray-700 text-sm mb-4">
    <strong>Para:</strong> [What job this business does for customers]
  </p>
  
  {/* Distance from Il Buco */}
  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
    <span className="font-medium">Distancia desde Il Buco:</span>
    <div className="flex items-center gap-1">
      <User className="h-4 w-4" />  {/* Walking icon */}
      <span>[X] min</span>
    </div>
    <div className="flex items-center gap-1">
      <Car className="h-4 w-4" />   {/* Driving icon */}
      <span>[Y] min</span>
    </div>
  </div>
  
  {/* Google Maps Link */}
  <a
    href="[Google Maps URL]"
    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
    target="_blank"
    rel="nofollow noopener noreferrer"
  >
    <MapPin className="h-4 w-4" />
    Ver perfil en Google Maps
  </a>
</div>
```

### Design Requirements:
- **White background** with subtle shadow and border
- **Rounded corners** (xl = 12px)
- **Hover effect** with increased shadow and smooth transition
- **6px padding** on all sides
- **Proper spacing** between elements (mb-3, mb-4)
- **Color scheme**: Gray text hierarchy, blue links, yellow rating badge

### Content Requirements:
- **Name**: Bold, xl text size, dark gray
- **Rating**: Yellow badge with star + number + "(X reseñas)"
- **Description**: Start with "Para:" followed by customer job
- **Distance**: "Distancia desde Il Buco:" with walking/driving times
- **Link**: "Ver perfil en Google Maps" with MapPin icon
- **NO addresses** - only the essential information

### Grid Layout:
- Use `grid md:grid-cols-2` for 2 businesses
- Use `grid md:grid-cols-2 lg:grid-cols-3` for 3+ businesses 
- Add `gap-8` or `gap-6` for proper spacing
- Add `max-w-4xl mx-auto` for 2 cards, `max-w-6xl mx-auto` for 3+ cards

**This format provides:**
✅ Perfect visual hierarchy
✅ All essential information without clutter
✅ Consistent, professional appearance
✅ Mobile-responsive design
✅ Clear call-to-action
✅ Jobs-to-be-done focused descriptions

## Google Maps API
Use the API key from the environment variable `GOOGLE_MAPS_API_KEY` to access the Google Maps API for fetching business details, ratings, reviews, and distances.

**REQUIREMENT**: Always extract Google Maps information using the API key when adding or updating business information. Never manually enter business details - always use the Google Maps API to get accurate, up-to-date information including:
- Business name
- Rating and review count
- Distance from Il Buco
- Business description based on reviews
- Opening hours
- Contact information
