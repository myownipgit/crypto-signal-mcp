#!/usr/bin/env node

const { MCPServer, MCPTransport } = require('@modelcontextprotocol/server');
const path = require('path');

// Import tool collections
const marketIntelligenceTools = require('./tools/marketIntelligence');
const signalGenerationTools = require('./tools/signalGeneration');
const portfolioTools = require('./tools/portfolio');
const alertTools = require('./tools/alerts');

// Create server instance
const server = new MCPServer({
  name: 'crypto-signal',
  description: 'Crypto-Signal MCP Server - Trading signals and market intelligence',
  version: '0.1.0',
});

// Register all tools
const tools = [
  ...Object.values(marketIntelligenceTools),
  ...Object.values(signalGenerationTools),
  ...Object.values(portfolioTools),
  ...Object.values(alertTools),
];

// Add tools to server
tools.forEach(tool => {
  server.addTool(tool);
});

// Determine which transport to use based on environment
const transportType = process.env.MCP_TRANSPORT || 'stdio';

// Configure transport
let transport;
if (transportType === 'stdio') {
  transport = new MCPTransport.StdioTransport();
} else if (transportType === 'http') {
  const port = process.env.MCP_PORT || 3000;
  transport = new MCPTransport.HttpTransport({ port });
  console.log(`HTTP transport running on port ${port}`);
} else {
  console.error(`Unknown transport: ${transportType}`);
  process.exit(1);
}

// Start server
server.start(transport).catch(err => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});

console.log(`Crypto-Signal MCP server started with ${transportType} transport`);