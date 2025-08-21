# GenFolderStructure Documentation

## Overview

The GenFolderStructure folder contains the logic for generating and organizing folder structures based on your Prisma models. It provides both automated "smart" folder organization and manual "general" folder structure generation, helping to organize your project's model-related files in a logical hierarchy.

## Features

- **Smart Folder Grouping**: Automatically groups related models based on naming conventions
- **General Structure**: Simple one-to-one model-to-folder mapping
- **Interactive CLI**: User-friendly prompts for structure selection and confirmation
- **Configuration Integration**: Updates and maintains tajiri.config with generated structure
- **Regeneration Support**: Allows regenerating existing folder structures
- **Prisma Integration**: Reads directly from your Prisma schema

## Purpose

This is a project initialization tool that runs as part of the `tajiri init` command. When executed, this tool:

- **Analyzes Your Models**: Reads your Prisma schema to identify all database models
- **Prompts for Structure Type**: Offers choice between Smart and General folder organization
- **Groups Related Models**: Uses intelligent grouping for models with naming patterns
- **Updates Configuration**: Saves the generated structure to your tajiri.config file
- **Prepares for CRUD Generation**: Creates the foundation for subsequent CRUD scaffolding

The generated folder structure is saved in the configuration and used by other tajiri tools to organize generated files.

## Architecture

### Core Files

#### `index.js` - Main Structure Generator
The primary orchestrator that handles the folder structure generation process.

**Key Functions:**
- `GenFolderStructure()`: Main entry point for generating folder structures
- Handles user interactions and confirmations
- Manages configuration updates

**Flow:**
1. Prompts user for generation confirmation
2. Checks for existing configuration and structures
3. Offers structure type selection (Smart vs General)
4. Generates appropriate folder structure
5. Updates tajiri.config with results

**Dependencies:**
- `@inquirer/prompts`: Interactive CLI prompts
- `chalk`: Terminal styling and colored output
- `fs`: File system operations for config updates

#### `smartFolders.js` - Intelligent Model Grouping
Generates smart folder structures by analyzing model relationships and naming patterns.

**Key Functions:**
- `SmartFolders()`: Main function that creates intelligent folder grouping
- `groupRelatedModels(models)`: Core algorithm for model organization

**Grouping Logic:**
The smart folder system groups models based on naming conventions:
- **Base Models**: Models without underscores (e.g., `User`, `Product`)
- **Related Models**: Models with underscores are grouped under their base (e.g., `User_Profile`, `User_Settings` → grouped under `User`)
- **Nested Grouping**: Multi-level relationships are supported (e.g., `Product_Category_Tag`)

**Algorithm Details:**
```javascript
// Example grouping:
Input: ["User", "User_Profile", "User_Settings", "Product", "Product_Category"]
Output: {
  "User": ["User", ["User_Profile", "User_Settings"]],
  "Product": ["Product", "Product_Category"]
}
```

## Configuration

### Structure Types

#### Smart Structure (Recommended)
- Groups related models based on naming conventions
- Creates hierarchical organization
- Reduces clutter in large projects
- Maintains logical relationships

#### General Structure
- Simple one-to-one mapping: one folder per model
- Flat structure without grouping
- Easier to understand for simple projects
- Direct model-to-folder correspondence

### Generated Configuration
The tool updates your `tajiri.config` file with a `structure` property:

```javascript
{
  "base": "src",
  "type": "module",
  "fieldSkip": ["id", "createdAt", "updatedAt"],
  "structure": {
    "User": ["User", ["User_Profile", "User_Settings"]],
    "Product": ["Product", "Product_Category"],
    "Order": "Order"
  }
}
```

## Usage

### Prerequisites
1. Prisma ORM configured in your project
2. Valid `tajiri.config` file
3. Accessible Prisma schema file

### Running the Generator
```bash
tajiri init
# Follow the interactive prompts
```

### Interactive Flow
1. **Generation Confirmation**: Choose whether to generate folder structure
2. **Regeneration Warning**: If structure exists, confirm regeneration
3. **Structure Type Selection**: Choose between Smart or General structure
4. **Automatic Processing**: Tool analyzes models and creates structure
5. **Configuration Update**: Results saved to tajiri.config

### Example Scenarios

#### Smart Grouping Example
**Prisma Models:**
```prisma
model User {
  id Int @id @default(autoincrement())
  name String
}

model User_Profile {
  id Int @id @default(autoincrement())
  userId Int
}

model User_Settings {
  id Int @id @default(autoincrement())
  userId Int
}

model Product {
  id Int @id @default(autoincrement())
  name String
}
```

**Generated Smart Structure:**
```javascript
{
  "User": ["User", ["User_Profile", "User_Settings"]],
  "Product": "Product"
}
```

#### General Structure Example
**Same Models → General Structure:**
```javascript
{
  "User": "User",
  "User_Profile": "User_Profile",
  "User_Settings": "User_Settings",
  "Product": "Product"
}
```

## Integration Points

### Prisma Integration
- Uses `getPrismaModels()` utility to read schema
- Extracts model names automatically
- Supports complex Prisma model structures

### Configuration Management
- Reads existing tajiri.config
- Preserves other configuration settings
- Updates structure property specifically
- Maintains JSON formatting

### CLI Integration
- Part of the tajiri init workflow
- Provides interactive user experience
- Colored console output for better UX
- Confirmation prompts to prevent accidents

## Smart Grouping Algorithm

### Logic Flow
1. **Sort Models**: Alphabetically sort all model names
2. **Identify Roots**: Find base models (those without underscores or that serve as prefixes)
3. **Group by Prefix**: Group models under their identified roots
4. **Handle Hierarchies**: Support multi-level underscore relationships
5. **Preserve Order**: Maintain logical organization

### Naming Convention Support
- `ModelName`: Standalone model
- `ModelName_SubModel`: Related to ModelName
- `ModelName_SubModel_Detail`: Nested relationship
- Mixed patterns supported automatically

### Edge Cases Handled
- Models with multiple underscores
- Missing base models in relationships
- Duplicate grouping attempts
- Mixed naming conventions

## Error Handling

The generator includes comprehensive error handling:
- **Missing Configuration**: Alerts if tajiri.config is not found
- **Prisma Schema Issues**: Handles missing or invalid schema files
- **File System Errors**: Manages configuration write failures
- **User Cancellation**: Graceful handling of user abort actions

## Best Practices

1. **Naming Conventions**: Use consistent underscore patterns for related models
2. **Structure Planning**: Consider your model relationships before choosing structure type
3. **Configuration Backup**: Keep tajiri.config in version control
4. **Regeneration Caution**: Understand that regeneration will overwrite existing structure
5. **Model Organization**: Group logically related models with consistent prefixes

## Troubleshooting

### Common Issues
- **"Failed to get prisma models"**: Check Prisma schema file location and syntax
- **Configuration not found**: Ensure tajiri.config exists in project root
- **Structure generation skipped**: User cancelled during prompts
- **Invalid model names**: Verify Prisma model naming follows conventions

### Debug Tips
- Check console output for detailed error messages
- Verify Prisma schema is accessible and valid
- Ensure proper file permissions for config updates
- Test with simple model structures first

## Future Enhancements

The codebase structure supports future additions:
- Custom grouping rules
- More sophisticated relationship detection
- Integration with database introspection
- Visual structure preview before generation
- Export/import structure templates

This folder provides the foundation for organized, scalable project structures that grow logically with your application's complexity.