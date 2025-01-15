import { GameState } from './gameState.js';
import { MinerManager } from './minerManager.js';
import { UIManager } from './uiManager.js';
import { OfflineProgress } from './offlineProgress.js';

class Game {
  constructor() {
    this.gameState = new GameState();
    this.minerManager = new MinerManager(this.gameState);
    this.uiManager = new UIManager(this.gameState, this.minerManager);
    this.offlineProgress = new OfflineProgress(this.gameState, this.minerManager);
    
    // Make game instance globally available
    window.game = this;
    
    this.lastTick = Date.now();
    this.initialize();
  }

  initialize() {
    // Load saved game state
    this.gameState.loadGame();
    
    // Initialize UI
    this.uiManager.initializeUI();
    
    // Start game loop
    this.gameLoop();
    
    // Check for offline progress
    this.offlineProgress.checkOfflineProgress();
    
    // Save game every 30 seconds
    setInterval(() => this.gameState.saveGame(), 30000);
  }

  gameLoop() {
    const tick = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastTick;
      
      // Update game state
      this.minerManager.update();
      this.uiManager.updateDisplay();
      
      this.lastTick = currentTime;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

// Start the game
new Game();