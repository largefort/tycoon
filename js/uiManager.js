export class UIManager {
  constructor(gameState, minerManager) {
    this.gameState = gameState;
    this.minerManager = minerManager;
  }

  initializeUI() {
    this.initializeMinerals();
    this.initializeStore();
    this.initializeMiners();
  }

  initializeMinerals() {
    const mineralsGrid = document.getElementById('minerals-grid');
    Object.keys(this.gameState.minerals).forEach(mineral => {
      const mineralElement = document.createElement('div');
      mineralElement.className = 'mineral-item';
      mineralElement.innerHTML = `
        <h3>${mineral.charAt(0).toUpperCase() + mineral.slice(1)}</h3>
        <p><span id="${mineral}-count">0</span></p>
        <p class="mps">per second: <span id="${mineral}-mps">0.0</span></p>
      `;
      mineralElement.addEventListener('click', () => {
        this.gameState.addMineral(mineral, 1);
      });
      mineralsGrid.appendChild(mineralElement);
    });
  }

  initializeStore() {
    const storeContainer = document.getElementById('store-container');
    Object.entries(this.minerManager.minerTypes).forEach(([type, info]) => {
      const storeItem = document.createElement('div');
      storeItem.className = 'store-item';
      storeItem.innerHTML = `
        <h3>${info.name}</h3>
        <p>Cost: ${info.cost}</p>
      `;
      
      // Create button with proper event listener
      const hireButton = document.createElement('button');
      hireButton.textContent = 'Hire';
      hireButton.addEventListener('click', () => this.minerManager.hireMiner(type));
      
      storeItem.appendChild(hireButton);
      storeContainer.appendChild(storeItem);
    });
  }

  initializeMiners() {
    const minersContainer = document.getElementById('miners-container');
    Object.entries(this.minerManager.minerTypes).forEach(([type, info]) => {
      const minerCard = document.createElement('div');
      minerCard.className = 'miner-card';
      minerCard.innerHTML = `
        <h3>${info.name}</h3>
        <p>Owned: <span id="${type}-count">0</span></p>
      `;
      minersContainer.appendChild(minerCard);
    });
  }

  updateDisplay() {
    // Update mineral counts with comma formatting
    Object.entries(this.gameState.minerals).forEach(([mineral, count]) => {
      const element = document.getElementById(`${mineral}-count`);
      if (element) {
        element.textContent = Math.floor(count).toLocaleString();
      }
    });

    // Update minerals per second
    const mpsRates = this.calculateMPS();
    Object.entries(mpsRates).forEach(([mineral, mps]) => {
      const element = document.getElementById(`${mineral}-mps`);
      if (element) {
        element.textContent = mps.toFixed(1);
      }
    });

    // Update miner counts
    Object.entries(this.gameState.miners).forEach(([type, count]) => {
      const element = document.getElementById(`${type}-count`);
      if (element) {
        element.textContent = count.toLocaleString();
      }
    });
  }

  calculateMPS() {
    const mpsRates = {};
    // Initialize all minerals with 0 MPS
    Object.keys(this.gameState.minerals).forEach(mineral => {
      mpsRates[mineral] = 0;
    });

    // Calculate MPS based on hired miners
    Object.entries(this.gameState.miners).forEach(([type, count]) => {
      const production = this.minerManager.minerTypes[type].production;
      Object.entries(production).forEach(([mineral, amount]) => {
        mpsRates[mineral] += amount * count;
      });
    });

    return mpsRates;
  }
}