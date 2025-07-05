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
# Install dependencies
npm install

# Start MCP server
npm run start
```

## MCP Tools

The server provides several tool categories:

### Market Intelligence Tools
- `get_aggregated_order_book` - Consolidated order books across exchanges
- `get_arbitrage_opportunities` - Cross-exchange price differential detection
- `analyze_liquidity` - In-depth liquidity analysis by exchange

### Signal Generation Tools
- `generate_signals` - AI-enhanced signal generation based on technical indicators
- `backtest_strategy` - Historical performance testing for trading strategies
- `optimize_strategy` - Machine learning parameter optimization

### Portfolio Management Tools
- `optimize_portfolio` - Modern Portfolio Theory optimization
- `analyze_risk` - VaR and risk assessment suite
- `rebalance_portfolio` - Intelligent portfolio rebalancing

### Alert System Tools
- `create_smart_alert` - Multi-condition alert creation
- `analyze_social_sentiment` - Social media sentiment analysis
- `prioritize_alerts` - Context-aware alert routing

## Configuration

Configure your MCP connection in Claude Desktop by adding to `claude_desktop_config.json`:

```json
"mcpServers": {
  "crypto-signal": {
    "command": "node",
    "args": ["/Users/myownip/workspace/Crypto-Signal-MCP-test1/server.js"],
    "env": {}
  }
}
```

## Integration Examples

See the `/examples` directory for sample MCP client implementations demonstrating each feature set.