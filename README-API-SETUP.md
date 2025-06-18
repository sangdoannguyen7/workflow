# Property Management System - API Setup Guide

## 🎯 Overview

This frontend is now connected to real API endpoints at `http://localhost:8080`. The response format has been updated to match your backend API structure.

## 📋 API Response Format

All APIs now return data in this format:

```json
{
    "data": [...],
    "success": true,
    "total": 1,
    "pageSize": 20,
    "current": 1
}
```

## 🚀 Quick Setup

### 1. Start Backend Server

Ensure your backend is running on `http://localhost:8080`

### 2. Create Mock Data (Optional)

Run the provided curl script to populate your database:

```bash
# Make the script executable (Linux/Mac)
chmod +x mock-data-curl.sh

# Run the script
./mock-data-curl.sh
```

**Or manually run these curl commands:**

#### Create Agents:

```bash
curl -X POST "http://localhost:8080/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "WEBHOOK",
    "agentName": "Webhook Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for handling webhook requests"
  }'

curl -X POST "http://localhost:8080/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "SCHEDULE",
    "agentName": "Schedule Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for scheduled tasks"
  }'

curl -X POST "http://localhost:8080/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "API",
    "agentName": "REST API Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for REST API calls"
  }'
```

#### Create Templates:

```bash
curl -X POST "http://localhost:8080/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "WEBHOOK_RECEIVE",
    "templateName": "Webhook Receiver",
    "agentCode": "WEBHOOK",
    "agentName": "Webhook Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for receiving webhooks"
  }'

curl -X POST "http://localhost:8080/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "SCHEDULE_DAILY",
    "templateName": "Daily Schedule",
    "agentCode": "SCHEDULE",
    "agentName": "Schedule Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for daily scheduled tasks"
  }'

curl -X POST "http://localhost:8080/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "API_GET",
    "templateName": "REST API GET",
    "agentCode": "API",
    "agentName": "REST API Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for GET API calls"
  }'
```

#### Create Workflows:

```bash
curl -X POST "http://localhost:8080/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Hotel Booking Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for processing hotel bookings",
    "nodes": []
  }'

curl -X POST "http://localhost:8080/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Notification Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for sending notifications",
    "nodes": []
  }'
```

### 3. Start Frontend

```bash
yarn dev
```

## 📱 How to Use

### 🏠 Main Interface

Navigate to: `http://localhost:5173/management`

This gives you 5 tabs:

1. **Agents** - Manage agents
2. **Templates** - Manage templates
3. **Nodes** - View nodes (created via Workflow Builder)
4. **Workflows** - Manage workflows
5. **Workflow Builder** - Visual workflow designer

### 🎨 Workflow Builder Features

#### ✨ Drag & Drop

1. Select a workflow from dropdown
2. Drag templates from left sidebar to canvas
3. Connect nodes by dragging between handles
4. Click nodes to see properties
5. Save workflow

#### 🔧 Node Properties Storage

- All node properties are stored in the `info` field as JSON
- Position data stored in `metadata` field
- Connection data stored in `rule` field

#### 🎯 Template Types

- **🔗 Webhook** (Green): webhook templates
- **⏰ Schedule** (Blue): schedule templates
- **🌐 REST API** (Orange): API call templates

## 🔧 API Endpoints Used

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| GET    | `/v1/property/agents`           | Get all agents       |
| GET    | `/v1/property/templates`        | Get all templates    |
| GET    | `/v1/property/workflows`        | Get all workflows    |
| GET    | `/v1/property/workflows/{code}` | Get workflow by code |
| POST   | `/v1/property/workflows`        | Create workflow      |
| PATCH  | `/v1/property/workflows/{code}` | Update workflow      |
| DELETE | `/v1/property/workflows/{code}` | Delete workflow      |

## 🐛 Troubleshooting

### Data Not Loading?

1. Check backend is running on `localhost:8080`
2. Check browser console for CORS errors
3. Verify API endpoints are accessible
4. Check network tab in browser dev tools

### CORS Issues?

Add this to your backend Spring Boot configuration:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Template Types Not Showing?

The system auto-detects template types based on:

- Template code contains "webhook" → webhook type
- Template code contains "schedule" → schedule type
- Template code contains "api" → restapi type
- Default → restapi type

## 📊 Sample Data

The mock script creates:

- ✅ 3 Agents (WEBHOOK, SCHEDULE, API)
- ✅ 6 Templates (2 webhook, 2 schedule, 2 api)
- ✅ 5 Workflows (including one with sample nodes)

## 🎉 Features Working

- ✅ **Full CRUD** on all entities
- ✅ **Drag & Drop** workflow builder
- ✅ **Node connections** with visual handles
- ✅ **Properties storage** in info field
- ✅ **Save/Load** workflow designs
- ✅ **Real API integration**
- ✅ **Responsive design**
- ✅ **Light/Dark mode** support

## 🔗 Quick Links

- Main Management: `/management`
- Agents Only: `/agent`
- Templates Only: `/template`
- Workflows Only: `/workflow`
- Builder Only: `/workflow-builder`

**Note:** The Workflow Builder is the main feature - it allows drag & drop template creation and visual workflow design!
