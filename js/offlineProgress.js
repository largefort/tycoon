export class OfflineProgress {
  constructor(gameState, minerManager) {
    this.gameState = gameState;
    this.minerManager = minerManager;
  }

  checkOfflineProgress() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.gameState.lastUpdate;
    
    if (elapsedTime > 60000) { // Only show if more than 1 minute has passed
      const offlineProduction = this.minerManager.calculateOfflineProduction(elapsedTime);
      this.showOfflineModal(elapsedTime, offlineProduction);
    }
  }

  showOfflineModal(elapsedTime, production) {
    const modal = document.getElementById('offline-modal');
    const timeSpan = document.getElementById('offline-time');
    const gainsDiv = document.getElementById('offline-gains');
    const claimButton = document.getElementById('claim-offline');

    // Format time
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    timeSpan.textContent = `${hours}h ${minutes}m`;

    // Show gains
    gainsDiv.innerHTML = '';
    Object.entries(production).forEach(([mineral, amount]) => {
      if (amount > 0) {
        gainsDiv.innerHTML += `<p>${mineral}: +${Math.floor(amount)}</p>`;
      }
    });

    // Show modal
    modal.style.display = 'block';

    // Handle claim button
    claimButton.onclick = () => {
      Object.entries(production).forEach(([mineral, amount]) => {
        this.gameState.addMineral(mineral, amount);
      });
      modal.style.display = 'none';
    };
  }
}