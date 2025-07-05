# Installation Guide for Crypto-Signal MCP

This guide will help you set up the Crypto-Signal MCP server for integration with Claude Desktop.

## Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
- Claude Desktop application (for MCP integration)

## Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/myownipgit/crypto-signal-mcp.git
cd crypto-signal-mcp
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Claude Desktop**

Edit your Claude Desktop configuration file located at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Add the following entry to the `mcpServers` section:

```json
"crypto-signal": {
  "command": "node",
  "args": ["/full/path/to/crypto-signal-mcp/server.js"],
  "env": {}
}
```

Replace `/full/path/to/` with the actual path to where you cloned the repository.

4. **Start the MCP server**

- **For Claude Desktop integration:**  
  Claude Desktop will start the server automatically based on your configuration.

- **For standalone usage (HTTP/WebSocket mode):**
  ```bash
  # Start with HTTP/WebSocket transport on port 3000
  MCP_TRANSPORT=http MCP_PORT=3000 npm start
  ```

## Supported Transports

The server supports two transport modes:

1. **stdio** - Default mode, used by Claude Desktop for integration
2. **HTTP/WebSocket** - For standalone usage and integration with other applications

## Testing the Installation

### With Claude Desktop:

1. Restart Claude Desktop after updating the configuration
2. Open Claude Desktop and try a test query:

```
Show me the current Bitcoin price using the Crypto-Signal MCP
```

### With HTTP/WebSocket:

1. Start the server in HTTP mode as described above
2. Make a POST request to the `/rpc` endpoint:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"getArbitrageOpportunities","params":{"symbols":["BTC/USDT","ETH/USDT"],"minSpread":0.5,"includesFees":true},"id":1}' http://localhost:3000/rpc
```

## Troubleshooting

If you encounter issues with the MCP server:

1. Check that the path in your Claude Desktop config is correct
2. Ensure Node.js is in your PATH
3. Check for error messages in the terminal where the server is running
4. Try running the server manually with `npm start` to see any error output

## Adding New Tools

To add new tools to the MCP server:

1. Create a new function in the appropriate tool collection file in the `tools` directory
2. Follow the existing format with name, description, parameters, and handler
3. Export the new tool from the file
4. It will be automatically registered by the server

Example of a new tool:

```javascript
const myNewTool = {
  name: 'my_new_tool',
  description: 'Description of what this tool does',
  parameters: {
    type: 'object',
    required: ['requiredParam'],
    properties: {
      requiredParam: {
        type: 'string',
        description: 'A required parameter'
      },
      optionalParam: {
        type: 'number',
        description: 'An optional parameter'
      }
    }
  },
  handler: async ({ requiredParam, optionalParam = 42 }) => {
    // Implementation goes here
    return { result: 'Success', data: { requiredParam, optionalParam } };
  }
};

module.exports = {
  myNewTool,
  // other tools...
};
```

## Security Considerations

- The MCP server has access to execute code on your machine
- Review any modifications before deploying
- Never expose the MCP server to the public internet without proper authentication
- The HTTP/WebSocket transport should only be used on trusted networks