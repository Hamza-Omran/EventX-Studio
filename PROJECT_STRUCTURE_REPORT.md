# EventX Studio - Complete Project Structure Report

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Backend Structure](#backend-structure)
5. [Frontend Structure](#frontend-structure)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [Component Architecture](#component-architecture)
9. [File Structure Analysis](#file-structure-analysis)
10. [Key Features Implementation](#key-features-implementation)
11. [Performance Optimizations](#performance-optimizations)
12. [Security Implementation](#security-implementation)

---

## Project Overview

**EventX Studio** is a comprehensive full-stack web application for event management and ticketing. The system provides role-based access for administrators and users, featuring event creation, seat allocation, ticket booking with QR codes, analytics dashboards, and real-time messaging capabilities.

### Core Functionality
- **User Authentication**: JWT-based authentication with role separation
- **Event Management**: Complete CRUD operations for events
- **Seat Allocation**: Dynamic seat grid system with real-time booking
- **Ticket System**: QR code generation and ticket management
- **Analytics Dashboard**: Comprehensive reporting with charts and statistics
- **Messaging System**: Real-time communication between users
- **Responsive Design**: Mobile-first approach across all devices

---

## Technology Stack

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Handling**: Multer for image uploads
- **Environment Management**: dotenv

### Frontend Technologies
- **Framework**: React.js 19.1.1
- **Build Tool**: Vite
- **Styling**: CSS3 with responsive design, Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **Routing**: React Router DOM
- **HTTP Client**: Axios

---

## Project Architecture

### Architectural Pattern
- **Frontend**: Component-based React architecture with functional components
- **Backend**: RESTful API with Express.js following MVC pattern
- **Database**: Document-based MongoDB with structured schemas
- **Authentication**: Stateless JWT token-based authentication
- **File Storage**: Local file system with GUID-based naming

### Design Principles
- **Separation of Concerns**: Clear separation between frontend, backend, and database
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Performance Optimization**: Client-side calculations and API caching
- **Security**: Protected routes, input validation, and secure authentication
- **Scalability**: Modular architecture supporting future enhancements

---

## Backend Structure

### Root Directory Files

#### **server.js**
**Purpose**: Main application entry point and server configuration
**Key Functions**:
- Express server initialization
- Middleware configuration (CORS, cookie-parser, body parsing)
- Route mounting and API endpoint registration
- Database connection establishment
- Server startup and port binding
- Static file serving for uploaded images

#### **package.json**
**Purpose**: Node.js project configuration and dependencies
**Dependencies**:
- Production: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `cookie-parser`, `dotenv`, `uuid`
- Development: `nodemon` for hot reloading

### Configuration Directory (/config)

#### **db.js**
**Purpose**: MongoDB database connection management
**Key Functions**:
- MongoDB URI configuration using environment variables
- Connection establishment with error handling
- Database connection status logging
- Connection retry logic for production environments

#### **multer.js**
**Purpose**: File upload configuration for image handling
**Key Functions**:
- Memory storage configuration for temporary file handling
- Image-only file filtering (JPEG, PNG, GIF support)
- File size limitation (5MB maximum)
- Error handling for unsupported file types

### Controllers Directory (/controllers)

#### **adminController.js**
**Purpose**: Admin-specific business logic and operations
**Key Functions**:
- Admin registration with password hashing
- Admin login with JWT token generation
- Admin logout with cookie clearing
- Profile management and updates
- Admin-specific data retrieval

#### **eventController.js**
**Purpose**: Event management business logic
**Key Functions**:
- Event creation with image upload support
- Event retrieval with filtering capabilities
- Event updates including status management
- Event deletion with cascade operations
- Seat allocation management
- Event statistics calculation

#### **userController.js**
**Purpose**: User management and authentication logic
**Key Functions**:
- User registration with profile image support
- User login with JWT authentication
- Password hashing and verification
- Profile management and updates
- User data retrieval and filtering

### Middleware Directory (/middleware)

#### **authMiddleware.js**
**Purpose**: Authentication and authorization middleware
**Key Functions**:
- JWT token verification and validation
- Role-based access control (admin/user)
- Protected route enforcement
- Token expiration handling
- User context injection into requests

#### **admin.js**
**Purpose**: Admin-specific authorization middleware
**Key Functions**:
- Admin role verification
- Administrative privilege enforcement
- Admin-only route protection

#### **auth.js**
**Purpose**: General authentication middleware
**Key Functions**:
- Token presence validation
- User authentication status verification
- Request context preparation

### Models Directory (/models)

#### **BasePerson.js**
**Purpose**: Base schema for user and admin entities
**Key Fields**:
- `name`: Person's full name (required, trimmed)
- `email`: Unique email address with validation
- `password`: Hashed password for authentication
- `image`: Profile image path
- `createdAt/updatedAt`: Timestamp fields

#### **User.js**
**Purpose**: User-specific data model extending BasePerson
**Key Fields**:
- Inherits all BasePerson fields
- `age`: User's age (required, numeric validation)
- `gender`: Gender selection (Male/Female/Other)
- `location`: User's location/city
- `interests`: Array of user interests/preferences

#### **Admin.js**
**Purpose**: Administrator data model extending BasePerson
**Key Fields**:
- Inherits all BasePerson fields
- `role`: Fixed as 'admin' for identification
- Administrative privileges and permissions

#### **Event.js**
**Purpose**: Event data model with comprehensive event information
**Key Fields**:
- `name`: Event title (required, unique)
- `venue`: Event location
- `description`: Detailed event description
- `date`: Event date
- `startTime/endTime`: Event duration
- `ticketPrice`: Ticket cost (numeric)
- `seatAmount`: Total seats available
- `availableSeats`: Current available seats
- `status`: Event status (Active/Closed)
- `seatAllocation`: 2D array representing seat grid
- `image`: Event poster/image
- `popularity`: Event popularity rating
- `tags`: Event categorization tags
- `expectedAttendance`: Expected number of attendees

#### **Ticket.js**
**Purpose**: Ticket booking and management model
**Key Fields**:
- `user`: Reference to User who booked the ticket
- `event`: Reference to associated Event
- `booking`: Unique booking identifier
- `qrCode`: Generated QR code for ticket validation
- `status`: Ticket status (Booked/Used/Cancelled)
- `seatPosition`: Specific seat allocation
- Timestamp fields for booking tracking

#### **Message.js**
**Purpose**: Messaging system data model
**Key Fields**:
- `from`: Sender reference (User or Admin)
- `to`: Recipient reference (User or Admin)
- `msg`: Message content
- `createdAt`: Message timestamp
- Read/unread status tracking

### Routes Directory (/routes)

#### **authRoutes.js**
**Purpose**: General authentication endpoints
**Endpoints**:
- `POST /register`: User registration
- `POST /login`: User login
- `POST /logout`: User logout
- Authentication middleware integration

#### **userAuth.js**
**Purpose**: User-specific authentication routes
**Key Features**:
- Image upload support for registration
- User role enforcement
- Profile image handling with multer

#### **adminAuth.js**
**Purpose**: Administrator authentication routes
**Key Features**:
- Admin-only registration and login
- Enhanced security for administrative access
- Admin privilege validation

#### **eventRoutes.js**
**Purpose**: Event management API endpoints
**Endpoints**:
- `POST /`: Create new event (admin only)
- `GET /`: Retrieve events list (filtered access)
- `GET /:id`: Get specific event details
- `PUT /:id`: Update event (admin only)
- `DELETE /:id`: Delete event (admin only)

#### **bookingAndTicketRoutes.js**
**Purpose**: Ticket booking and management system
**Key Functions**:
- Seat reservation and booking
- QR code generation for tickets
- Ticket status management
- Booking cancellation and modifications
- Payment processing integration points

#### **analyticsRoutes.js**
**Purpose**: Analytics and reporting endpoints
**Key Features**:
- Overall platform analytics
- Event-specific insights
- User demographic analysis
- Revenue and booking statistics
- Performance metrics calculation

#### **analyticsRoutesNew.js**
**Purpose**: Optimized analytics endpoints
**Key Features**:
- Client-side calculation support
- Reduced server processing load
- Raw data provision for frontend processing
- Improved response times

#### **messageRoutes.js**
**Purpose**: Messaging system API
**Key Functions**:
- Message sending and receiving
- User discovery for messaging
- Conversation management
- Message history retrieval

#### **dashboardStatsRoutes.js**
**Purpose**: Dashboard statistics and metrics
**Key Functions**:
- Real-time dashboard data
- Summary statistics calculation
- Performance metrics
- Quick overview data provision

#### **optimizedRoutes.js**
**Purpose**: Performance-optimized API endpoints
**Key Features**:
- Reduced data transfer
- Selective field retrieval
- Cached responses
- Efficient database queries

#### **adminListRoutes.js**
**Purpose**: Admin-specific list and management endpoints
**Key Functions**:
- User and admin management
- Bulk operations support
- Administrative reporting
- System monitoring endpoints

### Utils Directory (/utils)

#### **generateToken.js**
**Purpose**: JWT token generation utility
**Key Functions**:
- Secure token creation with user ID and role
- Configurable expiration settings
- Token signing with secret key
- Issuer and audience validation

#### **imageUtils.js**
**Purpose**: Image processing and management utilities
**Key Functions**:
- GUID-based image naming for uniqueness
- Image file saving with proper extensions
- Image deletion and cleanup
- File system management
- Error handling for image operations

---

## Frontend Structure

### Root Directory Files

#### **index.html**
**Purpose**: Main HTML template and application entry point
**Key Elements**:
- Meta tags for responsive design
- Application title configuration
- Root div for React mounting
- Script imports for main application

#### **main.jsx**
**Purpose**: React application bootstrap and initialization
**Key Functions**:
- React DOM root creation
- Main App component rendering
- StrictMode enforcement for development

#### **App.jsx**
**Purpose**: Main application component and routing configuration
**Key Functions**:
- React Router setup with route definitions
- Global application state management
- Authentication context provision
- Route protection implementation

#### **package.json**
**Purpose**: Frontend project configuration and dependencies
**Dependencies**:
- Core: `react`, `react-dom`, `react-router-dom`
- UI/UX: `react-icons`, `chart.js`, `react-chartjs-2`
- HTTP: `axios` for API communication
- Build: `vite`, `@vitejs/plugin-react`
- Styling: `@tailwindcss/vite`, `tailwindcss`

#### **vite.config.js**
**Purpose**: Vite build tool configuration
**Key Features**:
- React plugin configuration
- Path aliases for clean imports (@/ for src/)
- Tailwind CSS integration
- Development server settings

### Styles Directory (/src/styles)

#### **global.css**
**Purpose**: Global application styles and design system
**Key Features**:
- Authentication form styling (login/register)
- Global color scheme and typography
- Responsive design utilities
- Component base styles

#### **normalize.css**
**Purpose**: CSS reset and browser normalization
**Key Functions**:
- Cross-browser compatibility
- Default style standardization
- HTML element normalization

#### **index.css**
**Purpose**: Main stylesheet imports and Tailwind CSS configuration
**Imports**:
- Tailwind CSS framework
- Global styles integration
- Normalize.css for consistency

### API Directory (/src/api)

#### **axiosInstance.js**
**Purpose**: HTTP client configuration and API communication
**Key Features**:
- Base URL configuration for API calls
- Request/response interceptors
- Authentication header management
- Response caching for performance
- Error handling and retry logic
- Cookie-based authentication support

### Components Directory (/src/components)

#### Analytics Components

##### **StatCard.jsx & StatCard.css**
**Purpose**: Reusable statistic display card component
**Key Features**:
- Flexible data presentation
- Icon and value display
- Responsive design
- Consistent styling across analytics

##### **DataTable.jsx**
**Purpose**: Tabular data presentation component
**Key Features**:
- Dynamic column generation
- Data sorting capabilities
- Responsive table design
- Pagination support

#### Layout Components

##### **DashboardLayout.jsx & DashboardLayout.css**
**Purpose**: Main dashboard layout wrapper component
**Key Features**:
- Responsive sidebar management
- Mobile-first design approach
- Sidebar toggle functionality
- Content area management
- User context provision
- Navigation state management

##### **Sidebar.jsx & Sidebar.css**
**Purpose**: Navigation sidebar component
**Key Features**:
- Role-based navigation menu
- Responsive behavior (mobile overlay, desktop fixed)
- Active route highlighting
- User profile integration
- Logout functionality
- Settings access

#### UI Components

##### **LoadingDots.jsx & LoadingDots.css**
**Purpose**: Loading state indicator component
**Key Features**:
- Animated loading indicator
- Consistent loading experience
- Lightweight implementation

##### **EventCard.jsx & EventCard.css**
**Purpose**: Event display card component
**Key Features**:
- Event information presentation
- Action menu (edit, delete, view details)
- Responsive design
- Status indicators
- Price and date formatting
- Image display support

##### **TicketCard.jsx & TicketCard.css**
**Purpose**: Ticket display and QR code component
**Key Features**:
- QR code display for ticket validation
- Ticket information presentation
- Event details integration
- Status indicators
- User information display (when applicable)

##### **Person.jsx & Person.css**
**Purpose**: User/Admin profile card component
**Key Features**:
- Profile information display
- Profile image support
- Action menu (edit, delete)
- Role-based functionality
- Responsive design

#### Functional Components

##### **SeatAllocation.jsx & SeatAllocation.css**
**Purpose**: Interactive seat selection and allocation system
**Key Features**:
- 2D grid representation of venue seats
- Interactive seat selection
- Real-time availability updates
- Visual status indicators (available, reserved, booked)
- Responsive grid layout
- Popup information on seat interaction

### Pages Directory (/src/pages)

#### Authentication Pages

##### **Login.jsx**
**Purpose**: User and admin login interface
**Key Features**:
- Dual-role login (user/admin)
- Form validation and error handling
- Password visibility toggle
- Role selection dropdown
- Responsive design
- JWT token handling

##### **Register.jsx**
**Purpose**: User registration interface
**Key Features**:
- Comprehensive user profile creation
- Image upload for profile pictures
- Form validation (email, password confirmation)
- Interest selection
- Location and demographic information
- File upload preview

#### Admin Pages

##### **AdminDashboard.jsx & adminDashboard.css**
**Purpose**: Main administrative dashboard
**Key Features**:
- Real-time statistics display
- Revenue and booking analytics
- User search functionality
- Quick action buttons
- Chart integration (Line charts for revenue, Donut charts for engagement)
- Responsive design with mobile-first approach

##### **AnalyticsDashboard.jsx & AnalyticsDashboard.css**
**Purpose**: Comprehensive analytics and insights dashboard
**Key Features**:
- Attendee demographic analysis
- Age group distribution charts
- Location-based insights
- Interest categorization
- Gender distribution analytics
- Interactive pie and bar charts
- Responsive chart layouts

##### **AnalyticsReports.jsx & AnalyticsReports.css**
**Purpose**: Event-specific analytics reporting
**Key Features**:
- Event selection dropdown
- Dynamic report generation
- Event insights integration
- Responsive report layout

##### **Events.jsx & Events.css**
**Purpose**: Event management dashboard
**Key Features**:
- Event listing with search and filters
- Create new event functionality
- Event status management
- Bulk operations support
- Responsive grid layout
- Action menus for each event

##### **BookingTickets.jsx & BookingTickets.css**
**Purpose**: Ticket management and booking oversight
**Key Features**:
- Ticket listing with filters
- Manual ticket creation
- User and event association
- Search functionality
- Status management
- Responsive design

##### **ManagePeople.jsx & ManagePeople.css**
**Purpose**: User and admin management interface
**Key Features**:
- Separate sections for users and admins
- Search functionality for both categories
- Add new admin capability
- Edit and delete operations
- Profile management
- Responsive layout

##### **EditPerson.jsx & EditPerson.css**
**Purpose**: User/Admin profile editing interface
**Key Features**:
- Form-based profile editing
- Image upload and preview
- Validation and error handling
- Role-specific field management
- Responsive form design

#### Event Management Pages

##### **EventAdd_Edit.jsx & EventAdd_Edit.css**
**Purpose**: Event creation and modification interface
**Key Features**:
- Comprehensive event form
- Image upload for event posters
- Seat allocation grid setup
- Date and time management
- Price and capacity settings
- Tag and category selection
- Responsive form layout

##### **EventDetails.jsx & EventDetails.css**
**Purpose**: Event information display and booking interface
**Key Features**:
- Complete event information display
- Seat allocation visualization
- Ticket booking functionality
- Event status indicators
- Responsive design
- User-specific actions (book tickets)

##### **EventInsights.jsx & EventInsights.css**
**Purpose**: Individual event analytics and insights
**Key Features**:
- Event-specific attendee demographics
- Age group and location analysis
- Interest distribution charts
- Interactive data visualization
- Responsive chart layouts
- Data table integration

#### User Pages

##### **MyTickets.jsx**
**Purpose**: User ticket management interface
**Key Features**:
- Personal ticket listing
- QR code display
- Ticket status tracking
- Event information display
- Check-in functionality

##### **TicketDetails.jsx & TicketDetails.css**
**Purpose**: Individual ticket information display
**Key Features**:
- Detailed ticket information
- QR code for validation
- Event details integration
- Status indicators
- Responsive design

#### Communication Pages

##### **Messages.jsx & Messages.css**
**Purpose**: Inter-user messaging interface
**Key Features**:
- User listing for message recipients
- Chat interface with message history
- Real-time message display
- Responsive design (mobile/desktop layouts)
- User search functionality
- Message composition interface

##### **Notifications.jsx & Notifications.css**
**Purpose**: System notifications and alerts
**Key Features**:
- Notification listing
- Timestamp display
- Message content presentation
- Responsive design
- Read/unread status (future enhancement)

### Utils Directory (/src/utils)

#### **calculationUtils.js**
**Purpose**: Client-side calculation utilities for performance optimization
**Key Functions**:
- `calculateDashboardStats()`: Revenue, booking, and engagement calculations
- `calculateAnalyticsStats()`: Demographic analysis and statistics
- `calculateEventInsights()`: Event-specific analytics calculations
- Age group categorization
- Most common demographic calculations
- Revenue and attendance analytics

---

## Database Models

### Schema Design Philosophy
The database follows a document-based approach with MongoDB, utilizing Mongoose for schema definition and validation. The design emphasizes:
- **Referential integrity** through ObjectId references
- **Data validation** at the schema level
- **Timestamp tracking** for audit trails
- **Flexible schema evolution** for future enhancements

### Model Relationships
- **Users** → **Tickets**: One-to-many relationship
- **Events** → **Tickets**: One-to-many relationship
- **Users/Admins** → **Messages**: Many-to-many relationship
- **Events** → **SeatAllocation**: Embedded document relationship

---

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout
- `POST /api/admin/register`: Admin registration
- `POST /api/admin/login`: Admin login
- `POST /api/admin/logout`: Admin logout

### Event Management Endpoints
- `GET /api/events`: Get all events (with filtering)
- `GET /api/events/:id`: Get specific event
- `POST /api/events`: Create new event (admin only)
- `PUT /api/events/:id`: Update event (admin only)
- `DELETE /api/events/:id`: Delete event (admin only)

### Booking and Ticket Endpoints
- `POST /api/tickets/book`: Book tickets for an event
- `GET /api/tickets/user`: Get user's tickets
- `GET /api/tickets/all`: Get all tickets (admin only)
- `PUT /api/tickets/:id/status`: Update ticket status
- `DELETE /api/tickets/:id`: Cancel ticket

### Analytics Endpoints
- `GET /api/analytics/overall`: Overall platform analytics
- `GET /api/analytics/event/:id`: Event-specific analytics
- `GET /api/optimized/analytics/raw-data`: Optimized analytics data

### Dashboard Endpoints
- `GET /api/dashboard-stats`: Dashboard statistics
- `GET /api/optimized/dashboard-data`: Optimized dashboard data

### Messaging Endpoints
- `GET /api/messages/users`: Get users for messaging
- `GET /api/messages/received`: Get received messages
- `GET /api/messages/:userId`: Get conversation with user
- `POST /api/messages/send`: Send message

---

## Component Architecture

### Architectural Patterns
- **Functional Components**: Modern React with hooks for state management
- **Component Composition**: Reusable components with prop-based customization
- **Responsive Design**: Mobile-first CSS with progressive enhancement
- **State Management**: Local component state with useContext for global state
- **Performance Optimization**: Memoization and efficient re-rendering

### Design System
- **Consistent Styling**: Shared CSS classes and design tokens
- **Icon System**: React Icons for consistent iconography
- **Color Scheme**: Professional color palette with semantic colors
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent margin and padding system

---

## Key Features Implementation

### Authentication System
**Implementation**: JWT-based authentication with role separation
**Security Features**:
- Password hashing with bcryptjs
- Secure HTTP-only cookies
- Token expiration management
- Role-based route protection

### Event Management
**Implementation**: Complete CRUD operations with image support
**Key Features**:
- Dynamic seat allocation grid
- Event status management
- Image upload and storage
- Search and filtering capabilities

### Ticket System
**Implementation**: QR code generation with booking management
**Key Features**:
- Unique QR code generation
- Seat allocation tracking
- Ticket status management
- User-specific ticket views

### Analytics Dashboard
**Implementation**: Chart.js integration with responsive design
**Key Features**:
- Real-time data visualization
- Demographic analysis
- Revenue tracking
- Interactive charts

### Responsive Design
**Implementation**: Mobile-first CSS with media queries
**Key Features**:
- Breakpoint-based design (mobile, tablet, desktop)
- Flexible layouts
- Touch-friendly interfaces
- Performance optimization for mobile

---

## Performance Optimizations

### Backend Optimizations
- **Client-side Calculations**: Move analytics calculations to frontend
- **Optimized Endpoints**: Reduced data transfer with selective field retrieval
- **API Caching**: Response caching for frequently accessed data
- **Database Indexing**: Optimized queries with proper indexing

### Frontend Optimizations
- **Code Splitting**: Component-based code splitting with React Router
- **Image Optimization**: Efficient image loading and caching
- **API Caching**: Client-side caching with axios interceptors
- **Responsive Images**: Appropriately sized images for different screens

### Database Optimizations
- **Query Optimization**: Efficient database queries with aggregation
- **Index Usage**: Proper indexing for frequently queried fields
- **Data Pagination**: Efficient data loading with pagination
- **Connection Pooling**: Optimized database connection management

---

## Security Implementation

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Security**: bcryptjs hashing with salt rounds
- **HTTP-only Cookies**: Secure cookie-based token storage
- **Token Validation**: Comprehensive token verification

### API Security
- **Route Protection**: Middleware-based route protection
- **Role-based Access**: Granular permission control
- **Input Validation**: Request data validation and sanitization
- **Error Handling**: Secure error responses without information leakage

### File Security
- **Upload Restrictions**: File type and size limitations
- **Secure Storage**: GUID-based file naming
- **Access Control**: Controlled file access and serving

---

## Conclusion

EventX Studio represents a comprehensive, production-ready event management system built with modern web technologies. The application demonstrates:

- **Full-stack Development**: Complete MEAN/MERN stack implementation
- **Professional Architecture**: Scalable and maintainable code organization
- **User Experience**: Responsive, intuitive interface design
- **Security**: Comprehensive security measures and best practices
- **Performance**: Optimized for speed and efficiency
- **Scalability**: Architecture supporting future growth and enhancements

The project showcases advanced web development skills including modern React patterns, RESTful API design, database modeling, responsive design, and performance optimization techniques.
