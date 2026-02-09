# CMS CSV Importer

Re:Earth Visualizer plugin for importing CSV data to CMS.

## ⚠️ Security Notice

**Do not use this plugin in published projects.** The API token configured in the widget inspector is visible in published projects, which poses a security risk.

**Best Practices:**

- Use this plugin only in the map editing screen
- Never publish projects with this plugin enabled
- Remove or disable the plugin before publishing your project

## Features

- 📊 CSV file import to CMS
- 🔄 Automatic schema-based field mapping
- 📈 Real-time progress tracking
- ⚠️ Error handling and validation
- 📋 Detailed error logs

## Usage

### 1. Configure Settings

Open the widget inspector and configure:

- **Base URL**: CMS API endpoint (default: `https://api.cms.reearth.io/api`)
- **Workspace ID**: Your workspace ID
- **Project ID**: Your project ID
- **Model ID**: Target model ID
- **Integration API Token**: Your API token

### 2. Import CSV

1. Select your CSV file
2. Click "Import CSV to CMS"
3. Monitor the progress
4. Review results

### CSV Format

- First row must contain header names
- Column names should match model field keys
- Columns not in schema will be skipped

**Example:**

```csv
name,description,price
Product A,Description A,1000
Product B,Description B,2000
```

## Development

```bash
# Start dev server
yarn dev:csvImporter:main

# Build plugin
yarn build
```

## Tech Stack

- React 19 + TypeScript
- Vite 6
- TailwindCSS 4
- Radix UI / ShadCN
