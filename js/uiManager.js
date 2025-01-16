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
        <img src="${mineral}-removebg-preview.png" alt="${mineral}" class="mineral-icon">
        <h3>${mineral.charAt(0).toUpperCase() + mineral.slice(1)}</h3>
        <p><span id="${mineral}-count">0</span></p>
        <p class="mps">per second: <span id="${mineral}-mps">0.0</span></p>
      `;
      
      mineralElement.addEventListener('click', (e) => {
        this.gameState.addMineral(mineral, 1);
        this.createClickEffects(e, mineralElement);
      });
      
      mineralsGrid.appendChild(mineralElement);
    });
  }

  createClickEffects(event, element) {
    // Create damage text
    const damageText = document.createElement('div');
    damageText.className = 'damage-text';
    damageText.textContent = '+1';
    
    // Position at click coordinates relative to element
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    damageText.style.left = x + 'px';
    damageText.style.top = y + 'px';
    
    element.appendChild(damageText);
    
    // Remove after animation
    damageText.addEventListener('animationend', () => {
      damageText.remove();
    });

    // Create particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random particle properties
      const size = Math.random() * 4 + 2;
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 20 + Math.random() * 20;
      
      // Calculate trajectory
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      element.appendChild(particle);
      
      // Remove after animation
      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    }
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