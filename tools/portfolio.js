/**
 * Portfolio Management Tools
 * 
 * Provides portfolio optimization, risk management, and rebalancing functionality.
 */

// Tool for portfolio optimization
const optimizePortfolio = {
  name: 'optimize_portfolio',
  description: 'Optimize cryptocurrency portfolio using Modern Portfolio Theory',
  parameters: {
    type: 'object',
    required: ['assets', 'objective'],
    properties: {
      assets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            weight: { type: 'number' }
          }
        },
        description: 'Assets to include in portfolio'
      },
      constraints: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            value: { type: 'number' }
          }
        },
        description: 'Optimization constraints'
      },
      objective: {
        type: 'string',
        enum: ['minRisk', 'maxSharpe', 'riskParity'],
        description: 'Optimization objective'
      },
      rebalanceFrequency: {
        type: 'string',
        description: 'How often to rebalance the portfolio'
      }
    }
  },
  handler: async ({ assets, constraints = [], objective, rebalanceFrequency = 'monthly' }) => {
    try {
      // Demo implementation - would use real optimization in production
      
      // Generate optimized weights based on the objective
      const totalWeight = assets.reduce((sum, asset) => sum + asset.weight, 0);
      const currentWeights = assets.map(asset => ({
        symbol: asset.symbol,
        currentWeight: (asset.weight / totalWeight) * 100
      }));
      
      let optimizedWeights;
      if (objective === 'minRisk') {
        // For minimum risk, allocate more to less volatile assets
        optimizedWeights = {
          'BTC': 45,
          'ETH': 25,
          'USDT': 15,
          'SOL': 5,
          'LINK': 5,
          'MATIC': 5
        };
      } else if (objective === 'maxSharpe') {
        // For maximum Sharpe ratio, optimize risk/return
        optimizedWeights = {
          'BTC': 35,
          'ETH': 30,
          'USDT': 5,
          'SOL': 15,
          'LINK': 10,
          'MATIC': 5
        };
      } else if (objective === 'riskParity') {
        // For risk parity, distribute risk equally
        optimizedWeights = {
          'BTC': 20,
          'ETH': 20,
          'USDT': 30,
          'SOL': 10,
          'LINK': 10,
          'MATIC': 10
        };
      }
      
      // Format the optimized portfolio
      const optimizedPortfolio = {
        objective,
        currentAllocation: currentWeights,
        optimizedAllocation: Object.entries(optimizedWeights).map(([symbol, weight]) => ({
          symbol,
          optimizedWeight: weight,
          changeFromCurrent: weight - (currentWeights.find(a => a.symbol === symbol)?.currentWeight || 0)
        })),
        expectedPerformance: {
          annualizedReturn: 32.4,
          annualizedVolatility: 28.5,
          sharpeRatio: 1.14,
          maxDrawdown: -25.8
        },
        improvementMetrics: {
          returnChange: '+2.8%',
          riskChange: '-4.5%',
          sharpeRatioChange: '+0.18'
        },
        rebalancingPlan: {
          frequency: rebalanceFrequency,
          nextRebalance: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          driftThreshold: 5 // Percentage
        },
        rebalancingActions: [
          { symbol: 'BTC', action: 'SELL', amount: 15, reason: 'Overweight' },
          { symbol: 'ETH', action: 'BUY', amount: 5, reason: 'Underweight' },
          { symbol: 'SOL', action: 'BUY', amount: 5, reason: 'New allocation' },
          { symbol: 'MATIC', action: 'BUY', amount: 5, reason: 'New allocation' }
        ]
      };
      
      return optimizedPortfolio;
    } catch (error) {
      return {
        error: true,
        message: `Failed to optimize portfolio: ${error.message}`
      };
    }
  }
};

// Tool for risk management
const calculateVaR = {
  name: 'calculate_var',
  description: 'Calculate Value at Risk for a cryptocurrency portfolio',
  parameters: {
    type: 'object',
    required: ['portfolio', 'confidence'],
    properties: {
      portfolio: {
        type: 'object',
        properties: {
          assets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                symbol: { type: 'string' },
                amount: { type: 'number' }
              }
            }
          }
        },
        description: 'Portfolio composition'
      },
      confidence: {
        type: 'number',
        description: 'Confidence level (0-1)'
      },
      horizon: {
        type: 'number',
        description: 'Time horizon in days'
      },
      method: {
        type: 'string',
        enum: ['historical', 'monteCarlo', 'parametric'],
        description: 'VaR calculation method'
      }
    }
  },
  handler: async ({ portfolio, confidence = 0.95, horizon = 1, method = 'historical' }) => {
    try {
      // Demo implementation - would use real risk models in production
      const totalValue = portfolio.assets.reduce((sum, asset) => {
        // Dummy prices for demo
        const prices = {
          'BTC': 67850,
          'ETH': 3247,
          'USDT': 1,
          'SOL': 142,
          'LINK': 14.67,
          'MATIC': 0.82
        };
        
        return sum + (asset.amount * (prices[asset.symbol] || 0));
      }, 0);
      
      // Calculate VaR based on method and confidence
      let var95, var99, cvar95;
      if (method === 'historical') {
        var95 = totalValue * 0.058 * Math.sqrt(horizon); // 5.8% daily at 95%
        var99 = totalValue * 0.082 * Math.sqrt(horizon); // 8.2% daily at 99%
        cvar95 = totalValue * 0.072 * Math.sqrt(horizon); // 7.2% expected shortfall
      } else if (method === 'monteCarlo') {
        var95 = totalValue * 0.062 * Math.sqrt(horizon);
        var99 = totalValue * 0.088 * Math.sqrt(horizon);
        cvar95 = totalValue * 0.078 * Math.sqrt(horizon);
      } else {
        var95 = totalValue * 0.056 * Math.sqrt(horizon);
        var99 = totalValue * 0.078 * Math.sqrt(horizon);
        cvar95 = totalValue * 0.068 * Math.sqrt(horizon);
      }
      
      return {
        portfolioValue: totalValue,
        riskMetrics: {
          ValueAtRisk: {
            confidence95: var95,
            confidence99: var99,
            asPercentOfPortfolio95: (var95 / totalValue) * 100,
            asPercentOfPortfolio99: (var99 / totalValue) * 100
          },
          ConditionalVaR: {
            confidence95: cvar95,
            asPercentOfPortfolio: (cvar95 / totalValue) * 100
          },
          stressTest: {
            marketCrash30Percent: totalValue * 0.3,
            march2020Scenario: totalValue * 0.42,
            may2021Scenario: totalValue * 0.38
          }
        },
        riskContributionByAsset: portfolio.assets.map(asset => {
          // Dummy prices and risk contributions for demo
          const prices = {
            'BTC': 67850,
            'ETH': 3247,
            'USDT': 1,
            'SOL': 142,
            'LINK': 14.67,
            'MATIC': 0.82
          };
          
          const volatilities = {
            'BTC': 0.048,
            'ETH': 0.062,
            'USDT': 0.001,
            'SOL': 0.078,
            'LINK': 0.068,
            'MATIC': 0.082
          };
          
          const value = asset.amount * (prices[asset.symbol] || 0);
          return {
            symbol: asset.symbol,
            value: value,
            percentOfPortfolio: (value / totalValue) * 100,
            riskContribution: value * (volatilities[asset.symbol] || 0) * Math.sqrt(horizon),
            percentOfRisk: (value * (volatilities[asset.symbol] || 0)) / (totalValue * 0.058) * 100
          };
        }),
        methodology: {
          method: method,
          confidenceLevel: confidence * 100 + '%',
          timeHorizon: horizon + ' day(s)',
          dataUsed: '2 years of historical data'
        }
      };
    } catch (error) {
      return {
        error: true,
        message: `Failed to calculate VaR: ${error.message}`
      };
    }
  }
};

// Tool for portfolio rebalancing
const rebalancePortfolio = {
  name: 'rebalance_portfolio',
  description: 'Generate rebalancing orders for a cryptocurrency portfolio',
  parameters: {
    type: 'object',
    required: ['currentPortfolio', 'targetWeights'],
    properties: {
      currentPortfolio: {
        type: 'object',
        properties: {
          assets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                symbol: { type: 'string' },
                amount: { type: 'number' },
                currentValue: { type: 'number' }
              }
            }
          },
          totalValue: { type: 'number' }
        },
        description: 'Current portfolio composition'
      },
      targetWeights: {
        type: 'object',
        additionalProperties: { type: 'number' },
        description: 'Target portfolio weights'
      },
      threshold: {
        type: 'number',
        description: 'Minimum threshold for rebalancing (percentage)'
      },
      taxOptimization: {
        type: 'boolean',
        description: 'Whether to optimize for taxes'
      }
    }
  },
  handler: async ({ currentPortfolio, targetWeights, threshold = 5, taxOptimization = false }) => {
    try {
      // Calculate current weights
      const totalValue = currentPortfolio.totalValue || 
        currentPortfolio.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      
      const currentWeights = {};
      currentPortfolio.assets.forEach(asset => {
        currentWeights[asset.symbol] = (asset.currentValue / totalValue) * 100;
      });
      
      // Generate rebalancing orders
      const rebalancingOrders = [];
      
      // Compare current weights with target weights
      Object.entries(targetWeights).forEach(([symbol, targetWeight]) => {
        const currentWeight = currentWeights[symbol] || 0;
        const weightDiff = targetWeight - currentWeight;
        
        // Only rebalance if difference exceeds threshold
        if (Math.abs(weightDiff) >= threshold) {
          const targetValue = (targetWeight / 100) * totalValue;
          const currentValue = (currentWeight / 100) * totalValue;
          const valueChange = targetValue - currentValue;
          
          // Determine if we need to buy or sell
          const action = weightDiff > 0 ? 'BUY' : 'SELL';
          
          rebalancingOrders.push({
            symbol,
            action,
            valueChange: Math.abs(valueChange),
            percentageChange: Math.abs(weightDiff),
            fromWeight: currentWeight,
            toWeight: targetWeight
          });
        }
      });
      
      // Identify assets in current portfolio that aren't in target weights
      currentPortfolio.assets.forEach(asset => {
        if (targetWeights[asset.symbol] === undefined) {
          rebalancingOrders.push({
            symbol: asset.symbol,
            action: 'SELL',
            valueChange: asset.currentValue,
            percentageChange: currentWeights[asset.symbol],
            fromWeight: currentWeights[asset.symbol],
            toWeight: 0
          });
        }
      });
      
      // Tax optimization logic (simplified)
      if (taxOptimization) {
        // Sort sell orders by tax efficiency (dummy implementation)
        const sellOrders = rebalancingOrders.filter(order => order.action === 'SELL');
        const taxEfficiency = {
          'BTC': 0.8,
          'ETH': 0.9,
          'SOL': 0.6,
          'LINK': 0.75,
          'MATIC': 0.85
        };
        
        sellOrders.sort((a, b) => (taxEfficiency[b.symbol] || 0.5) - (taxEfficiency[a.symbol] || 0.5));
      }
      
      return {
        rebalancingOrders,
        currentPortfolioWeights: currentWeights,
        targetPortfolioWeights: targetWeights,
        totalRebalancingValue: rebalancingOrders.reduce((sum, order) => sum + order.valueChange, 0),
        estimatedTradingCosts: rebalancingOrders.reduce((sum, order) => sum + (order.valueChange * 0.001), 0), // 0.1% trading fee
        taxImplications: taxOptimization ? {
          estimatedTaxableGains: rebalancingOrders
            .filter(order => order.action === 'SELL')
            .reduce((sum, order) => sum + (order.valueChange * 0.15), 0), // 15% tax rate
          taxLossHarvesting: 'Optimized sell orders to minimize tax impact'
        } : 'Tax optimization not enabled'
      };
    } catch (error) {
      return {
        error: true,
        message: `Failed to generate rebalancing orders: ${error.message}`
      };
    }
  }
};

// Tool for portfolio stress testing
const runStressTest = {
  name: 'run_stress_test',
  description: 'Simulate portfolio performance under stress scenarios',
  parameters: {
    type: 'object',
    required: ['portfolio', 'scenarios'],
    properties: {
      portfolio: {
        type: 'object',
        description: 'Portfolio composition'
      },
      scenarios: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['market_crash_30pct', 'march_2020', 'may_2021', 'interest_rate_hike', 'regulatory_crackdown', 'custom']
        },
        description: 'Stress scenarios to simulate'
      },
      customScenario: {
        type: 'object',
        description: 'Custom scenario definition (if scenarios includes "custom")'
      }
    }
  },
  handler: async ({ portfolio, scenarios, customScenario }) => {
    try {
      // Define scenario impact factors for different assets
      const scenarioImpacts = {
        market_crash_30pct: {
          'BTC': -0.3,
          'ETH': -0.35,
          'USDT': 0,
          'SOL': -0.42,
          'LINK': -0.38,
          'MATIC': -0.44
        },
        march_2020: {
          'BTC': -0.48,
          'ETH': -0.55,
          'USDT': 0.01,
          'SOL': -0.6,
          'LINK': -0.58,
          'MATIC': -0.65
        },
        may_2021: {
          'BTC': -0.42,
          'ETH': -0.38,
          'USDT': 0,
          'SOL': -0.45,
          'LINK': -0.48,
          'MATIC': -0.52
        },
        interest_rate_hike: {
          'BTC': -0.12,
          'ETH': -0.15,
          'USDT': -0.01,
          'SOL': -0.18,
          'LINK': -0.16,
          'MATIC': -0.2
        },
        regulatory_crackdown: {
          'BTC': -0.25,
          'ETH': -0.22,
          'USDT': -0.05,
          'SOL': -0.3,
          'LINK': -0.28,
          'MATIC': -0.35
        }
      };
      
      // Process each scenario
      const stressTestResults = scenarios.map(scenario => {
        let impactFactors;
        
        if (scenario === 'custom' && customScenario) {
          impactFactors = customScenario.impactFactors;
        } else {
          impactFactors = scenarioImpacts[scenario];
        }
        
        // Calculate portfolio impact
        const assetImpacts = portfolio.assets.map(asset => {
          const impactFactor = impactFactors[asset.symbol] || -0.3; // Default impact
          const valueImpact = asset.currentValue * impactFactor;
          
          return {
            symbol: asset.symbol,
            currentValue: asset.currentValue,
            impactPercentage: impactFactor * 100,
            valueImpact: valueImpact
          };
        });
        
        const totalCurrentValue = portfolio.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
        const totalValueImpact = assetImpacts.reduce((sum, asset) => sum + asset.valueImpact, 0);
        const portfolioImpactPercentage = (totalValueImpact / totalCurrentValue) * 100;
        
        return {
          scenario,
          description: scenario.replace(/_/g, ' ').toUpperCase(),
          portfolioValueBefore: totalCurrentValue,
          portfolioValueAfter: totalCurrentValue + totalValueImpact,
          portfolioImpactPercentage,
          assetImpacts,
          recoveryEstimate: {
            estimatedRecoveryTime: '3-6 months',
            historicalRecoveryPattern: 'V-shaped recovery',
            recommendedActions: [
              'Maintain 10-15% cash reserves',
              'Set up automatic buy orders at key support levels',
              'Hedge with options if portfolio > $100K'
            ]
          }
        };
      });
      
      return {
        stressTestResults,
        timestamp: Date.now(),
        recommendations: {
          portfolioAdjustments: [
            'Increase USDT allocation by 5-10% for market crash protection',
            'Consider 5% allocation to inverse ETFs as hedge',
            'Set up trailing stops at -20% for high-volatility assets'
          ],
          riskMitigationStrategies: [
            'Implement dollar-cost averaging during downturns',
            'Diversify across market cap segments',
            'Hold 3-6 months of investment funds in stable assets'
          ]
        }
      };
    } catch (error) {
      return {
        error: true,
        message: `Failed to run stress test: ${error.message}`
      };
    }
  }
};

module.exports = {
  optimizePortfolio,
  calculateVaR,
  rebalancePortfolio,
  runStressTest
};