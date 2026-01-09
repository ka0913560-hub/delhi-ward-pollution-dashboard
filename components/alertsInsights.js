/**
 * Alerts and Predictive Insights System
 * Provides real-time alerts and pollution trend predictions
 */

class AlertsAndInsightsSystem {
  constructor(containerId, dataManager) {
    this.container = document.getElementById(containerId);
    this.dataManager = dataManager;
    this.alerts = [];
    this.currentWard = null;
    
    this.initializeAlerts();
  }
  
  initializeAlerts() {
    // Generate system-wide alerts based on ward data
    const wards = this.dataManager.getAllWards();
    
    // Check for severe pollution wards
    const severeWards = wards.filter(w => w.pollution.air.aqi > 300);
    if (severeWards.length > 0) {
      this.addAlert({
        type: 'critical',
        title: 'Severe Air Quality Alert',
        message: `${severeWards.length} wards have AQI levels above 300. Avoid outdoor activities.`,
        wards: severeWards.map(w => w.wardName).slice(0, 5),
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for worsening trends
    const worseningWards = wards.filter(w => w.pollution.air.trend === 'worsening');
    if (worseningWards.length > 50) {
      this.addAlert({
        type: 'warning',
        title: 'Pollution Trend Alert',
        message: `Air quality is worsening in ${worseningWards.length} wards. Take preventive measures.`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for water quality issues
    const waterIssues = wards.filter(w => w.pollution.water.tds > 900);
    if (waterIssues.length > 0) {
      this.addAlert({
        type: 'warning',
        title: 'Water Quality Alert',
        message: `${waterIssues.length} wards have poor water quality. Use water purifiers.`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  addAlert(alert) {
    alert.id = Date.now() + Math.random();
    this.alerts.unshift(alert);
  }
  
  render(ward = null) {
    this.currentWard = ward;
    
    this.container.innerHTML = `
      <div class="alerts-panel">
        <!-- System-wide Alerts -->
        <div class="alerts-section">
          <h3>🚨 Active Alerts</h3>
          <div class="alerts-list">
            ${this.renderAlerts()}
          </div>
        </div>
        
        <!-- Ward-specific Insights -->
        ${ward ? this.renderWardInsights(ward) : this.renderGeneralInsights()}
        
        <!-- Predictive Analysis -->
        ${ward ? this.renderPredictiveAnalysis(ward) : ''}
      </div>
    `;
  }
  
  renderAlerts() {
    if (this.alerts.length === 0) {
      return `
        <div class="alert-card alert-info">
          <div class="alert-icon">✅</div>
          <div class="alert-content">
            <h4>All Clear</h4>
            <p>No critical alerts at this time</p>
          </div>
        </div>
      `;
    }
    
    return this.alerts.map(alert => `
      <div class="alert-card alert-${alert.type}">
        <div class="alert-icon">${this.getAlertIcon(alert.type)}</div>
        <div class="alert-content">
          <h4>${alert.title}</h4>
          <p>${alert.message}</p>
          ${alert.wards ? `
            <div class="affected-wards">
              <small>Affected: ${alert.wards.join(', ')}${alert.wards.length > 5 ? '...' : ''}</small>
            </div>
          ` : ''}
          <span class="alert-time">${this.getTimeAgo(alert.timestamp)}</span>
        </div>
        <button class="alert-dismiss" onclick="alertsSystem.dismissAlert('${alert.id}')">×</button>
      </div>
    `).join('');
  }
  
  renderWardInsights(ward) {
    const insights = this.generateWardInsights(ward);
    
    return `
      <div class="insights-section">
        <h3>💡 Ward Insights - ${ward.wardName}</h3>
        <div class="insights-grid">
          ${insights.map(insight => `
            <div class="insight-card insight-${insight.type}">
              <div class="insight-icon">${insight.icon}</div>
              <div class="insight-content">
                <h5>${insight.title}</h5>
                <p>${insight.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  renderGeneralInsights() {
    const wards = this.dataManager.getAllWards();
    const avgAQI = Math.floor(wards.reduce((sum, w) => sum + w.pollution.air.aqi, 0) / wards.length);
    const topWard = wards.sort((a, b) => b.pollutionScore - a.pollutionScore)[0];
    const bottomWard = wards.sort((a, b) => a.pollutionScore - b.pollutionScore)[0];
    
    return `
      <div class="insights-section">
        <h3>💡 Delhi-wide Insights</h3>
        <div class="insights-grid">
          <div class="insight-card insight-info">
            <div class="insight-icon">📊</div>
            <div class="insight-content">
              <h5>Average AQI</h5>
              <p>Delhi's average AQI is ${avgAQI} - ${this.getAQIStatus(avgAQI)}</p>
            </div>
          </div>
          <div class="insight-card insight-success">
            <div class="insight-icon">🏆</div>
            <div class="insight-content">
              <h5>Best Performing Ward</h5>
              <p>${topWard.wardName} with score ${topWard.pollutionScore}</p>
            </div>
          </div>
          <div class="insight-card insight-warning">
            <div class="insight-icon">⚠️</div>
            <div class="insight-content">
              <h5>Needs Attention</h5>
              <p>${bottomWard.wardName} requires immediate intervention</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderPredictiveAnalysis(ward) {
    const predictions = this.generatePredictions(ward);
    
    return `
      <div class="predictions-section">
        <h3>🔮 48-Hour Forecast</h3>
        <div class="predictions-timeline">
          ${predictions.map(pred => `
            <div class="prediction-item">
              <div class="prediction-time">${pred.time}</div>
              <div class="prediction-indicator ${pred.trend}">
                ${this.getTrendIcon(pred.trend)}
              </div>
              <div class="prediction-details">
                <strong>AQI: ${pred.aqi}</strong>
                <p>${pred.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="recommendations">
          <h4>📋 Recommendations</h4>
          <ul class="recommendations-list">
            ${this.generateRecommendations(ward).map(rec => `
              <li>${rec}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }
  
  generateWardInsights(ward) {
    const insights = [];
    const { pollution } = ward;
    
    // Air quality insight
    if (pollution.air.trend === 'worsening') {
      insights.push({
        type: 'warning',
        icon: '🌫️',
        title: 'Air Quality Declining',
        description: `AQI has increased by ~10% in the last 24 hours. Current: ${pollution.air.aqi}`
      });
    } else if (pollution.air.trend === 'improving') {
      insights.push({
        type: 'success',
        icon: '🌤️',
        title: 'Air Quality Improving',
        description: `AQI showing positive trend. Current: ${pollution.air.aqi}`
      });
    }
    
    // Water quality insight
    if (pollution.water.tds > 600) {
      insights.push({
        type: 'warning',
        icon: '💧',
        title: 'Water Quality Concern',
        description: `TDS level at ${pollution.water.tds} ppm. Use water purification.`
      });
    }
    
    // Waste management insight
    if (pollution.waste.collectionEfficiency < 70) {
      insights.push({
        type: 'info',
        icon: '🗑️',
        title: 'Waste Collection',
        description: `Collection efficiency at ${pollution.waste.collectionEfficiency}%. Improvement needed.`
      });
    }
    
    // Noise pollution insight
    if (pollution.noise.level > 70) {
      insights.push({
        type: 'warning',
        icon: '🔊',
        title: 'High Noise Levels',
        description: `Noise at ${pollution.noise.level} dB. Peak hours: ${pollution.noise.peakHours.join(', ')}`
      });
    }
    
    // Performance insight
    if (ward.rank <= 50) {
      insights.push({
        type: 'success',
        icon: '⭐',
        title: 'Top Performing Ward',
        description: `Ranked #${ward.rank} out of 250 wards in pollution management.`
      });
    }
    
    return insights;
  }
  
  generatePredictions(ward) {
    const currentAQI = ward.pollution.air.aqi;
    const trend = ward.pollution.air.trend;
    
    // Simple rule-based prediction
    let multiplier = trend === 'worsening' ? 1.05 : trend === 'improving' ? 0.95 : 1.0;
    
    return [
      {
        time: 'Next 6 hours',
        aqi: Math.floor(currentAQI * multiplier),
        trend: trend,
        description: trend === 'worsening' ? 'Expected to worsen' : trend === 'improving' ? 'Expected to improve' : 'Likely to remain stable'
      },
      {
        time: 'Next 12 hours',
        aqi: Math.floor(currentAQI * Math.pow(multiplier, 2)),
        trend: trend,
        description: trend === 'worsening' ? 'Continued deterioration likely' : 'Gradual improvement expected'
      },
      {
        time: 'Next 24 hours',
        aqi: Math.floor(currentAQI * Math.pow(multiplier, 3)),
        trend: trend === 'worsening' ? 'worsening' : 'stable',
        description: 'Weather patterns may influence levels'
      },
      {
        time: 'Next 48 hours',
        aqi: Math.floor(currentAQI * Math.pow(multiplier, 4)),
        trend: 'stable',
        description: 'Long-term forecast less certain'
      }
    ];
  }
  
  generateRecommendations(ward) {
    const recommendations = [];
    const { pollution } = ward;
    
    if (pollution.air.aqi > 200) {
      recommendations.push('🏠 Stay indoors, especially vulnerable groups (children, elderly, those with respiratory conditions)');
      recommendations.push('😷 Use N95 masks if you must go outside');
      recommendations.push('🪟 Keep windows and doors closed');
    }
    
    if (pollution.water.tds > 600) {
      recommendations.push('💧 Use RO water purifiers for drinking water');
      recommendations.push('🧪 Regular water quality testing recommended');
    }
    
    if (pollution.noise.level > 70) {
      recommendations.push('🎧 Use ear protection during peak hours');
      recommendations.push('🔇 Minimize exposure to loud areas');
    }
    
    if (pollution.waste.collectionEfficiency < 70) {
      recommendations.push('♻️ Practice waste segregation at source');
      recommendations.push('📞 Report missed collections to ${ward.governance.councillor.contact}');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Current pollution levels are manageable');
      recommendations.push('🌱 Support local environmental initiatives');
    }
    
    return recommendations;
  }
  
  getAlertIcon(type) {
    const icons = {
      'critical': '🚨',
      'warning': '⚠️',
      'info': 'ℹ️',
      'success': '✅'
    };
    return icons[type] || 'ℹ️';
  }
  
  getTrendIcon(trend) {
    const icons = {
      'worsening': '📈',
      'improving': '📉',
      'stable': '➡️'
    };
    return icons[trend] || '➡️';
  }
  
  getAQIStatus(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Very Poor";
    return "Severe";
  }
  
  getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    return `${Math.floor(diffMins / 60)} hours ago`;
  }
  
  dismissAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id != alertId);
    this.render(this.currentWard);
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlertsAndInsightsSystem;
} else {
  window.AlertsAndInsightsSystem = AlertsAndInsightsSystem;
}
