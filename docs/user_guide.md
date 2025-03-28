# Tasman Capital Website User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Managing Pages](#managing-pages)
4. [Working with Components](#working-with-components)
5. [Customizing Headers and Footers](#customizing-headers-and-footers)
6. [Navigation Menus](#navigation-menus)
7. [Theme Customization](#theme-customization)
8. [Media Library](#media-library)
9. [User Management](#user-management)
10. [Best Practices](#best-practices)

## Introduction

Welcome to the Tasman Capital Website User Guide. This document provides step-by-step instructions for managing and customizing the Tasman Capital website using the built-in content management system.

### About the System

The Tasman Capital website is built on a flexible, database-driven content management system that allows for complete customization of content, styling, and structure through a visual editor interface. The system is designed to be user-friendly while providing powerful customization options.

### Key Features

- **Dynamic Content Management**: Create, edit, and organize all website content
- **Visual Styling System**: Customize appearance using CSS variables and theme settings
- **Page Templates**: Pre-configured page layouts for different content types
- **Header and Footer Customization**: Multiple styles with full customization options
- **Navigation Management**: Hierarchical menu system with responsive behavior

## Getting Started

### Accessing the Admin Dashboard

1. Navigate to `https://tasmancapital.com.au/login`
2. Enter your email and password
3. Click "Sign In"

### Dashboard Overview

The admin dashboard is divided into several sections:

- **Pages**: Manage website pages
- **Media**: Upload and manage images, videos, and documents
- **Appearance**: Customize themes, headers, footers, and navigation
- **Users**: Manage user accounts and permissions
- **Settings**: Configure website settings

### User Roles

The system has three user roles:

- **Admin**: Full access to all features
- **Editor**: Can create and edit content but not manage users
- **Viewer**: Read-only access to content

## Managing Pages

### Creating a New Page

1. In the admin dashboard, navigate to "Pages"
2. Click "Add New Page"
3. Select a page template
4. Fill in the page details:
   - Title
   - Slug (URL path)
   - Description
   - SEO metadata
5. Click "Create Page"

### Editing Page Content

1. In the Pages list, click on the page you want to edit
2. Use the visual editor to modify content:
   - Click on a section to edit its content
   - Use the toolbar to format text, add links, etc.
   - Drag and drop to reorder sections
3. Click "Save" to save your changes

### Page Settings

Each page has the following settings:

- **Basic Information**:
  - Title: The page title
  - Slug: The URL path (e.g., "about" for yourdomain.com/about)
  - Description: A brief description of the page
  - Status: Draft, Published, or Archived

- **SEO Settings**:
  - Meta Title: The title shown in search results
  - Meta Description: The description shown in search results
  - Meta Keywords: Keywords for search engines
  - OG Image: The image shown when sharing on social media

- **Structure Settings**:
  - Template: The page template
  - Header: The header style
  - Footer: The footer style

### Publishing a Page

1. Edit the page and make your changes
2. Set the status to "Published"
3. Optionally, set a publishing date and time
4. Click "Save"

### Archiving a Page

1. Navigate to the page you want to archive
2. Set the status to "Archived"
3. Click "Save"

Archived pages are not deleted but are no longer visible on the website.

## Working with Components

### Component Types

The system includes several component types:

- **Hero**: Large banner section with heading and background
- **Content**: Text-based content section
- **Features**: Grid of feature items with icons
- **Team**: Team member profiles
- **Testimonials**: Client or customer testimonials
- **CTA**: Call-to-action section
- **Gallery**: Image or video gallery
- **Contact**: Contact information and form
- **Investments**: Investment portfolio items

### Adding a Component

1. Edit a page
2. Click "Add Component" in the desired section
3. Select the component type
4. Configure the component properties
5. Click "Add"

### Editing a Component

1. Click on the component you want to edit
2. Modify the component properties in the sidebar
3. Click "Save"

### Reordering Components

1. Click and hold on a component
2. Drag it to the desired position
3. Release to drop

### Removing a Component

1. Click on the component you want to remove
2. Click the "Delete" button in the sidebar
3. Confirm the deletion

## Customizing Headers and Footers

### Header Styles

The system includes three header styles:

- **Standard**: Default header with logo and navigation
- **Transparent**: For use with hero sections, becomes solid on scroll
- **Minimal**: Simplified header with reduced height

### Footer Styles

The system includes three footer styles:

- **Standard**: Multi-column footer with navigation and contact info
- **Minimal**: Simplified single-row footer
- **Expanded**: Comprehensive footer with newsletter signup

### Customizing a Header

1. In the admin dashboard, navigate to "Appearance" > "Headers"
2. Click on the header you want to customize
3. Modify the header properties:
   - Logo (light and dark versions)
   - Navigation menu
   - Actions (buttons)
   - Behavior (sticky, transparent)
   - Styling (background, height, etc.)
4. Click "Save"

### Customizing a Footer

1. In the admin dashboard, navigate to "Appearance" > "Footers"
2. Click on the footer you want to customize
3. Modify the footer properties:
   - Logo (light and dark versions)
   - Column content
   - Navigation menus
   - Social links
   - Copyright text
   - Styling (background, padding, etc.)
4. Click "Save"

### Assigning Headers and Footers to Pages

1. Edit a page
2. In the page settings, select the desired header and footer
3. Click "Save"

## Navigation Menus

### Creating a New Menu

1. In the admin dashboard, navigate to "Appearance" > "Navigation"
2. Click "Add New Menu"
3. Enter a name and description
4. Select a location (header, footer, mobile)
5. Click "Create Menu"

### Adding Menu Items

1. Edit a menu
2. Click "Add Item"
3. Configure the menu item:
   - Label: The text to display
   - URL: The link destination (or select a page)
   - Icon: Optional icon to display
   - Target: Open in same window or new tab
   - Parent: For creating dropdown menus
4. Click "Add"

### Creating Dropdown Menus

1. Add a top-level menu item
2. Add additional menu items and set their parent to the top-level item
3. The system will automatically create a dropdown menu

### Reordering Menu Items

1. Click and hold on a menu item
2. Drag it to the desired position
3. Release to drop

### Responsive Behavior

Each menu item can have different behavior on different devices:

1. Edit a menu item
2. Expand the "Responsive Behavior" section
3. Configure settings for desktop, tablet, and mobile:
   - Visibility: Show or hide on specific devices
   - CSS Classes: Apply different styles
   - Label: Use a different label (e.g., shorter on mobile)
4. Click "Save"

## Theme Customization

### Editing Theme Colors

1. In the admin dashboard, navigate to "Appearance" > "Theme"
2. Select the theme to edit
3. Modify the color variables:
   - Primary: Main brand color
   - Secondary: Secondary color
   - Accent: Accent color
   - Background: Page background
   - Foreground: Text color
   - And more...
4. Click "Save"

### Light and Dark Mode

The theme system supports both light and dark modes:

1. Edit a theme
2. Switch between "Light Mode" and "Dark Mode" tabs
3. Configure colors for each mode
4. Click "Save"

### Typography Settings

1. Edit a theme
2. Navigate to the "Typography" tab
3. Configure font settings:
   - Font families
   - Font sizes
   - Font weights
   - Line heights
4. Click "Save"

### Component Styling

1. Edit a theme
2. Navigate to the "Components" tab
3. Select a component type (buttons, cards, etc.)
4. Configure component-specific styles
5. Click "Save"

## Media Library

### Uploading Media

1. In the admin dashboard, navigate to "Media"
2. Click "Upload"
3. Select files from your computer
4. Add metadata (alt text, caption, etc.)
5. Click "Upload"

### Organizing Media

1. Select media items
2. Add tags
3. Use the filter and search functions to find media

### Using Media in Components

1. Edit a component that supports media
2. Click the "Select Media" button
3. Browse or search for media
4. Select the desired item
5. Click "Insert"

## User Management

### Creating a New User

1. In the admin dashboard, navigate to "Users"
2. Click "Add New User"
3. Enter user details:
   - Email
   - First Name
   - Last Name
   - Role (Admin, Editor, or Viewer)
4. Click "Create User"

The system will send an invitation email to the new user.

### Editing User Permissions

1. Navigate to "Users"
2. Click on the user you want to edit
3. Modify their role
4. Click "Save"

### Deactivating a User

1. Navigate to "Users"
2. Click on the user you want to deactivate
3. Click "Deactivate Account"
4. Confirm the deactivation

## Best Practices

### Page Organization

- Use consistent page templates for similar content
- Keep page titles concise and descriptive
- Use SEO metadata to improve search visibility
- Organize content in a logical hierarchy

### Content Creation

- Use high-quality images and videos
- Keep text concise and scannable
- Use headings to structure content
- Include calls-to-action where appropriate

### Navigation Design

- Limit top-level menu items to 7 or fewer
- Use clear, descriptive labels
- Group related items in dropdowns
- Ensure mobile navigation is touch-friendly

### Performance Optimization

- Compress images before uploading
- Use video sparingly and consider bandwidth
- Preview on multiple devices to ensure responsiveness
- Test page load times regularly

### Security

- Use strong passwords
- Log out when not using the system
- Regularly review user accounts
- Keep the system updated
