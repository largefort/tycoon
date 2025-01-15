export class MinerManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.lastUpdate = Date.now();
    this.minerTypes = {
      novice: {
        name: 'Novice Miner',
        cost: 10,
        production: {
          coal: 0.1,
          copper: 0.05
        }
      },
      experienced: {
        name: 'Experienced Miner',
        cost: 50,
        production: {
          iron: 0.1,
          silver: 0.05
        }
      },
      expert: {
        name: 'Expert Miner',
        cost: 200,
        production: {
          gold: 0.05,
          diamond: 0.01
        }
      },
      master: {
        name: 'Master Miner',
        cost: 1000,
        production: {
          emerald: 0.02,
          ruby: 0.02,
          sapphire: 0.02,
          platinum: 0.01
        }
      }
    };
  }

  hireMiner(type) {
    const minerInfo = this.minerTypes[type];
    if (!this.gameState.miners[type]) {
      this.gameState.miners[type] = 0;
    }
    this.gameState.miners[type]++;
  }

  update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdate) / 1000; // Convert to seconds
    
    Object.entries(this.gameState.miners).forEach(([type, count]) => {
      const production = this.minerTypes[type].production;
      Object.entries(production).forEach(([mineral, amount]) => {
        // Calculate production based on actual time elapsed
        const produced = amount * count * deltaTime;
        this.gameState.addMineral(mineral, produced);
      });
    });
    
    this.lastUpdate = currentTime;
  }

  calculateOfflineProduction(elapsedTime) {
    const production = {};
    Object.entries(this.gameState.miners).forEach(([type, count]) => {
      const minerProduction = this.minerTypes[type].production;
      Object.entries(minerProduction).forEach(([mineral, amount]) => {
        if (!production[mineral]) production[mineral] = 0;
        production[mineral] += amount * count * (elapsedTime / 1000);
      });
    });
    return production;
  }
}