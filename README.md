# Beauty Task Manager

An intelligent beauty task management system for organizing beauty routines, appointments, and product testing schedules. Perfect for makeup enthusiasts, beauty professionals, and anyone looking to maintain a consistent beauty regimen.

## Features

- 🧠 **AI-Powered Task Detection**: Automatically detect and create beauty tasks from natural language
- 💬 **Chat Interface**: Interact with the system through a conversational UI
- 🔄 **Real-Time Updates**: Tasks update in real-time across devices
- 🔒 **User Authentication**: Secure login with Google OAuth
- 📱 **Mobile-Friendly**: Responsive design works on all devices
- ✨ **Beauty Categories**: Organize tasks by specific beauty categories (Skincare, Makeup, etc.)
- 💾 **Persistent Storage**: Tasks remain saved even after server restarts
- 🌈 **Visual Organization**: Color-coded categories and priorities for easy visual scanning

## Tech Stack

- **Frontend**: Next.js with TypeScript, React
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Data Storage**: File-based JSON storage (with database integration planned)
- **Authentication**: OAuth (Google)
- **AI Processing**: Rule-based NLP with plans for LLM integration

## Beauty-Specific Categories

The system organizes tasks into beauty-specific categories:

- **Skincare**: Routines, treatments, and product testing
- **Makeup**: Application techniques, trends, and product testing
- **Haircare**: Treatments, styling, and maintenance
- **Nailcare**: Manicures, pedicures, and treatments
- **Fragrance**: Testing and collection management
- **Appointments**: Salon, spa, and professional services
- **Shopping**: Product purchases and wishlist management
- **Wellness**: Beauty-related wellness activities
- **Other**: Miscellaneous beauty tasks

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/beauty-task-manager.git
   cd beauty-task-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3333](http://localhost:3333) in your browser

## Project Structure

- `/app` - Next.js app directory
  - `/api` - API routes for task management
  - `/components` - React components including beauty-specific UI
  - `/hooks` - Custom React hooks for task management
  - `/lib` - Utility libraries and store
  - `/types` - TypeScript type definitions including beauty categories

## Recent Enhancements

- ✅ **Beauty Task Categories**: Added dedicated categories for all beauty-related activities
- ✅ **Persistent Storage**: Implemented file-based storage to save tasks between sessions
- ✅ **Enhanced Date Handling**: Improved validation and processing of due dates
- ✅ **Visual Category Tags**: Color-coded category tags for easier task organization
- ✅ **Category Filtering**: Added ability to filter tasks by beauty category

## Upcoming Features

- [ ] Product Database Integration: Associate tasks with specific beauty products
- [ ] Routine Builder: Create and manage scheduled beauty routines
- [ ] AI-Powered Beauty Recommendations: Get personalized beauty task suggestions
- [ ] Seasonal Beauty Planning: Tools for planning seasonal beauty changes
- [ ] Beauty Professional Integration: Connect with beauty professionals for appointments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
