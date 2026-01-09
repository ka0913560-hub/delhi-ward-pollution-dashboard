/**
 * Gamification & Leaderboard System
 * Ward rankings, pollution scores, and citizen engagement tracking
 */

class GamificationSystem {
  constructor(containerId, dataManager) {
    this.container = document.getElementById(containerId);
    this.dataManager = dataManager;
  }
  
  render() {
    const wards = this.dataManager.getAllWards();
    const topWards = this.dataManager.getTopWards(10);
    const bottomWards = this.dataManager.getBottomWards(5);
    const stats = this.calculateOverallStats(wards);
    
    this.container.innerHTML = `
      <div class="gamification-panel">
        <div class="panel-header">
          <h2>🏆 Ward Leaderboard & Performance</h2>
          <p class="subtitle">Delhi's 250 wards ranked by environmental performance</p>
        </div>
        
        <!-- Overall Stats -->
        <div class="overall-stats">
          <div class="stat-card-large">
            <div class="stat-icon">🏙️</div>
            <div class="stat-content">
              <div class="stat-value">${stats.totalWards}</div>
              <div class="stat-label">Total Wards</div>
            </div>
          </div>
          <div class="stat-card-large">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">${stats.avgScore}</div>
              <div class="stat-label">Avg Pollution Score</div>
            </div>
          </div>
          <div class="stat-card-large">
            <div class="stat-icon">🌱</div>
            <div class="stat-content">
              <div class="stat-value">${stats.goodWards}</div>
              <div class="stat-label">Good Quality Wards</div>
            </div>
          </div>
          <div class="stat-card-large">
            <div class="stat-icon">⚠️</div>
            <div class="stat-content">
              <div class="stat-value">${stats.criticalWards}</div>
              <div class="stat-label">Critical Wards</div>
            </div>
          </div>
        </div>
        
        <!-- Top Performers -->
        <div class="leaderboard-section">
          <h3>🌟 Top Performing Wards</h3>
          <div class="leaderboard-list">
            ${topWards.map((ward, index) => this.renderLeaderboardItem(ward, index + 1, 'top')).join('')}
          </div>
        </div>
        
        <!-- Bottom Performers -->
        <div class="leaderboard-section needs-attention">
          <h3>🚨 Wards Needing Urgent Attention</h3>
          <div class="leaderboard-list">
            ${bottomWards.map(ward => this.renderLeaderboardItem(ward, ward.rank, 'bottom')).join('')}
          </div>
        </div>
        
        <!-- Achievement Badges -->
        <div class="achievements-section">
          <h3>🎖️ Ward Achievements & Recognitions</h3>
          <div class="achievements-grid">
            ${this.renderAchievements(wards)}
          </div>
        </div>
        
        <!-- Citizen Engagement -->
        <div class="engagement-section">
          <h3>👥 Citizen Engagement Leaderboard</h3>
          <div class="engagement-list">
            ${this.renderCitizenEngagement(wards)}
          </div>
        </div>
        
        <!-- Ward Comparison Tool -->
        <div class="comparison-section">
          <h3>⚖️ Compare Wards</h3>
          <div class="comparison-tool">
            <select id="compareWard1" class="compare-select">
              <option value="">Select first ward</option>
              ${wards.map(w => `<option value="${w.wardId}">${w.wardName}</option>`).join('')}
            </select>
            <span class="vs-text">VS</span>
            <select id="compareWard2" class="compare-select">
              <option value="">Select second ward</option>
              ${wards.map(w => `<option value="${w.wardId}">${w.wardName}</option>`).join('')}
            </select>
            <button class="compare-btn" onclick="gamificationSystem.compareWards()">Compare</button>
          </div>
          <div id="comparisonResults" class="comparison-results"></div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  renderLeaderboardItem(ward, rank, type) {
    const rankClass = rank <= 3 ? 'top-three' : '';
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    
    return `
      <div class="leaderboard-item ${rankClass}" data-ward-id="${ward.wardId}">
        <div class="rank-badge">
          ${medal || `#${rank}`}
        </div>
        <div class="ward-info">
          <h4>${ward.wardName}</h4>
          <span class="ward-zone">${ward.zone}</span>
        </div>
        <div class="ward-metrics">
          <div class="metric">
            <span class="metric-label">Score</span>
            <span class="metric-value score-${this.getScoreClass(ward.pollutionScore)}">${ward.pollutionScore}</span>
          </div>
          <div class="metric">
            <span class="metric-label">AQI</span>
            <span class="metric-value">${ward.pollution.air.aqi}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Reports</span>
            <span class="metric-value">${ward.citizenReports}</span>
          </div>
        </div>
        <button class="view-ward-btn" onclick="gamificationSystem.viewWard('${ward.wardId}')">
          View Details →
        </button>
      </div>
    `;
  }
  
  renderAchievements(wards) {
    const achievements = [
      {
        title: 'Clean Air Champion',
        description: 'Best AQI improvement',
        ward: this.findBestAirQuality(wards),
        icon: '🌤️',
        color: 'blue'
      },
      {
        title: 'Water Guardian',
        description: 'Excellent water quality',
        ward: this.findBestWaterQuality(wards),
        icon: '💧',
        color: 'cyan'
      },
      {
        title: 'Zero Waste Hero',
        description: 'Highest waste collection rate',
        ward: this.findBestWasteManagement(wards),
        icon: '♻️',
        color: 'green'
      },
      {
        title: 'Silent Zone',
        description: 'Lowest noise pollution',
        ward: this.findLowestNoise(wards),
        icon: '🔇',
        color: 'purple'
      },
      {
        title: 'Most Engaged',
        description: 'Highest citizen participation',
        ward: this.findMostEngaged(wards),
        icon: '🏅',
        color: 'gold'
      },
      {
        title: 'Rising Star',
        description: 'Best overall improvement',
        ward: this.findRisingStar(wards),
        icon: '⭐',
        color: 'yellow'
      }
    ];
    
    return achievements.map(achievement => `
      <div class="achievement-card achievement-${achievement.color}">
        <div class="achievement-icon">${achievement.icon}</div>
        <h4>${achievement.title}</h4>
        <p>${achievement.description}</p>
        <div class="achievement-winner">
          <strong>${achievement.ward.wardName}</strong>
          <span class="achievement-badge">${achievement.ward.wardCode}</span>
        </div>
      </div>
    `).join('');
  }
  
  renderCitizenEngagement(wards) {
    const topEngaged = [...wards]
      .sort((a, b) => b.citizenReports - a.citizenReports)
      .slice(0, 10);
    
    return topEngaged.map((ward, index) => `
      <div class="engagement-item">
        <span class="engagement-rank">#${index + 1}</span>
        <div class="engagement-info">
          <strong>${ward.wardName}</strong>
          <div class="engagement-stats">
            <span>📝 ${ward.citizenReports} reports</span>
            <span>💬 ${ward.complaints.length} complaints</span>
          </div>
        </div>
        <div class="engagement-bar-container">
          <div class="engagement-bar" style="width: ${(ward.citizenReports / topEngaged[0].citizenReports) * 100}%"></div>
        </div>
      </div>
    `).join('');
  }
  
  calculateOverallStats(wards) {
    return {
      totalWards: wards.length,
      avgScore: Math.floor(wards.reduce((sum, w) => sum + w.pollutionScore, 0) / wards.length),
      goodWards: wards.filter(w => w.pollution.air.aqi <= 100).length,
      criticalWards: wards.filter(w => w.pollution.air.aqi > 300).length
    };
  }
  
  findBestAirQuality(wards) {
    return wards.reduce((best, ward) => 
      ward.pollution.air.aqi < best.pollution.air.aqi ? ward : best
    );
  }
  
  findBestWaterQuality(wards) {
    return wards.reduce((best, ward) => 
      ward.pollution.water.tds < best.pollution.water.tds ? ward : best
    );
  }
  
  findBestWasteManagement(wards) {
    return wards.reduce((best, ward) => 
      ward.pollution.waste.collectionEfficiency > best.pollution.waste.collectionEfficiency ? ward : best
    );
  }
  
  findLowestNoise(wards) {
    return wards.reduce((best, ward) => 
      ward.pollution.noise.level < best.pollution.noise.level ? ward : best
    );
  }
  
  findMostEngaged(wards) {
    return wards.reduce((best, ward) => 
      ward.citizenReports > best.citizenReports ? ward : best
    );
  }
  
  findRisingStar(wards) {
    // Simplified: return ward with improving trend and good score
    const improving = wards.filter(w => w.pollution.air.trend === 'improving');
    return improving.length > 0 ? improving[0] : wards[0];
  }
  
  getScoreClass(score) {
    if (score >= 70) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 30) return 'moderate';
    return 'poor';
  }
  
  setupEventListeners() {
    const select1 = document.getElementById('compareWard1');
    const select2 = document.getElementById('compareWard2');
    
    if (select1 && select2) {
      select1.addEventListener('change', () => {
        if (select1.value && select2.value && select1.value === select2.value) {
          alert('Please select different wards to compare');
          select1.value = '';
        }
      });
      
      select2.addEventListener('change', () => {
        if (select1.value && select2.value && select1.value === select2.value) {
          alert('Please select different wards to compare');
          select2.value = '';
        }
      });
    }
  }
  
  compareWards() {
    const ward1Id = document.getElementById('compareWard1').value;
    const ward2Id = document.getElementById('compareWard2').value;
    
    if (!ward1Id || !ward2Id) {
      alert('Please select two wards to compare');
      return;
    }
    
    const ward1 = this.dataManager.getWardById(ward1Id);
    const ward2 = this.dataManager.getWardById(ward2Id);
    
    const resultsContainer = document.getElementById('comparisonResults');
    resultsContainer.innerHTML = `
      <div class="comparison-result">
        <h4>Comparison Results</h4>
        <div class="comparison-grid">
          <div class="comparison-ward">
            <h5>${ward1.wardName}</h5>
            <div class="comparison-metrics">
              <div class="metric-row">
                <span>Pollution Score</span>
                <strong class="score-${this.getScoreClass(ward1.pollutionScore)}">${ward1.pollutionScore}</strong>
              </div>
              <div class="metric-row">
                <span>AQI</span>
                <strong>${ward1.pollution.air.aqi}</strong>
              </div>
              <div class="metric-row">
                <span>Water TDS</span>
                <strong>${ward1.pollution.water.tds} ppm</strong>
              </div>
              <div class="metric-row">
                <span>Noise Level</span>
                <strong>${ward1.pollution.noise.level} dB</strong>
              </div>
              <div class="metric-row">
                <span>Waste Collection</span>
                <strong>${ward1.pollution.waste.collectionEfficiency}%</strong>
              </div>
              <div class="metric-row">
                <span>Ward Rank</span>
                <strong>#${ward1.rank}</strong>
              </div>
              <div class="metric-row">
                <span>Citizen Reports</span>
                <strong>${ward1.citizenReports}</strong>
              </div>
            </div>
          </div>
          
          <div class="comparison-ward">
            <h5>${ward2.wardName}</h5>
            <div class="comparison-metrics">
              <div class="metric-row">
                <span>Pollution Score</span>
                <strong class="score-${this.getScoreClass(ward2.pollutionScore)}">${ward2.pollutionScore}</strong>
              </div>
              <div class="metric-row">
                <span>AQI</span>
                <strong>${ward2.pollution.air.aqi}</strong>
              </div>
              <div class="metric-row">
                <span>Water TDS</span>
                <strong>${ward2.pollution.water.tds} ppm</strong>
              </div>
              <div class="metric-row">
                <span>Noise Level</span>
                <strong>${ward2.pollution.noise.level} dB</strong>
              </div>
              <div class="metric-row">
                <span>Waste Collection</span>
                <strong>${ward2.pollution.waste.collectionEfficiency}%</strong>
              </div>
              <div class="metric-row">
                <span>Ward Rank</span>
                <strong>#${ward2.rank}</strong>
              </div>
              <div class="metric-row">
                <span>Citizen Reports</span>
                <strong>${ward2.citizenReports}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <div class="comparison-winner">
          ${this.determineWinner(ward1, ward2)}
        </div>
      </div>
    `;
  }
  
  determineWinner(ward1, ward2) {
    if (ward1.pollutionScore > ward2.pollutionScore) {
      return `<p class="winner-text">🏆 <strong>${ward1.wardName}</strong> has better overall environmental performance</p>`;
    } else if (ward2.pollutionScore > ward1.pollutionScore) {
      return `<p class="winner-text">🏆 <strong>${ward2.wardName}</strong> has better overall environmental performance</p>`;
    } else {
      return `<p class="winner-text">⚖️ Both wards have similar environmental performance</p>`;
    }
  }
  
  viewWard(wardId) {
    // This would trigger the map to select this ward
    if (window.wardMap) {
      window.wardMap.selectWard(wardId);
      document.getElementById('wardMapContainer').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GamificationSystem;
} else {
  window.GamificationSystem = GamificationSystem;
}
