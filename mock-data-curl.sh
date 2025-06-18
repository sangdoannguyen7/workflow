#!/bin/bash

# Mock data CURL commands for Property Management API
# Base URL: http://172.16.5.100:8082

echo "Creating mock data for Property Management API..."

# Create Agents
echo "Creating Agents..."

curl -X POST "http://172.16.5.100:8082/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "WEBHOOK",
    "agentName": "Webhook Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for handling webhook requests"
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "SCHEDULE",
    "agentName": "Schedule Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for scheduled tasks"
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/agents" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "API",
    "agentName": "REST API Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Agent for REST API calls"
  }'

# Create Templates
echo "Creating Templates..."

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
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

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "WEBHOOK_SEND",
    "templateName": "Webhook Sender",
    "agentCode": "WEBHOOK",
    "agentName": "Webhook Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for sending webhooks"
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
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

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "SCHEDULE_HOURLY",
    "templateName": "Hourly Schedule",
    "agentCode": "SCHEDULE",
    "agentName": "Schedule Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for hourly scheduled tasks"
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
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

curl -X POST "http://172.16.5.100:8082/v1/property/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "templateCode": "API_POST",
    "templateName": "REST API POST",
    "agentCode": "API",
    "agentName": "REST API Agent",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Template for POST API calls"
  }'

# Create Workflows
echo "Creating Workflows..."

curl -X POST "http://172.16.5.100:8082/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Hotel Booking Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for processing hotel bookings",
    "nodes": []
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Notification Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for sending notifications",
    "nodes": []
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Data Sync Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for data synchronization",
    "nodes": []
  }'

curl -X POST "http://172.16.5.100:8082/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Daily Report Workflow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Workflow for generating daily reports",
    "nodes": []
  }'

# Create sample workflow with nodes
echo "Creating sample workflow with nodes..."

curl -X POST "http://172.16.5.100:8082/v1/property/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "Complete Booking Flow",
    "statusCode": "ACTIVE",
    "statusName": "Active",
    "description": "Complete hotel booking process with all steps",
    "nodes": [
      {
        "nodeCode": "node_start",
        "nodeName": "Booking Start",
        "templateCode": "WEBHOOK_RECEIVE",
        "templateName": "Webhook Receiver",
        "typeCode": "webhook",
        "typeName": "Webhook",
        "agentCode": "WEBHOOK",
        "agentName": "Webhook Agent",
        "description": "Receive booking request via webhook",
        "search": "booking start webhook receive",
        "metadata": "{\"position\": {\"x\": 100, \"y\": 100}}",
        "info": "{\"timeout\": 30000, \"retries\": 3}",
        "schema": "",
        "body": "",
        "rule": "{\"edges\": [{\"source\": \"node_start\", \"target\": \"node_validate\"}]}",
        "configuration": "",
        "outputCode": "booking_data"
      },
      {
        "nodeCode": "node_validate",
        "nodeName": "Validate Booking",
        "templateCode": "API_GET",
        "templateName": "REST API GET",
        "typeCode": "restapi",
        "typeName": "REST API",
        "agentCode": "API",
        "agentName": "REST API Agent",
        "description": "Validate booking data through API",
        "search": "validate booking api get",
        "metadata": "{\"position\": {\"x\": 350, \"y\": 100}}",
        "info": "{\"timeout\": 15000, \"retries\": 2}",
        "schema": "",
        "body": "",
        "rule": "{\"edges\": [{\"source\": \"node_validate\", \"target\": \"node_confirm\"}]}",
        "configuration": "",
        "outputCode": "validation_result"
      },
      {
        "nodeCode": "node_confirm",
        "nodeName": "Send Confirmation",
        "templateCode": "WEBHOOK_SEND",
        "templateName": "Webhook Sender",
        "typeCode": "webhook",
        "typeName": "Webhook",
        "agentCode": "WEBHOOK",
        "agentName": "Webhook Agent",
        "description": "Send confirmation to customer",
        "search": "send confirmation webhook",
        "metadata": "{\"position\": {\"x\": 600, \"y\": 100}}",
        "info": "{\"timeout\": 10000, \"retries\": 3}",
        "schema": "",
        "body": "",
        "rule": "{\"edges\": []}",
        "configuration": "",
        "outputCode": "confirmation_sent"
      }
    ]
  }'

echo "Mock data creation completed!"

# Test queries
echo "Testing data retrieval..."

echo "Getting all agents:"
curl -X GET "http://172.16.5.100:8082/v1/property/agents?current=1&pageSize=20"

echo -e "\n\nGetting all templates:"
curl -X GET "http://172.16.5.100:8082/v1/property/templates?current=1&pageSize=20"

echo -e "\n\nGetting all workflows:"
curl -X GET "http://172.16.5.100:8082/v1/property/workflows?current=1&pageSize=20"

echo -e "\n\nMock data setup complete!"
