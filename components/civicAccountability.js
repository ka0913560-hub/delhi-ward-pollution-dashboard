/**
 * Civic Accountability Component
 * Displays ward governance, elected representatives, and initiatives
 */

class CivicAccountabilityPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentWard = null;
  }
  
  render(ward) {
    if (!ward) {
      this.renderEmptyState();
      return;
    }
    
    this.currentWard = ward;
    const { governance } = ward;
    
    this.container.innerHTML = `
      <div class="civic-panel">
        <div class="panel-header">
          <h3>🏛️ Ward Governance & Accountability</h3>
          <span class="ward-badge">${ward.wardCode}</span>
        </div>
        
        <!-- Elected Representative Section -->
        <div class="representative-card">
          <div class="rep-header">
            <div class="rep-avatar">${this.getInitials(governance.councillor.name)}</div>
            <div class="rep-info">
              <h4>${governance.councillor.name}</h4>
              <span class="party-badge party-${governance.councillor.party.toLowerCase()}">${governance.councillor.party}</span>
              <p class="rep-title">Ward Councillor</p>
            </div>
          </div>
          
          <div class="contact-section">
            <h5>📞 Contact Information</h5>
            <div class="contact-grid">
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <div>
                  <small>Phone</small>
                  <strong>${governance.councillor.contact}</strong>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <div>
                  <small>Email</small>
                  <strong>${governance.councillor.email}</strong>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🏢</span>
                <div>
                  <small>Office</small>
                  <strong>${governance.councillor.officeAddress}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Active Initiatives -->
        <div class="initiatives-section">
          <h5>🌱 Active Environmental Initiatives</h5>
          <div class="initiatives-list">
            ${governance.initiatives.map(init => this.renderInitiative(init)).join('')}
          </div>
          ${governance.initiatives.length === 0 ? '<p class="no-data">No active initiatives</p>' : ''}
        </div>
        
        <!-- Budget Information -->
        <div class="budget-section">
          <h5>💰 Environmental Budget</h5>
          <div class="budget-bars">
            <div class="budget-item">
              <div class="budget-label">
                <span>Total Allocated</span>
                <strong>₹${this.formatBudget(governance.budget.allocated)}</strong>
              </div>
              <div class="budget-bar">
                <div class="budget-fill" style="width: 100%"></div>
              </div>
            </div>
            <div class="budget-item">
              <div class="budget-label">
                <span>Utilized</span>
                <strong>₹${this.formatBudget(governance.budget.utilized)}</strong>
              </div>
              <div class="budget-bar">
                <div class="budget-fill utilized" style="width: ${(governance.budget.utilized / governance.budget.allocated * 100)}%"></div>
              </div>
            </div>
            <div class="budget-item">
              <div class="budget-label">
                <span>Environmental</span>
                <strong>₹${this.formatBudget(governance.budget.environmental)}</strong>
              </div>
              <div class="budget-bar">
                <div class="budget-fill environmental" style="width: ${(governance.budget.environmental / governance.budget.allocated * 100)}%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Performance Indicators -->
        <div class="performance-section">
          <h5>📊 Ward Performance</h5>
          <div class="performance-grid">
            <div class="perf-card">
              <div class="perf-value">#${ward.rank}</div>
              <div class="perf-label">Ward Rank</div>
            </div>
            <div class="perf-card">
              <div class="perf-value">${ward.pollutionScore}</div>
              <div class="perf-label">Pollution Score</div>
            </div>
            <div class="perf-card">
              <div class="perf-value">${ward.citizenReports}</div>
              <div class="perf-label">Citizen Reports</div>
            </div>
            <div class="perf-card">
              <div class="perf-value">${ward.complaints.length}</div>
              <div class="perf-label">Open Complaints</div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="action-btn primary" onclick="civicPanel.contactRepresentative()">
            📧 Contact Representative
          </button>
          <button class="action-btn secondary" onclick="civicPanel.viewInitiatives()">
            📋 View All Initiatives
          </button>
        </div>
      </div>
    `;
  }
  
  renderInitiative(initiative) {
    const statusClass = initiative.status.toLowerCase();
    return `
      <div class="initiative-card">
        <div class="initiative-header">
          <h6>${initiative.name}</h6>
          <span class="status-badge status-${statusClass}">${initiative.status}</span>
        </div>
        <div class="initiative-meta">
          <span class="budget-tag">💵 ${initiative.budget}</span>
        </div>
      </div>
    `;
  }
  
  renderEmptyState() {
    this.container.innerHTML = `
      <div class="civic-panel empty-state">
        <div class="empty-icon">🏛️</div>
        <h3>Select a Ward</h3>
        <p>Click on any ward on the map to view governance information and accountability metrics.</p>
      </div>
    `;
  }
  
  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  formatBudget(amount) {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)} Lakh`;
    }
    return amount.toLocaleString('en-IN');
  }
  
  contactRepresentative() {
    if (!this.currentWard) return;
    
    const { councillor } = this.currentWard.governance;
    const subject = `Regarding Ward ${this.currentWard.wardCode} - Environmental Concerns`;
    const mailtoLink = `mailto:${councillor.email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  }
  
  viewInitiatives() {
    if (!this.currentWard) return;
    
    // This would open a modal or navigate to a detailed page
    alert(`Viewing all initiatives for ${this.currentWard.wardName}\n\nThis feature would show:\n- Detailed initiative descriptions\n- Implementation timelines\n- Budget breakdown\n- Progress reports\n- Citizen feedback`);
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CivicAccountabilityPanel;
} else {
  window.CivicAccountabilityPanel = CivicAccountabilityPanel;
}
