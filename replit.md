# WhatsApp Bot Management Platform

## Overview
A professional web application for managing WhatsApp bot sessions with real-time monitoring, user management, and administrative controls. Built with React, TypeScript, and integrated with an external WhatsApp bot API.

## Current State
- ✅ **Full Frontend Implementation**: Complete UI with Dashboard and Admin Panel
- ✅ **API Integration**: Successfully connected to external backend via proxy
- ✅ **Real-time Data**: Live sessions and blocked users from external API
- ✅ **Admin Controls**: User blocking/unblocking, session management
- ✅ **Professional Design**: Material Design with light/dark mode
- ✅ **CORS Solution**: Proxy server resolves cross-origin issues

## Recent Changes (Sept 17, 2025)
- **API Integration**: Connected to http://interchange.proxy.rlwy.net:24084
- **Proxy Server**: Implemented CORS proxy to connect frontend to external API  
- **Real Data**: Application now displays live WhatsApp sessions and blocked users
- **Error Handling**: Added graceful fallbacks and loading states
- **API Status**: Added connection monitoring and diagnostic tools

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **API Layer**: Custom hooks with TanStack Query for data fetching
- **Proxy Server**: Express.js proxy to external WhatsApp bot API
- **Design System**: Material Design principles with consistent spacing and colors
- **Routing**: Wouter for client-side routing

## Key Features
1. **Main Dashboard** (`/`) - User interface for pairing WhatsApp numbers
2. **Admin Panel** (`/admin`) - Complete user and session management
3. **Banned Users Page** (`/banned`) - Display for blocked users with contact info
4. **API Integration** - Real-time connection to external WhatsApp bot service
5. **Status Monitoring** - Live API connection status and diagnostics

## User Preferences
- External API integration preferred over local database
- Professional, clean design with Material Design principles
- Real-time data updates for sessions and user management
- Admin controls for user blocking and session management
- CORS-compliant architecture for production deployment

## API Endpoints (External)
- `GET /sessions` - Active WhatsApp sessions
- `GET /blocklist` - Blocked users list
- `GET /pair?number=X` - Pair WhatsApp number
- `GET /block?number=X` - Block user (admin)
- `GET /unblock?number=X` - Unblock user (admin)  
- `GET /delete?number=X` - Delete session (admin)

## Technical Implementation
- **Proxy Solution**: Frontend calls `/api/*` routes which proxy to external API
- **Error Handling**: Graceful fallbacks when API is unavailable
- **Real-time Updates**: Auto-refresh for sessions and blocklist
- **Type Safety**: Full TypeScript implementation with proper schemas
- **Responsive Design**: Mobile-first approach with adaptive layouts