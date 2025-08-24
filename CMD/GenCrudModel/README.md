# GenCRUDModel Documentation

## Overview

The GenCRUDModel folder contains the scaffolding logic for the `tajiri init` command. It automatically generates foundational CRUD (Create, Read, Update, Delete) structures by reading a project's Prisma schema and creating a standardized set of configuration and middleware files for each model.

## Features

- **Automatic Model Generation**: Reads Prisma models and generates corresponding CRUD structures
- **Multiple Export Formats**: Supports CSV and PDF export configurations
- **Permission System**: Generates permission middleware for API endpoints
- **Field Configuration**: Creates field and include configuration files
- **Search Configuration**: Sets up search functionality with fuzzy and PostgreSQL search options
- **Module System Support**: Compatible with both CommonJS and ES modules


## Purpose
This is not a runtime library. It is a generator used during project setup. When you run tajiri init in your application, this tool:

- Reads your Prisma Schema: It analyzes your prisma/schema.prisma file to identify all of your database models (e.g., User, Post, Product).

- Reads your Configuration: It loads settings from your tajiri.config file, such as the target directory and which fields to skip.

- Prompts for Confirmation: It will prompt you to select which models you want to generate CRUD scaffolding for (or select all).

- Generates the Structure: For each selected model, it automatically creates a suite of standardized files.

- All generated files are placed in the APP folder at the root of your project directory, resulting in the following structure:

```
APP/
└── Controller/
    └── Scheme/
        └── Models/
            ├── User/
            │   ├── field.json
            │   ├── include.json
            │   ├── permission.js
            │   ├── csv.js
            │   ├── pdf.js
            │   └── search.json
            ├── Product/
            │   └── ... (same file structure)
            └── Post/
                └── ... (same file structure)
```
## Architecture

### Core Files

#### `index.js` - Main Generator
The primary orchestrator that handles the CRUD model generation process.

**Key Functions:**
- `genCrudModels()`: Main entry point for generating CRUD models
- `ensureFolderExists(folderPath)`: Utility to create directory structure

**Dependencies:**
- `chalk`: Terminal styling
- `@inquirer/prompts`: Interactive CLI prompts
- `fs`: File system operations
- `path`: Path manipulation


#### `csv.js` - CSV Export Generator
Generates CSV export configuration templates.

**Template Structure:**
```javascript
const csv = {
  head: [],  // Array of column headers
  data: []   // Array of data fields or function
}
```

**Usage Notes:**
- `head`: Define table column titles
- `data`: Can be an array of nested keys or a function that processes each record
- Includes optional `escapeCsvValue` utility for handling special characters

#### `pdf.js` - PDF Export Generator
Creates PDF export configuration templates.

**Template Structure:**
```javascript
const pdf = {
  head: [],  // Array of table headers
  data: []   // Array of fields or function returning HTML table rows
}
```

**Usage Notes:**
- Similar structure to CSV but designed for PDF table generation
- Data function should return HTML `<td>` elements for each record

#### `permission.js` - Permission Middleware Generator
Generates comprehensive permission control templates.

**Permission Structure:**
```javascript
const permission = {
  allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  
  // Global hooks
  beforeOperation: [],
  afterOperation: [],
  
  // Method-specific hooks
  beforeGet: [bf1],
  beforePost: [bf1],
  beforePut: [bf1],
  beforePatch: [bf1],
  beforeDelete: [bf1],
  
  afterGet: [bf1],
  afterPost: [bf1],
  afterPut: [bf1],
  afterPatch: [bf1],
  afterDelete: [bf1]
}
```

**Hook Functions:**
- Must throw errors in format: `{custom: true, message: "", status: 401}`
- Run before/after specific HTTP operations
- Enable fine-grained access control

## Configuration

### Required Configuration File
The tool requires a `tajiri.config` file with the following structure:

```javascript
{
  "base": "src",              // Base directory for generated files
  "type": "module",           // "module" or "commonjs"
  "fieldSkip": ["id", "createdAt", "updatedAt"]  // Fields to exclude
}
```

### Generated Configurations

#### Field Configuration (`field.json`)
Contains the model's field definitions from Prisma schema, excluding skipped fields.

#### Include Configuration (`include.json`)
Defines related models to include in queries (Prisma includes).

#### Search Configuration (`search.json`)
```json
{
  "fuzzy": [],  // Fields for fuzzy search
  "pg": []      // Fields for PostgreSQL full-text search
}
```

## Usage

### Prerequisites
1. Prisma ORM configured in your project
2. Valid `tajiri.config` file
3. Initialized project structure


### Generated Output
For each Prisma model, the tool creates:
1. A dedicated folder structure
2. Six configuration files (field.json, include.json, permission.js, csv.js, pdf.js, search.json)
3. Proper module exports based on configuration

## Error Handling

The generator includes comprehensive error handling:
- **Missing Configuration**: Alerts if `tajiri.config` is not found
- **Structure Issues**: Warns if project structure is not initialized
- **Model Mismatches**: Skips models not found in Prisma schema
- **File Conflicts**: Skips existing files to prevent overwrites

## Integration Points

### Prisma Integration
- Reads models from Prisma schema
- Extracts field definitions and relationships
- Supports complex model structures

### Module System Compatibility
- Automatically detects and generates appropriate export syntax
- Supports both ES6 modules and CommonJS
- Configurable via `type` setting in config file

## Best Practices

1. **Configuration Management**: Keep `tajiri.config` in version control
2. **Field Exclusion**: Use `fieldSkip` to exclude auto-generated fields
3. **Permission Security**: Always implement actual permission logic in generated templates
4. **Export Customization**: Modify generated CSV/PDF templates for specific use cases
5. **Search Optimization**: Configure appropriate search fields based on use cases

## Troubleshooting

### Common Issues
- **"Failed to read tajiri.config file"**: Ensure config file exists and is properly formatted
- **"Failed to gen structure array"**: Run initialization command first
- **"Model not found"**: Verify Prisma schema matches expected model names
- **Permission errors**: Check error format in permission functions

### Debug Tips
- Check console output for detailed error messages
- Verify file permissions in target directories
- Ensure Prisma schema is up to date
- Validate configuration file syntax

## Future Enhancements

The codebase includes commented sections for:
- Interactive prompts for selective generation
- Overwrite options for existing files
- Enhanced CLI experience

This folder provides a rapid CRUD API development with built-in export and permission capabilities.