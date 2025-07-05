# Crypto-Signal MCP

Model Context Protocol (MCP) server implementation for Crypto-Signal, providing advanced cryptocurrency trading signals, market analysis, and portfolio management capabilities.

## Features

- **Multi-Exchange Market Intelligence**: Aggregate and analyze data across 15+ exchanges
- **Advanced Signal Generation**: AI-enhanced technical analysis with ML model integration
- **Portfolio Optimization**: Risk-adjusted portfolio management tools
- **Intelligent Alerting System**: Context-aware notifications with social sentiment integration
- **Market Opportunity Scanner**: Detect arbitrage, anomalies, and trading opportunities

## Quick Start

```bash
# Clone the repository
git clone https://github.com/myownipgit/crypto-signal-mcp.git
cd crypto-signal-mcp

# Install dependencies
npm install

# Start MCP server
npm run start
```

## Server Architecture

This MCP server implementation uses:

- **JSON-RPC 2.0**: Standard protocol for remote procedure calls
- **Multiple Transports**: Supports both stdio (for Claude Desktop) and HTTP/WebSocket transports
- **Modular Tool Structure**: Organized by functional categories for easy extension

## MCP Tools

The server provides several tool categories:

### Market Intelligence Tools
- `getAggregatedOrderBook` - Consolidated order books across exchanges
- `getArbitrageOpportunities` - Cross-exchange price differential detection
- `analyzeLiquidity` - In-depth liquidity analysis by exchange
- `getMarketDepth` - Detailed order book and market microstructure analysis

### Signal Generation Tools
- `generateSignals` - AI-enhanced signal generation based on technical indicators
- `backtestStrategy` - Historical performance testing for trading strategies
- `optimizeStrategy` - Machine learning parameter optimization
- `detectPatterns` - Technical chart pattern recognition

### Portfolio Management Tools
- `optimizePortfolio` - Modern Portfolio Theory optimization
- `calculateVaR` - Value at Risk calculation for crypto portfolios
- `rebalancePortfolio` - Intelligent portfolio rebalancing
- `runStressTest` - Portfolio stress testing with various scenarios

### Alert System Tools
- `createSmartAlert` - Multi-condition alert creation
- `analyzeSocialSentiment` - Social media sentiment analysis
- `prioritizeAlerts` - Context-aware alert routing
- `createPredictiveAlert` - Future-oriented alerts based on ML predictions

## Configuration

Configure your MCP connection in Claude Desktop by adding to `claude_desktop_config.json`:

```json
"mcpServers": {
  "crypto-signal": {
    "command": "node",
    "args": ["/path/to/crypto-signal-mcp/server.js"],
    "env": {}
  }
}
```

Make sure to replace `/path/to/crypto-signal-mcp` with the actual path to where you cloned the repository.

## HTTP/WebSocket Usage

The server can also be started in HTTP mode:

```bash
MCP_TRANSPORT=http MCP_PORT=3000 npm start
```

This will start the server on port 3000 with both HTTP and WebSocket endpoints:

- HTTP: POST to `/rpc` with JSON-RPC request body
- WebSocket: Connect to ws://localhost:3000 and send/receive JSON-RPC messages

## Integration Examples

See the `/examples` directory for sample implementations demonstrating each feature set:

- Arbitrage Detection Dashboard
- Portfolio Optimization Visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.