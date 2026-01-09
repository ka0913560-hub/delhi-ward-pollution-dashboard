/**
 * Interactive Ward Map Component for Delhi
 * Handles ward visualization, selection, and interaction
 */

class DelhiWardMap {
  constructor(containerId, dataManager) {
    this.container = document.getElementById(containerId);
    this.dataManager = dataManager;
    this.selectedWardId = null;
    this.onWardSelect = null;
    
    this.init();
  }
  
  init() {
    this.createMapStructure();
    this.renderWards();
    this.setupInteractions();
  }
  
  createMapStructure() {
    this.container.innerHTML = `
      <div class="map-container">
        <div class="map-header">
          <h3>Delhi Ward Map</h3>
          <div class="map-legend">
            <div class="legend-item"><span class="legend-color good"></span> Good (0-50)</div>
            <div class="legend-item"><span class="legend-color moderate"></span> Moderate (51-100)</div>
            <div class="legend-item"><span class="legend-color poor"></span> Poor (101-200)</div>
            <div class="legend-item"><span class="legend-color severe"></span> Severe (200+)</div>
          </div>
        </div>
        <div class="map-canvas" id="mapCanvas">
          <svg id="wardMapSVG" width="100%" height="500" viewBox="0 0 800 600">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g id="wardsGroup"></g>
          </svg>
        </div>
        <div class="map-info" id="mapInfo">
          <p class="map-hint">Click on any ward to view detailed pollution data</p>
        </div>
      </div>
    `;
  }
  
  renderWards() {
    const svg = document.getElementById('wardsGroup');
    const wards = this.dataManager.getAllWards();
    
    // Create a grid layout for wards (simplified representation)
    // In production, this would use actual geographic boundaries
    const cols = 20;
    const rows = Math.ceil(wards.length / cols);
    const cellWidth = 800 / cols;
    const cellHeight = 600 / rows;
    
    wards.forEach((ward, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      // Create ward polygon (simplified as rectangles)
      const wardElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      wardElement.setAttribute('x', x + 1);
      wardElement.setAttribute('y', y + 1);
      wardElement.setAttribute('width', cellWidth - 2);
      wardElement.setAttribute('height', cellHeight - 2);
      wardElement.setAttribute('class', `ward-cell ${this.getAQIClass(ward.pollution.air.aqi)}`);
      wardElement.setAttribute('data-ward-id', ward.wardId);
      wardElement.setAttribute('data-ward-name', ward.wardName);
      wardElement.setAttribute('data-aqi', ward.pollution.air.aqi);
      
      // Add tooltip title
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${ward.wardName}\nAQI: ${ward.pollution.air.aqi}\nStatus: ${ward.pollution.air.status}`;
      wardElement.appendChild(title);
      
      svg.appendChild(wardElement);
    });
  }
  
  getAQIClass(aqi) {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 200) return 'aqi-poor';
    if (aqi <= 300) return 'aqi-very-poor';
    return 'aqi-severe';
  }
  
  setupInteractions() {
    const svg = document.getElementById('wardMapSVG');
    
    svg.addEventListener('click', (e) => {
      if (e.target.classList.contains('ward-cell')) {
        const wardId = e.target.getAttribute('data-ward-id');
        this.selectWard(wardId);
      }
    });
    
    // Hover effects
    svg.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('ward-cell')) {
        e.target.style.filter = 'url(#glow)';
        e.target.style.opacity = '0.8';
        
        const wardName = e.target.getAttribute('data-ward-name');
        const aqi = e.target.getAttribute('data-aqi');
        this.showHoverInfo(wardName, aqi);
      }
    });
    
    svg.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('ward-cell')) {
        e.target.style.filter = '';
        e.target.style.opacity = '1';
        this.hideHoverInfo();
      }
    });
  }
  
  showHoverInfo(wardName, aqi) {
    const mapInfo = document.getElementById('mapInfo');
    mapInfo.innerHTML = `
      <div class="hover-info">
        <strong>${wardName}</strong>
        <span class="aqi-badge ${this.getAQIClass(aqi)}">AQI: ${aqi}</span>
      </div>
    `;
  }
  
  hideHoverInfo() {
    const mapInfo = document.getElementById('mapInfo');
    if (!this.selectedWardId) {
      mapInfo.innerHTML = '<p class="map-hint">Click on any ward to view detailed pollution data</p>';
    }
  }
  
  selectWard(wardId) {
    // Remove previous selection
    document.querySelectorAll('.ward-cell').forEach(cell => {
      cell.classList.remove('selected');
    });
    
    // Add selection to new ward
    const wardElement = document.querySelector(`[data-ward-id="${wardId}"]`);
    if (wardElement) {
      wardElement.classList.add('selected');
      this.selectedWardId = wardId;
      
      // Trigger callback
      if (this.onWardSelect) {
        const ward = this.dataManager.getWardById(wardId);
        this.onWardSelect(ward);
      }
      
      // Update map info
      this.updateMapInfo(wardId);
    }
  }
  
  updateMapInfo(wardId) {
    const ward = this.dataManager.getWardById(wardId);
    const mapInfo = document.getElementById('mapInfo');
    
    mapInfo.innerHTML = `
      <div class="selected-ward-info">
        <div class="ward-header">
          <h4>${ward.wardName}</h4>
          <span class="ward-code">${ward.wardCode}</span>
        </div>
        <div class="quick-stats">
          <div class="stat">
            <span class="stat-label">AQI</span>
            <span class="stat-value ${this.getAQIClass(ward.pollution.air.aqi)}">${ward.pollution.air.aqi}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Water TDS</span>
            <span class="stat-value">${ward.pollution.water.tds} ppm</span>
          </div>
          <div class="stat">
            <span class="stat-label">Noise</span>
            <span class="stat-value">${ward.pollution.noise.level} dB</span>
          </div>
          <div class="stat">
            <span class="stat-label">Ward Rank</span>
            <span class="stat-value">#${ward.rank}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  highlightWardsByStatus(status) {
    document.querySelectorAll('.ward-cell').forEach(cell => {
      const aqi = parseInt(cell.getAttribute('data-aqi'));
      const wardStatus = this.getAQIStatus(aqi);
      
      if (status === 'all' || wardStatus === status) {
        cell.style.opacity = '1';
      } else {
        cell.style.opacity = '0.2';
      }
    });
  }
  
  getAQIStatus(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Very Poor";
    return "Severe";
  }
  
  resetHighlight() {
    document.querySelectorAll('.ward-cell').forEach(cell => {
      cell.style.opacity = '1';
    });
  }
  
  updateWardData(wardId, pollutionData) {
    const wardElement = document.querySelector(`[data-ward-id="${wardId}"]`);
    if (wardElement) {
      wardElement.setAttribute('data-aqi', pollutionData.air.aqi);
      wardElement.className = `ward-cell ${this.getAQIClass(pollutionData.air.aqi)}`;
      
      if (this.selectedWardId === wardId) {
        this.updateMapInfo(wardId);
      }
    }
  }
  
  searchAndHighlight(query) {
    const wards = this.dataManager.searchWards(query);
    
    document.querySelectorAll('.ward-cell').forEach(cell => {
      cell.style.opacity = '0.2';
    });
    
    wards.forEach(ward => {
      const element = document.querySelector(`[data-ward-id="${ward.wardId}"]`);
      if (element) {
        element.style.opacity = '1';
        element.style.filter = 'url(#glow)';
      }
    });
    
    return wards;
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DelhiWardMap;
} else {
  window.DelhiWardMap = DelhiWardMap;
}
