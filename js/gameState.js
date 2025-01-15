export class GameState {
  constructor() {
    this.minerals = {
      coal: 0,
      copper: 0,
      iron: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
      emerald: 0,
      ruby: 0,
      sapphire: 0,
      platinum: 0
    };
    
    this.miners = {};
    this.lastUpdate = Date.now();
  }

  addMineral(type, amount) {
    this.minerals[type] += amount;
  }

  getMineral(type) {
    return this.minerals[type];
  }

  saveGame() {
    const saveData = {
      minerals: this.minerals,
      miners: this.miners,
      lastUpdate: Date.now()
    };
    localStorage.setItem('mineralTycoonSave', JSON.stringify(saveData));
  }

  loadGame() {
    const savedGame = localStorage.getItem('mineralTycoonSave');
    if (savedGame) {
      const saveData = JSON.parse(savedGame);
      this.minerals = saveData.minerals;
      this.miners = saveData.miners;
      this.lastUpdate = saveData.lastUpdate;
    }
  }
}