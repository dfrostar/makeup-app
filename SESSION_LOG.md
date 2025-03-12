# Beauty Directory Platform - Session Log

## Session: March 12, 2025 - Project Direction & Strategy

### Participants
- Project Team
- Development Team (3 developers)

### Key Decisions

1. **Platform Vision**
   - Confirmed the platform will be a comprehensive beauty directory with curated content
   - Task management will be one integrated feature rather than the core focus
   - Modern features prioritized: real-time updates, PWA capabilities, content velocity metrics, community features

2. **Technical Architecture**
   - Will implement as a subdomain integration with existing Squarespace site (cheval-volant.com)
   - Selected React/Next.js frontend with Supabase backend for cost-effectiveness
   - Will use Vercel for deployment with serverless functions
   - Prioritizing mobile-first responsive design

3. **Content Strategy**
   - Will focus on a mix of curated and aggregated content
   - Identified 20 key beauty influencers to feature initially, including:
     - Huda Kattan (Huda Beauty)
     - James Charles
     - Hyram Yarbro
     - Jackie Aina
     - Dr. Dray (Dr. Whitney Bowe)
     - Lisa Eldridge
     - etc.
   - Prioritized YouTube integration (using existing Google API access)
   - Content will be categorized by specialty (makeup, skincare, haircare)
   - Will implement content tagging for personalization (skin type, concerns, etc.)

4. **Design Direction**
   - Clean, minimalist aesthetic with white space-focused layout
   - Subtle color palette with 1-2 accent colors
   - Sans-serif typography for readability
   - Card-based layouts for creator profiles and content discovery
   - Advanced filtering system by specialty, skin type, content type, etc.

5. **User Personalization**
   - Mid-level personalization approach with 5-7 question initial quiz
   - Quiz to collect information on:
     - Skin Type: Dry, Oily, Combination, Sensitive, Normal
     - Primary Concerns: Acne, Anti-aging, Hyperpigmentation, Texture, Redness
     - Makeup Style Preference: Natural, Glamorous, Creative, Professional
     - Hair Type: Straight, Wavy, Curly, Coily
     - Content Preference: Quick Tips, Detailed Tutorials, Product Reviews
     - Expertise Level: Beginner, Intermediate, Advanced
   - Will track content interactions to refine recommendations over time

6. **Implementation Timeline**
   - 6-week phased development plan established:
     - Weeks 1-2: Technical setup and content foundation
     - Weeks 3-4: Core user experience and personalization
     - Weeks 5-6: Final features and launch preparation

### Decisions on Outstanding Questions

1. **Content Sourcing Strategy**:
   - No existing influencer relationships, will implement a mix of approaches:
   - YouTube-first approach using existing Google API access
   - Content embedding for Instagram/TikTok (no API needed)
   - Manual curation system for team

2. **Development Resources**:
   - Confirmed 3 developers available for the project
   - Defined roles: Frontend, Backend, and Full-stack

3. **Squarespace Integration**:
   - Will use subdomain approach (app.cheval-volant.com)
   - Match branding and design elements from main site

4. **API Usage**:
   - Confirmed Google/YouTube API access only
   - Will prioritize this platform for initial content

5. **Content Categories**:
   - Initial focus on skincare, makeup, and hair care
   - Personalization based on user's specific situation
   - Content tagging system for detailed categorization

### Next Steps

1. **Technical Integration Setup (Week 1)**
   - Set up Squarespace subdomain (app.cheval-volant.com) pointing to Vercel
   - Initialize Next.js project with TypeScript and Supabase integration
   - Establish visual design system matching Squarespace site aesthetics
   - Create initial database schemas for creators and content

2. **Content Foundation (Weeks 1-2)**
   - Implement YouTube API integration for initial 20 beauty influencers
   - Create creator profile database and content categorization system
   - Build content card components and grid layout with filtering
   - Develop admin interface for content curation and tagging

### Technical Specifications

1. **Content Data Model (TypeScript)**
   ```typescript
   // Core content types
   type ContentSource = 'youtube' | 'instagram' | 'tiktok' | 'original';
   type ContentType = 'video' | 'image' | 'article' | 'tutorial';
   type BeautyCategory = 'skincare' | 'makeup' | 'haircare' | 'nails' | 'fragrance';
   type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
   type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
   
   interface BeautyContent {
     id: string;
     title: string;
     description: string;
     source: ContentSource;
     contentType: ContentType;
     mediaUrl: string;
     thumbnailUrl: string;
     category: BeautyCategory[];
     tags: string[];
     metadata: {
       author: string;
       authorUrl?: string;
       publishDate: Date;
       viewCount?: number;
     };
     relevantProducts?: string[];
     skinTypes?: SkinType[];
     hairTypes?: HairType[];
     // Additional fields...
   }
   ```

2. **Creator Profile Model**
   ```typescript
   interface Creator {
     id: string;
     name: string;
     platforms: {
       youtube?: string;
       instagram?: string;
       tiktok?: string;
       website?: string;
     };
     specialty: string[];
     expertise: "beginner" | "intermediate" | "professional";
     skinToneExpertise: string[];
     signature: string;
     bio: string;
     featuredContent: string[]; // Content IDs
     tags: string[];
   }
   ```

3. **Initial Design Theme**
   ```typescript
   const theme = {
     colors: {
       primary: '#f8f0eb',  // Soft peach
       secondary: '#de9e94', // Muted rose
       accent: '#c45d4c',   // Terra cotta
       text: '#414042',     // Charcoal
       background: '#ffffff'
     },
     fonts: {
       body: '"Montserrat", sans-serif',
       heading: '"Cormorant Garamond", serif'
     }
   }
   ```

### Action Items

1. **For Development Team**
   - Set up project repository and technical foundation
   - Design database schema for content and creators
   - Create initial wireframes for content discovery UI

2. **For Content Team**
   - Begin compiling information on the 20 priority beauty influencers
   - Start drafting content categorization system
   - Define tagging taxonomy for content personalization

3. **For Design Team**
   - Create initial design system based on minimalist aesthetic
   - Design core UI components (cards, filters, navigation)
   - Ensure consistency with Squarespace site branding

### Next Meeting
- Review technical foundation and initial wireframes in 1 week
- Evaluate content organization strategy and taxonomy
- Begin discussion on personalization algorithm 