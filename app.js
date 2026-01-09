/**
 * Main Application Logic for Delhi Ward Pollution Dashboard
 * Initializes all components and manages application state
 */

// Global state
let dataManager;
let wardMap;
let civicPanel;
let feedbackSystem;
let alertsSystem;
let gamificationSystem;
let currentWard = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Delhi Ward Pollution Dashboard...');
  
  // Initialize data manager
  dataManager = new WardDataManager();
  console.log(`Loaded ${dataManager.getAllWards().length} wards`);
  
  // Initialize components
  initializeComponents();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initial render
  renderOverview();
  
  // Start live data updates
  startLiveUpdates();
  
  console.log('Dashboard initialized successfully!');
});

function initializeComponents() {
  // Initialize ward map
  wardMap = new DelhiWardMap('wardMapContainer', dataManager);
  wardMap.onWardSelect = (ward) => {
    currentWard = ward;
    onWardSelected(ward);
  };
  window.wardMap = wardMap; // Make globally accessible
  
  // Initialize civic accountability panel
  civicPanel = new CivicAccountabilityPanel('civicAccountabilityPanel');
  window.civicPanel = civicPanel;
  
  // Initialize citizen feedback system
  feedbackSystem = new CitizenFeedbackSystem('citizenFeedbackPanel', dataManager);
  window.feedbackSystem = feedbackSystem;
  
  // Initialize alerts and insights
  alertsSystem = new AlertsAndInsightsSystem('alertsInsightsPanel', dataManager);
  window.alertsSystem = alertsSystem;
  
  // Initialize gamification system
  gamificationSystem = new GamificationSystem('gamificationPanel', dataManager);
  window.gamificationSystem = gamificationSystem;
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      showTab(tabName);
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('wardSearch');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        handleSearch(e.target.value);
      }, 300);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) {
        document.getElementById('searchResults').classList.remove('active');
      }
    });
  }
}

function showTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    }
  });
  
  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  const activePanel = document.getElementById(`${tabName}Tab`);
  if (activePanel) {
    activePanel.classList.add('active');
    
    // Render content based on tab
    switch (tabName) {
      case 'overview':
        renderOverview();
        break;
      case 'map':
        // Map is already rendered
        break;
      case 'civic':
        civicPanel.render(currentWard);
        break;
      case 'feedback':
        feedbackSystem.render(currentWard);
        break;
      case 'alerts':
        alertsSystem.render(currentWard);
        break;
      case 'leaderboard':
        gamificationSystem.render();
        break;
    }
  }
}

// Make showTab globally accessible
window.showTab = showTab;

function renderOverview() {
  const wards = dataManager.getAllWards();
  
  // Calculate metrics
  const avgAQI = Math.floor(wards.reduce((sum, w) => sum + w.pollution.air.aqi, 0) / wards.length);
  const avgTDS = Math.floor(wards.reduce((sum, w) => sum + w.pollution.water.tds, 0) / wards.length);
  const avgNoise = Math.floor(wards.reduce((sum, w) => sum + w.pollution.noise.level, 0) / wards.length);
  const avgWaste = Math.floor(wards.reduce((sum, w) => sum + w.pollution.waste.collectionEfficiency, 0) / wards.length);
  
  const severeWards = wards.filter(w => w.pollution.air.aqi > 300).length;
  const totalReports = wards.reduce((sum, w) => sum + w.citizenReports, 0);
  
  // Update nav stats
  document.getElementById('navAvgAQI').textContent = avgAQI;
  document.getElementById('navActiveAlerts').textContent = alertsSystem.alerts.length;
  
  // Render metrics
  const metricsContainer = document.getElementById('overviewMetrics');
  metricsContainer.innerHTML = `
    <div class="stat-card-large">
      <div class="stat-icon">🌫️</div>
      <div class="stat-content">
        <div class="stat-value">${avgAQI}</div>
        <div class="stat-label">Average AQI</div>
      </div>
    </div>
    <div class="stat-card-large">
      <div class="stat-icon">💧</div>
      <div class="stat-content">
        <div class="stat-value">${avgTDS}</div>
        <div class="stat-label">Avg Water TDS (ppm)</div>
      </div>
    </div>
    <div class="stat-card-large">
      <div class="stat-icon">🔊</div>
      <div class="stat-content">
        <div class="stat-value">${avgNoise}</div>
        <div class="stat-label">Avg Noise Level (dB)</div>
      </div>
    </div>
    <div class="stat-card-large">
      <div class="stat-icon">♻️</div>
      <div class="stat-content">
        <div class="stat-value">${avgWaste}%</div>
        <div class="stat-label">Avg Waste Collection</div>
      </div>
    </div>
    <div class="stat-card-large">
      <div class="stat-icon">🚨</div>
      <div class="stat-content">
        <div class="stat-value">${severeWards}</div>
        <div class="stat-label">Severe AQI Wards</div>
      </div>
    </div>
    <div class="stat-card-large">
      <div class="stat-icon">👥</div>
      <div class="stat-content">
        <div class="stat-value">${totalReports}</div>
        <div class="stat-label">Total Citizen Reports</div>
      </div>
    </div>
  `;
  
  // Render mini alerts
  const miniAlertsContainer = document.getElementById('miniAlerts');
  const topAlerts = alertsSystem.alerts.slice(0, 3);
  
  if (topAlerts.length > 0) {
    miniAlertsContainer.innerHTML = `
      <h3>Recent Alerts</h3>
      ${topAlerts.map(alert => `
        <div class="alert-card alert-${alert.type}">
          <div class="alert-icon">${alert.type === 'critical' ? '🚨' : '⚠️'}</div>
          <div class="alert-content">
            <h4>${alert.title}</h4>
            <p>${alert.message}</p>
          </div>
        </div>
      `).join('')}
      <button class="btn" onclick="showTab('alerts')" style="margin-top: 12px; width: 100%;">
        View All Alerts
      </button>
    `;
  } else {
    miniAlertsContainer.innerHTML = `
      <h3>Status</h3>
      <div class="empty-state" style="padding: 20px;">
        <div class="empty-icon" style="font-size: 32px;">✅</div>
        <p style="font-size: 14px;">No critical alerts</p>
      </div>
    `;
  }
}

function onWardSelected(ward) {
  console.log('Ward selected:', ward.wardName);
  
  // Update breadcrumb
  document.getElementById('currentWardBreadcrumb').textContent = ward.wardName;
  
  // Update ward details panel
  const detailsPanel = document.getElementById('wardDetailsPanel');
  detailsPanel.innerHTML = `
    <div class="ward-details">
      <div class="ward-header">
        <h3>${ward.wardName}</h3>
        <span class="ward-code">${ward.wardCode}</span>
      </div>
      
      <div class="ward-zone-info">
        <span class="zone-label">Zone:</span>
        <strong>${ward.zone}</strong>
      </div>
      
      <div class="pollution-breakdown">
        <h4>Pollution Metrics</h4>
        
        <div class="metric-card">
          <div class="metric-header">
            <span>🌫️ Air Quality</span>
            <span class="trend-indicator ${ward.pollution.air.trend}">
              ${ward.pollution.air.trend === 'worsening' ? '📈' : ward.pollution.air.trend === 'improving' ? '📉' : '➡️'}
            </span>
          </div>
          <div class="metric-value-large aqi-${getAQIClass(ward.pollution.air.aqi)}">${ward.pollution.air.aqi}</div>
          <div class="metric-status">${ward.pollution.air.status}</div>
          <div class="metric-details">
            <span>PM2.5: ${ward.pollution.air.pm25} µg/m³</span>
            <span>PM10: ${ward.pollution.air.pm10} µg/m³</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-header">
            <span>💧 Water Quality</span>
          </div>
          <div class="metric-value-large">${ward.pollution.water.tds}</div>
          <div class="metric-status">${ward.pollution.water.status}</div>
          <div class="metric-details">
            <span>TDS (ppm)</span>
            <span>pH: ${ward.pollution.water.ph}</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-header">
            <span>🔊 Noise Level</span>
          </div>
          <div class="metric-value-large">${ward.pollution.noise.level}</div>
          <div class="metric-status">${ward.pollution.noise.status}</div>
          <div class="metric-details">
            <span>Decibels (dB)</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-header">
            <span>♻️ Waste Management</span>
          </div>
          <div class="metric-value-large">${ward.pollution.waste.collectionEfficiency}%</div>
          <div class="metric-status">${ward.pollution.waste.status}</div>
          <div class="metric-details">
            <span>Collection Efficiency</span>
            <span>Last: ${ward.pollution.waste.lastCollection}</span>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="action-btn primary" onclick="showTab('civic')">View Governance</button>
        <button class="action-btn secondary" onclick="showTab('feedback')">Report Issue</button>
      </div>
    </div>
  `;
  
  // Add styles for ward details
  if (!document.getElementById('wardDetailsStyles')) {
    const style = document.createElement('style');
    style.id = 'wardDetailsStyles';
    style.textContent = `
      .ward-details { display: flex; flex-direction: column; gap: 20px; }
      .ward-zone-info { padding: 12px; background: rgba(77, 208, 225, 0.1); border-radius: 8px; font-size: 14px; }
      .zone-label { color: var(--muted); margin-right: 8px; }
      .pollution-breakdown h4 { font-size: 16px; margin-bottom: 12px; }
      .metric-card { padding: 16px; background: #0a0d11; border-radius: 12px; border: 1px solid var(--border); }
      .metric-header { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
      .metric-value-large { font-size: 36px; font-weight: 800; margin-bottom: 4px; }
      .metric-status { color: var(--muted); font-size: 13px; margin-bottom: 8px; }
      .metric-details { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
    `;
    document.head.appendChild(style);
  }
}

function handleSearch(query) {
  const searchResults = document.getElementById('searchResults');
  
  if (query.length < 2) {
    searchResults.classList.remove('active');
    return;
  }
  
  const results = dataManager.searchWards(query);
  
  if (results.length === 0) {
    searchResults.innerHTML = '<div style="padding: 16px; color: var(--muted);">No wards found</div>';
    searchResults.classList.add('active');
    return;
  }
  
  searchResults.innerHTML = results.slice(0, 10).map(ward => `
    <div class="search-result-item" onclick="selectWardFromSearch('${ward.wardId}')">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='transparent'">
        <div>
          <strong>${ward.wardName}</strong>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">${ward.zone} · ${ward.wardCode}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: 700; color: var(--cyan);">AQI ${ward.pollution.air.aqi}</div>
          <div style="font-size: 11px; color: var(--muted);">Rank #${ward.rank}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  searchResults.classList.add('active');
}

function selectWardFromSearch(wardId) {
  const ward = dataManager.getWardById(wardId);
  if (ward) {
    showTab('map');
    setTimeout(() => {
      wardMap.selectWard(wardId);
    }, 100);
  }
  document.getElementById('searchResults').classList.remove('active');
  document.getElementById('wardSearch').value = '';
}

window.selectWardFromSearch = selectWardFromSearch;

function getAQIClass(aqi) {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'poor';
  if (aqi <= 300) return 'very-poor';
  return 'severe';
}

function startLiveUpdates() {
  // Simulate live data updates every 10 seconds
  setInterval(() => {
    // Update a random ward
    const wards = dataManager.getAllWards();
    const randomWard = wards[Math.floor(Math.random() * wards.length)];
    dataManager.updateLiveData(randomWard.wardId);
    
    // If this is the current ward, update displays
    if (currentWard && currentWard.wardId === randomWard.wardId) {
      onWardSelected(randomWard);
      wardMap.updateWardData(randomWard.wardId, randomWard.pollution);
    }
  }, 10000);
}

// Modal functions
function showAboutModal() {
  document.getElementById('aboutModal').classList.add('active');
}

function closeAboutModal() {
  document.getElementById('aboutModal').classList.remove('active');
}

window.showAboutModal = showAboutModal;
window.closeAboutModal = closeAboutModal;

// Close modal on outside click
document.addEventListener('click', (e) => {
  if (e.target.id === 'aboutModal') {
    closeAboutModal();
  }
});

console.log('App.js loaded successfully');
