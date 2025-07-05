# Installation Guide for Crypto-Signal MCP

This guide will help you set up the Crypto-Signal MCP server for integration with Claude Desktop.

## Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
- Claude Desktop application

## Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/Crypto-Signal-MCP-test1.git
cd Crypto-Signal-MCP-test1
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
  "args": ["/full/path/to/Crypto-Signal-MCP-test1/server.js"],
  "env": {}
}
```

Replace `/full/path/to/` with the actual path to where you cloned the repository.

4. **Start the MCP server (if running standalone)**

If you want to run the MCP server independently of Claude Desktop:

```bash
npm start
```

## Testing the Installation

1. Restart Claude Desktop after updating the configuration
2. Open Claude Desktop and try a test query:

```
Show me the current Bitcoin price using Crypto-Signal MCP
```

You should see Claude use the Crypto-Signal MCP tools to fetch and display information.

## Troubleshooting

If you encounter issues with the MCP server:

1. Check that the path in your Claude Desktop config is correct
2. Ensure Node.js is in your PATH
3. Check for error messages in Claude Desktop's logs
4. Try running the server manually with `npm start` to see any error output

## Configuration Options

You can customize the MCP server by editing the files in the `config` directory:

- `exchanges.json` - Configure which exchanges to connect to
- `indicators.json` - Customize technical indicators
- `alerts.json` - Default alert settings
- `portfolio.json` - Default portfolio settings

## Extending the MCP

To add new tools to the MCP server:

1. Create a new file in the `tools` directory
2. Implement your tool following the existing patterns
3. Import and register your tool in `server.js`

## Security Considerations

- The MCP server has access to execute code on your machine
- Review any modifications before deploying
- Never expose the MCP server to the public internet