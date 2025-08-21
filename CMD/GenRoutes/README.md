# GenRoutes Documentation

## Overview

The GenRoutes folder contains the logic for generating complete routing infrastructure for your application. It automatically copies pre-built route templates and middleware configurations based on your project's module type (CommonJS or ES modules), creating a fully functional API routing system with CRUD operations, file handling, search capabilities, and export functionality.

## Features

- **Complete Route Generation**: Creates comprehensive API routing structure
- **Module System Support**: Supports both CommonJS and ES modules automatically
- **Pre-built Templates**: Includes ready-to-use route configurations for common operations
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **File Upload Routes**: Integrated multer-based file handling endpoints
- **Search & Filtering**: Built-in search and listing capabilities
- **Export Functions**: CSV and PDF generation routes
- **Interactive CLI**: User-friendly prompts for route generation
- **Configuration-Based**: Uses tajiri.config settings for customization

## Purpose

This is a code generation tool that runs as part of the tajiri framework setup. When executed, it:

- **Analyzes Configuration**: Reads your tajiri.config to determine module type and target directory
- **Copies Route Templates**: Transfers pre-built routing files to your project
- **Sets Up API Structure**: Creates complete RESTful API infrastructure
- **Configures Middleware**: Includes file upload, authentication, and utility middleware
- **Enables CRUD Operations**: Provides immediate API functionality for your models

The generated routes provide a complete backend API that works seamlessly with your Prisma models and database schema.

## Architecture

### Core Files

#### `index.js` - Main Route Generator
The primary orchestrator that handles the route generation process.

**Key Functions:**
- `GenRoutes()`: Main entry point for generating routes
- `getCurrentDirectory()`: Utility to resolve current module directory
- Handles configuration validation and user interaction

**Flow:**
1. Validates tajiri.config existence
2. Prompts user for generation confirmation
3. Determines source directory based on module type
4. Copies route templates to target directory
5. Confirms successful generation

**Dependencies:**
- `@inquirer/prompts`: Interactive CLI prompts
- `chalk`: Terminal styling and colored output
- `copyDirContents`: Utility for directory copying operations

#### Route Templates

The generator includes pre-built route templates for both module systems:

##### `Config.js` - Configuration Route
Simple route for handling configuration-related operations.

**Structure:**
```javascript
const router = require("express").Router();
const Config = require("./../Controller/Scheme/Config/init");
router.post("/", Config);
module.exports = router;
```

##### `Scheme.js` - Main API Routes
Comprehensive routing configuration covering all major API operations.

**Route Categories:**

**📋 LISTING ROUTES:**
- `GET /list-multi`: Multi-model listing
- `GET /list/:model`: Single model listing

**🔍 SEARCH ROUTES:**
- `GET /fuse-search/:model`: Fuzzy search functionality

**🗃️ FILE ENGINE ROUTES:**
- `GET /relax/read`: File reading operations
- `PUT /relax/multi/:model`: Multi-file upload with processing

**📊 CSV ROUTES:**
- `GET /csv/template/:model`: CSV template generation
- `GET /csv/generate/:model`: CSV data export
- `PUT /csv/upload/:model`: CSV file import

**📄 PDF ROUTES:**
- `GET /pdf/generate/:model`: PDF generation

**🧪 UTILITY ROUTES:**
- `GET /postman/generate`: Postman collection generation

**✏️ CRUD ROUTES:**
- `POST /:model`: Create operations
- `PATCH /:model`: Partial updates
- `PUT /:model`: Full updates
- `GET /:model`: Read operations

## Configuration

### Required Configuration
The tool requires a valid `tajiri.config` file with the following structure:

```javascript
{
  "base": "src",           // Target directory for generated routes
  "type": "module"         // "module" or "commonjs"
}
```

### Module Type Support

#### ES Modules (`type: "module"`)
- Uses `modulejs` template directory
- ES6 import/export syntax
- Modern JavaScript module system

#### CommonJS (`type: "commonjs"`)
- Uses `commonjs` template directory
- Traditional require/module.exports syntax
- Node.js traditional module system

## Usage

### Prerequisites
1. Valid tajiri.config file in project root
2. Initialized tajiri project structure
3. Express.js framework setup

### Running the Generator
```bash
tajiri generate routes
# Or as part of init process
tajiri init
```

### Interactive Flow
1. **Configuration Check**: Validates tajiri.config existence
2. **Generation Prompt**: Confirms route generation with user
3. **Template Selection**: Automatically selects based on module type
4. **Directory Copying**: Transfers route templates to target location
5. **Completion Confirmation**: Reports successful generation

### Generated Structure
After generation, your project will have the following routing structure:

```
src/                          # Base directory (configurable)
├── routes/
│   ├── Config.js            # Configuration routes
│   └── Scheme.js            # Main API routes
└── middleware/
    └── Multer/
        ├── multerSingleFile.js
        └── multerMultiFiles.js
```

## Generated Routes

### CRUD Operations
**Basic CRUD for any model:**
```javascript
POST   /:model     // Create new record
GET    /:model     // Read/retrieve records
PUT    /:model     // Full update
PATCH  /:model     // Partial update
```

### Listing & Search
**Data retrieval and filtering:**
```javascript
GET    /list/:model           // List records for specific model
GET    /list-multi            // Multi-model listing
GET    /fuse-search/:model    // Fuzzy search functionality
```

### File Operations
**File upload and management:**
```javascript
GET    /relax/read                    // File reading
PUT    /relax/multi/:model           // Multi-file upload
```

### Export Functions
**Data export capabilities:**
```javascript
GET    /csv/template/:model          // CSV template download
GET    /csv/generate/:model          // CSV data export
PUT    /csv/upload/:model            // CSV data import
GET    /pdf/generate/:model          // PDF generation
```

### Utility Routes
**Development and integration tools:**
```javascript
GET    /postman/generate             // Postman collection generation
POST   /config                       // Configuration management
```

## Integration Points

### Express.js Integration
- **Router System**: Uses Express Router for modular route organization
- **Middleware Pipeline**: Integrates with Express middleware system
- **Error Handling**: Compatible with Express error handling patterns

### Multer Integration
- **File Upload Middleware**: Integrated multer configurations
- **Single File Uploads**: Via `multerSingleFile` middleware
- **Multi-file Uploads**: Via `multerMultiFiles` middleware
- **Temporary Storage**: Automatic file storage management

### Controller Integration
- **Model Controllers**: Routes connect to generated model controllers
- **CRUD Controllers**: Standardized CRUD operation handlers
- **Utility Controllers**: Search, export, and file management controllers

### Database Integration
- **Prisma Compatibility**: Routes work with Prisma ORM models
- **Dynamic Model Handling**: `:model` parameter allows flexible model operations
- **Relationship Support**: Handles complex model relationships

## Error Handling

The generator includes comprehensive error handling:
- **Missing Configuration**: Clear error message if tajiri.config not found
- **Copy Failures**: Handles file system errors during template copying
- **Permission Issues**: Manages directory access and write permissions
- **User Cancellation**: Graceful handling when user skips generation

## Security Considerations

### Route Security
- **Input Validation**: Routes should include proper input validation
- **Authentication**: Consider adding authentication middleware
- **Authorization**: Implement proper authorization checks
- **Rate Limiting**: Add rate limiting for API endpoints

### File Upload Security
- **File Type Validation**: Validate uploaded file types
- **Size Limits**: Configured file size restrictions
- **Virus Scanning**: Consider antivirus integration
- **Secure Storage**: Files stored in temporary, non-public directories

## Best Practices

1. **Route Organization**: Keep routes logically organized and documented
2. **Middleware Ordering**: Ensure proper middleware execution order
3. **Error Handling**: Implement comprehensive error handling in all routes
4. **Input Validation**: Validate all incoming data
5. **Response Standards**: Use consistent response formats
6. **Logging**: Implement proper request/response logging
7. **Testing**: Create tests for all generated routes

## Troubleshooting

### Common Issues
- **"Exiting process run init first"**: Run `tajiri init` to create configuration
- **Copy failures**: Check file system permissions and target directory access
- **Route conflicts**: Ensure no conflicting routes in existing application
- **Module errors**: Verify correct module type in configuration

### Debug Tips
- Check console output for detailed error messages
- Verify tajiri.config file format and content
- Ensure target directory exists and is writable
- Test with simple project structure first
- Check Express.js setup and dependencies

## Customization

### Route Modification
Generated routes can be customized:
- Add authentication middleware
- Implement custom validation
- Modify response formats
- Add additional endpoints

### Template Customization
Advanced users can modify template files:
- Customize route structure
- Add new route categories
- Modify middleware integration
- Change naming conventions

## Future Enhancements

The architecture supports future improvements:
- Dynamic route generation based on Prisma schema
- Authentication and authorization templates
- GraphQL route generation
- WebSocket route support
- API versioning capabilities
- Custom middleware templates
- Route testing template generation

This generator provides a complete, production-ready API routing infrastructure that scales with your application's needs while maintaining consistency and best practices.