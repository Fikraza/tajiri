# Middleware Documentation

## Overview

The Middleware folder contains essential Express.js middleware components for handling authentication, error management, and file uploads. It provides a comprehensive middleware ecosystem including JWT authentication, centralized error handling, and specialized file upload processing with automatic storage management and unique filename generation.

## Features

### Authentication & Security
- **JWT Authentication**: Token-based user authentication with automatic verification
- **Bearer Token Support**: Standard OAuth-style bearer token implementation
- **User Context**: Automatic user information injection into request objects
- **Route Protection**: Selective authentication bypass for public endpoints

### Error Management
- **Centralized Error Handling**: Unified error processing across all routes
- **Custom Error Support**: Structured custom error responses
- **Database Error Translation**: Automatic handling of Prisma/database errors
- **Environment-Aware Logging**: Development vs production error logging

### File Upload Processing
- **Single File Upload**: Handles individual file uploads with size limits
- **Multiple File Upload**: Processes multiple files simultaneously from different form fields
- **Automatic Storage**: Creates and manages temporary storage directories
- **Unique Filenames**: Generates timestamped filenames to prevent conflicts
- **File Size Limits**: Configurable upload size restrictions
- **Request Integration**: Seamlessly integrates uploaded file information into Express request objects

### Generator Support
- **Module System Compatibility**: Supports both CommonJS and ES modules
- **Interactive CLI**: User-friendly middleware generation prompts
- **Template-Based Generation**: Pre-built middleware templates for rapid setup

## Purpose

This middleware ecosystem provides comprehensive backend infrastructure for Express.js applications. The components work together to handle:

- **Authentication & Authorization**: JWT-based user authentication with automatic token verification and user context injection
- **Error Management**: Centralized error handling with custom error support and database error translation
- **File Upload Processing**: Complete file upload handling with storage management and security features
- **Development Workflow**: Generator tools for automatic middleware setup and configuration

The middleware is designed to work seamlessly with the tajiri framework while being flexible enough for standalone Express.js applications. It provides production-ready security, error handling, and file processing capabilities out of the box.

## Architecture

### Core Components

#### Authentication System (`Auth/`)

##### `index.js` - JWT Authentication Middleware
Provides comprehensive JWT-based authentication for API endpoints.

**Key Features:**
- **Token Verification**: Validates JWT tokens using configurable secret
- **User Context**: Automatically loads and attaches user information to requests
- **Route Flexibility**: Selective authentication bypass for public endpoints
- **Database Integration**: Verifies user existence in database after token validation

**Authentication Flow:**
```javascript
const Auth = async (req, res, next) => {
  // Allow unauthenticated access to login
  if (url.includes("member/login")) {
    return next();
  }
  
  // Extract and verify bearer token
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.BEARER);
  
  // Load user from database
  const member = await prisma.member.findUnique({
    where: { id: decoded.id }
  });
  
  // Inject user context into request
  req.user = member;
  req.member = member;
  req.created_by = member?.id;
  req.member_id = member?.id;
}
```

**Request Enhancement:**
- `req.user`: Full user object from database
- `req.member`: Alias for user object
- `req.created_by`: User ID for audit trails
- `req.member_id`: User ID for relationships
- `req.updated_at`: Current timestamp

##### `getAccessToken.js` - Token Generation Utility
Generates JWT tokens for authenticated users.

**Configuration:**
```javascript
function generateAccessToken(user, exp = 98) {
  return jwt.sign(user, process.env.BEARER, { 
    expiresIn: `${exp}hr` 
  });
}
```

**Features:**
- Configurable expiration (default 98 hours)
- Uses environment variable for signing secret
- Standard JWT token generation

#### Error Management System

##### `error.js` - Centralized Error Middleware
Comprehensive error handling middleware for all application errors.

**Error Categories:**
- **Custom Errors**: Application-defined errors with specific status codes
- **Database Errors**: Prisma/database constraint violations
- **System Errors**: Unexpected server errors

**Error Processing:**
```javascript
function errorMiddleware(error, req, res, next) {
  // Development logging
  if (process?.env?.ENVIRONMENT === "development") {
    console.log(error);
  }
  
  // Handle custom application errors
  if (error?.custom) {
    return res.status(error?.status || 400).json(error);
  }
  
  // Handle database constraint violations
  if (error?.message?.includes("Unique constraint failed")) {
    return res.status(400).json({
      custom: true,
      message: `!! ${error.meta.target.join(", ")} .Should be unique`,
      meta: error.meta.target,
    });
  }
  
  // Generic error fallback
  res.status(500).json({
    custom: false,
    message: "Try again",
  });
}
```

#### File Upload System (`Multer/`)

#### `multerSingleFile.js` - Single File Upload Middleware
Handles individual file uploads with comprehensive configuration and size limits.

**Key Features:**
- **Storage Configuration**: Uses `multer.diskStorage()` for local file system storage
- **Directory Management**: Automatically creates `Temp/Multer` directory if it doesn't exist
- **File Size Limit**: Maximum upload size of 30MB
- **Unique Naming**: Generates filenames with fieldname, timestamp, and original extension
- **Request Integration**: Adds `fileName` property to request object

**Configuration:**
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = process.cwd();
    let multerPath = path.join(rootDir, "Temp/Multer");
    if (!fs.existsSync(multerPath)) {
      fs.mkdirSync(multerPath, { recursive: true });
    }
    cb(null, multerPath);
  },
  filename: function (req, file, cb) {
    const fileName = file.fieldname + "multer-save" + Date.now() + path.extname(file.originalname);
    req.fileName = fileName;
    cb(null, fileName);
  }
});
```

**Usage Pattern:**
- Expects form field named "document"
- Adds `req.fileName` containing the saved filename
- 30MB maximum file size limit

#### `multerMultiFiles.js` - Multiple File Upload Middleware
Processes multiple files from various form fields simultaneously.

**Key Features:**
- **Dynamic Field Handling**: Accepts files from any form field using `.any()`
- **File Aggregation**: Collects all uploaded files into a single object
- **Selective Processing**: Filters out text fields, keeping only file uploads
- **Flexible Structure**: Handles varying numbers of files and field names

**Filename Generation:**
```javascript
filename: function (req, file, cb) {
  const fileExt = path.extname(file.originalname);
  const fileName = "relax-save-" + Date.now() + fileExt;
  cb(null, fileName);
}
```

**Request Enhancement:**
```javascript
// Creates req.allfiles object:
req.allfiles = {
  "profile_image": "relax-save-1640995200000.jpg",
  "document": "relax-save-1640995201000.pdf",
  "attachment": "relax-save-1640995202000.docx"
}
```

#### Generator System

##### `index.js` - Middleware Generator
Automates the setup and deployment of middleware components.

**Key Functions:**
- `GenMiddleWare()`: Main entry point for middleware generation
- `getCurrentDirectory()`: Utility for module directory resolution
- Interactive CLI prompts for user confirmation

**Generation Process:**
1. Validates tajiri.config existence
2. Prompts user for middleware generation
3. Determines source directory based on module type
4. Copies middleware templates to target directory
5. Confirms successful deployment

**Module Support:**
- **ES Modules**: Uses `modulejs` template directory
- **CommonJS**: Uses `commonjs` template directory
- **Automatic Detection**: Based on tajiri.config type setting

## Configuration

### Environment Variables
Required environment variables for proper middleware operation:

```bash
# JWT Authentication
BEARER=your_jwt_secret_key_here

# Environment setting
ENVIRONMENT=development  # or "production"

# Database connection (for Prisma)
DATABASE_URL="your_database_connection_string"
```

### Authentication Configuration
```javascript
// JWT token generation
const token = generateAccessToken(userPayload, 72); // 72 hours expiry

// Authentication bypass patterns
if (url.includes("member/login")) {
  return next(); // Skip auth for login routes
}
```

### Error Handling Configuration
```javascript
// Custom error format
const customError = {
  custom: true,
  message: "Your error message",
  status: 400,
  meta: { /* additional data */ }
};
```

### Single File Configuration
```javascript
const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
}).single("document"); // Expects "document" field name
```

### Multiple Files Configuration
```javascript
const upload = multer({ storage }).any(); // Accepts any field name
```

### Storage Settings
Both middleware share common storage configuration:
- **Destination**: `{project_root}/Temp/Multer/`
- **Filename Pattern**: Timestamped with original extension
- **Directory Creation**: Automatic recursive creation

## Usage

### Prerequisites
1. Express.js application
2. Multer package installed
3. Proper form encoding (`enctype="multipart/form-data"`)

### Single File Upload Example
```javascript
const multerSingleFile = require('./Middleware/Multer/multerSingleFile');

app.post('/upload', multerSingleFile, (req, res) => {
  console.log('Uploaded file:', req.fileName);
  res.json({ filename: req.fileName });
});
```

**HTML Form:**
```html
<form enctype="multipart/form-data" method="post" action="/upload">
  <input type="file" name="document" required>
  <button type="submit">Upload</button>
</form>
```

### Multiple Files Upload Example
```javascript
const multerMultiFiles = require('./Middleware/Multer/multerMultiFiles');

app.post('/upload-multi', multerMultiFiles, (req, res) => {
  console.log('All uploaded files:', req.allfiles);
  res.json({ files: req.allfiles });
});
```

**HTML Form:**
```html
<form enctype="multipart/form-data" method="post" action="/upload-multi">
  <input type="file" name="profile_image">
  <input type="file" name="document">
  <input type="file" name="attachment" multiple>
  <button type="submit">Upload</button>
</form>
```

### Integration with Routes
```javascript
// In your route files
router.put("/relax/multi/:model", MulterMultiFiles, Relax.Upsert);
router.put("/csv/upload/:model", MulterSingleFile, Csv.Upload);
```

## Request Object Enhancement

### Single File Middleware
Adds the following to the Express request object:
```javascript
req.fileName = "document-multer-save1640995200000.pdf"
```

### Multiple Files Middleware
Adds the following to the Express request object:
```javascript
req.allfiles = {
  "fieldname1": "relax-save-1640995200000.jpg",
  "fieldname2": "relax-save-1640995201000.pdf"
} || null // if no files uploaded
```

## Error Handling

### Single File Middleware
- **File Size Exceeded**: Automatically rejects files over 30MB
- **Storage Errors**: Handles directory creation and write permission issues
- **Invalid File Types**: Accepts all file types (validation should be added in route handlers)

### Multiple Files Middleware
- **No Files Uploaded**: Sets `req.allfiles = null`
- **Storage Errors**: Propagates errors to next middleware
- **Mixed Content**: Filters out non-file form data automatically

### Error Propagation
Both middleware properly propagate errors using Express error handling:
```javascript
if (err) {
  return next(err); // Passes error to Express error handler
}
```

## Integration Points

### Framework Integration
- **Tajiri Routes**: Integrated into tajiri's route system for file operations
- **CouchDB Integration**: Works with the relax file engine for document storage
- **CSV Processing**: Handles CSV file uploads for data import operations

### Express.js Integration
- **Middleware Chain**: Fits seamlessly into Express middleware pipeline
- **Request Enhancement**: Adds file information without disrupting other middleware
- **Error Handling**: Compatible with Express error handling conventions

## Security Considerations

### File Storage
- **Temporary Location**: Files are stored in a temporary directory, not public-facing
- **Unique Names**: Timestamped filenames prevent conflicts and directory traversal
- **Size Limits**: 30MB limit prevents excessive resource consumption

### Recommendations
1. **File Type Validation**: Add file type checking in route handlers
2. **Virus Scanning**: Consider integrating virus scanning for uploaded files
3. **Storage Cleanup**: Implement periodic cleanup of temporary files
4. **Access Controls**: Ensure temporary directory is not web-accessible
5. **Input Sanitization**: Validate file names and metadata

## Best Practices

1. **Cleanup Management**: Regularly clean temporary files to prevent disk space issues
2. **Error Handling**: Always handle upload errors gracefully in route handlers
3. **File Validation**: Implement additional validation beyond size limits
4. **Logging**: Log file upload activities for audit trails
5. **Storage Monitoring**: Monitor disk space usage in temporary directories

## Troubleshooting

### Common Issues
- **"ENOENT" errors**: Check directory permissions and path resolution
- **File size errors**: Verify files are under 30MB limit
- **Missing files**: Ensure form uses `enctype="multipart/form-data"`
- **Filename conflicts**: Unlikely due to timestamp-based naming but monitor for issues

### Debug Tips
- Check console output for multer-specific error messages
- Verify temporary directory creation and permissions
- Test with small files first to isolate size-related issues
- Ensure proper form field naming matches expected patterns

## Future Enhancements

The middleware architecture supports future improvements:
- Configurable file size limits
- File type filtering and validation
- Cloud storage integration (S3, Google Cloud)
- Automatic file cleanup scheduling
- Enhanced security features
- Progress tracking for large uploads

This middleware provides production-ready file upload handling that integrates seamlessly with the tajiri framework and standard Express.js applications.