#!/usr/bin/env node

const express = require('express');
const WebSocket = require('ws');
const jsonrpc = require('jsonrpc-lite');
const path = require('path');
const { createServer } = require('http');

// Import tool collections
const marketIntelligenceTools = require('./tools/marketIntelligence');
const signalGenerationTools = require('./tools/signalGeneration');
const portfolioTools = require('./tools/portfolio');
const alertTools = require('./tools/alerts');

// Collect all tools
const tools = {
  ...marketIntelligenceTools,
  ...signalGenerationTools,
  ...portfolioTools,
  ...alertTools
};

// Server info
const serverInfo = {
  name: 'crypto-signal',
  description: 'Crypto-Signal MCP Server - Trading signals and market intelligence',
  version: '0.1.0'
};

// Create an Express app for HTTP transport
const app = express();
app.use(express.json());

// Handle JSON-RPC requests over HTTP
app.post('/rpc', async (req, res) => {
  try {
    const rpcRequest = req.body;
    const result = await handleRpcRequest(rpcRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: { 
        code: -32603, 
        message: 'Internal error', 
        data: error.message 
      }
    });
  }
});

// Log server startup information
console.error(`Crypto-Signal MCP server starting up...`);
console.error(`Server info: ${JSON.stringify(serverInfo)}`);
console.error(`Available tools: ${Object.keys(tools).join(', ')}`);

// Determine which transport to use based on environment
const transportType = process.env.MCP_TRANSPORT || 'stdio';
console.error(`Using transport: ${transportType}`);

// Start appropriate transport
if (transportType === 'stdio') {
  // Setup stdio transport
  process.stdin.setEncoding('utf8');
  console.error('Using stdio transport, waiting for input...');
  
  let inputBuffer = '';
  
  process.stdin.on('data', async (chunk) => {
    inputBuffer += chunk;
    
    // Process complete JSON-RPC messages
    try {
      const messages = parseBufferIntoMessages(inputBuffer);
      if (messages.length > 0) {
        // Update buffer to contain only unprocessed data
        const lastNewlinePos = inputBuffer.lastIndexOf('\n');
        if (lastNewlinePos !== -1) {
          inputBuffer = inputBuffer.substring(lastNewlinePos + 1);
        }
        
        // Process messages
        for (const message of messages) {
          const result = await handleRpcRequest(message);
          const jsonResponse = JSON.stringify(result);
          process.stdout.write(jsonResponse + '\n');
          console.error(`Sending response: ${jsonResponse}`); // Debug log
        }
      }
    } catch (error) {
      // Handle parsing error
      console.error('Error parsing input:', error);
      console.error(error.stack);
    }
  });
  
  console.log(`Crypto-Signal MCP server started with stdio transport`);
} else if (transportType === 'http') {
  // Setup HTTP and WebSocket transport
  const port = process.env.MCP_PORT || 3000;
  const server = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      try {
        const rpcRequest = JSON.parse(message);
        const result = await handleRpcRequest(rpcRequest);
        ws.send(JSON.stringify(result));
      } catch (error) {
        ws.send(JSON.stringify({ 
          error: { 
            code: -32603, 
            message: 'Internal error', 
            data: error.message 
          }
        }));
      }
    });
    
    // Send server info on connection
    ws.send(JSON.stringify({ 
      jsonrpc: '2.0', 
      result: { server: serverInfo, tools: Object.keys(tools) },
      id: null
    }));
  });
  
  // Start server
  server.listen(port, () => {
    console.log(`Crypto-Signal MCP server started with HTTP/WebSocket transport on port ${port}`);
  });
} else {
  console.error(`Unknown transport: ${transportType}`);
  process.exit(1);
}

// Helper function to parse buffer into JSON-RPC messages
function parseBufferIntoMessages(buffer) {
  console.error(`Parsing buffer: ${buffer}`);
  const lines = buffer.split('\n');
  const messages = [];
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line) {
      try {
        console.error(`Parsing line: ${line}`);
        const parsed = JSON.parse(line);
        console.error(`Successfully parsed as: ${JSON.stringify(parsed)}`);
        messages.push(parsed);
      } catch (error) {
        console.error(`Error parsing line: ${line}`);
        console.error(`Parse error: ${error.message}`);
      }
    }
  }
  
  console.error(`Parsed ${messages.length} messages`);
  return messages;
}

// Handle JSON-RPC requests
async function handleRpcRequest(request) {
  // Handle batch requests
  if (Array.isArray(request)) {
    return Promise.all(request.map(req => handleSingleRpcRequest(req)));
  } else {
    return handleSingleRpcRequest(request);
  }
}

// Handle a single JSON-RPC request
async function handleSingleRpcRequest(request) {
  if (!request.method) {
    return jsonrpc.error(request.id, jsonrpc.JsonRpcError.invalidRequest());
  }
  
  // Handle initialize method (required for Claude Desktop)
  if (request.method === 'initialize') {
    const toolList = Object.keys(tools).map(name => ({
      name,
      description: tools[name].description,
      parameters: tools[name].parameters
    }));
    
    return {
      jsonrpc: '2.0',
      result: {
        serverInfo: {
          name: serverInfo.name,
          version: serverInfo.version,
          capabilities: {}
        },
        tools: toolList
      },
      id: request.id
    };
  }
  
  // Handle system methods
  if (request.method === 'system.listTools') {
    return {
      jsonrpc: '2.0',
      result: {
        tools: Object.keys(tools).map(name => ({
          name,
          description: tools[name].description,
          parameters: tools[name].parameters
        }))
      },
      id: request.id
    };
  }
  
  if (request.method === 'system.getServerInfo') {
    return {
      jsonrpc: '2.0',
      result: serverInfo,
      id: request.id
    };
  }
  
  // Handle tool calls
  const tool = tools[request.method];
  if (!tool) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: `Method not found: ${request.method}`
      },
      id: request.id
    };
  }
  
  try {
    const result = await tool.handler(request.params || {});
    return {
      jsonrpc: '2.0',
      result,
      id: request.id
    };
  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id: request.id
    };
  }
}