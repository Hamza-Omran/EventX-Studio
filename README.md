# EventX Studio – Event Management & Ticketing Platform

A production-ready full-stack event management system supporting **event creation, ticketing, seat allocation, analytics, and role-based administration**.

**Context:** Full-Stack MERN Project (2025)

# admin credentials:
- email: admin@a.com 
- password: Hamza1234
- role: admin

# user credentials:
- email: omar@example.com 
- password: 123456
- role: user

# - **Live Demo**: https://event-x-studio-alpha.vercel.app
<img width="1889" height="816" alt="image" src="https://github.com/user-attachments/assets/630edb13-f4a2-47f3-bbde-1cb5ac801ef5" />

---

## Platform Overview

EventX Studio is designed as a **complete event operations system**, not just a booking interface.  
It models the real workflow of event organizers and attendees, combining operational tools, analytics, and secure ticketing.

The platform supports:
- Admins managing events, users, and analytics
- Users discovering events and booking tickets
- Secure seat allocation and QR-based ticket validation
- Production deployment with cloud infrastructure

---

## Core System Modules

### 1. Event & Ticket Management

Handles the full event lifecycle from creation to attendance.

**Capabilities:**
- Event creation and editing
- Seat allocation with availability tracking
- Ticket booking and seat reservation
- QR code generation for ticket validation

**Outcome:**  
Demonstrates transactional thinking and real-world constraints in booking systems.

---

### 2. User Booking Experience

Provides a streamlined, user-facing booking flow.

**Capabilities:**
- Event discovery and filtering
- Interactive seat selection
- Ticket history and digital ticket access
- QR-based ticket usage

**Outcome:**  
Models realistic user flows with state consistency.

---

### 3. Admin Analytics & Control

Centralized administrative oversight.

**Capabilities:**
- Revenue and booking analytics
- Attendee demographics insights
- Event performance dashboards
- User and admin management

**Outcome:**  
Shows data-driven system design beyond CRUD.

---

### 4. Communication & Support

Built-in interaction between users and admins.

**Capabilities:**
- Messaging system
- Notifications for event and booking updates
- Admin–user communication channel

**Outcome:**  
Improves platform usability and operational support.

---

## Technical Highlights

- MERN stack with clean separation of concerns
- JWT-based authentication with role-based access control
- Secure seat allocation and booking logic
- QR-code-based ticket verification
- Cloud image handling (Cloudinary)
- RESTful API design
- Production deployment (Vercel + Railway + MongoDB Atlas)

---

## Architecture & Stack

**Frontend**
- React + Vite
- React Router
- Chart.js for analytics

**Backend**
- Node.js + Express
- JWT authentication
- Role-based middleware

**Database**
- MongoDB (Mongoose ODM)
- Structured schemas and relationships

**Infrastructure**
- Frontend: Vercel  
- Backend: Railway  
- Database: MongoDB Atlas  
- Media: Cloudinary

---

## Engineering Focus

This project emphasizes:
- Realistic system workflows
- Security and role separation
- Analytics-driven admin tooling
- Scalable architecture
- Production deployment readiness

It is intentionally designed to reflect **industry-grade systems**, not classroom demos.

---

## Documentation

To keep this README focused, full technical details are available separately in doc.md:
- Database schemas and models
- API endpoints
- Deployment configuration
- Security implementation
- Testing strategy
- Demo credentials
