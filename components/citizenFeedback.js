/**
 * Citizen Feedback System
 * Enables residents to report pollution issues and view ward complaints
 */

class CitizenFeedbackSystem {
  constructor(containerId, dataManager) {
    this.container = document.getElementById(containerId);
    this.dataManager = dataManager;
    this.currentWard = null;
  }
  
  render(ward) {
    this.currentWard = ward;
    
    if (!ward) {
      this.renderEmptyState();
      return;
    }
    
    this.container.innerHTML = `
      <div class="feedback-panel">
        <div class="panel-header">
          <h3>📢 Citizen Feedback & Reports</h3>
          <span class="report-count">${ward.complaints.length} reports</span>
        </div>
        
        <!-- Report Form -->
        <div class="report-form-section">
          <h4>Report a Pollution Issue</h4>
          <form id="pollutionReportForm" class="report-form">
            <div class="form-group">
              <label for="issueType">Issue Type</label>
              <select id="issueType" required>
                <option value="">Select issue type</option>
                <option value="air">Air Pollution</option>
                <option value="water">Water Pollution</option>
                <option value="noise">Noise Pollution</option>
                <option value="waste">Waste Management</option>
                <option value="soil">Soil Contamination</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="severity">Severity Level</label>
              <select id="severity" required>
                <option value="">Select severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="location">Specific Location (Optional)</label>
              <input type="text" id="location" placeholder="e.g., Near XYZ Park, ABC Road">
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                rows="4" 
                required 
                placeholder="Describe the pollution issue in detail..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="reporterName">Your Name (Optional)</label>
              <input type="text" id="reporterName" placeholder="Anonymous">
            </div>
            
            <button type="submit" class="submit-btn">Submit Report</button>
          </form>
        </div>
        
        <!-- Reports List -->
        <div class="reports-section">
          <div class="reports-header">
            <h4>Recent Reports</h4>
            <div class="filter-buttons">
              <button class="filter-btn active" data-filter="all">All</button>
              <button class="filter-btn" data-filter="Open">Open</button>
              <button class="filter-btn" data-filter="In Progress">In Progress</button>
              <button class="filter-btn" data-filter="Resolved">Resolved</button>
            </div>
          </div>
          
          <div class="reports-list" id="reportsList">
            ${this.renderReports(ward.complaints)}
          </div>
        </div>
        
        <!-- Statistics -->
        <div class="feedback-stats">
          <h4>Report Statistics</h4>
          <div class="stats-grid">
            ${this.renderStats(ward)}
          </div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  renderReports(complaints) {
    if (complaints.length === 0) {
      return `
        <div class="no-reports">
          <div class="no-reports-icon">📭</div>
          <p>No reports yet for this ward</p>
          <small>Be the first to report a pollution issue</small>
        </div>
      `;
    }
    
    return complaints
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(complaint => this.renderComplaintCard(complaint))
      .join('');
  }
  
  renderComplaintCard(complaint) {
    const timeAgo = this.getTimeAgo(complaint.timestamp);
    const statusClass = complaint.status.toLowerCase().replace(' ', '-');
    
    return `
      <div class="complaint-card" data-status="${complaint.status}">
        <div class="complaint-header">
          <div class="complaint-meta">
            <span class="issue-type-badge ${complaint.type || 'other'}">${complaint.type || 'General'}</span>
            <span class="severity-badge ${complaint.severity || 'medium'}">${complaint.severity || 'Medium'}</span>
          </div>
          <span class="status-badge status-${statusClass}">${complaint.status}</span>
        </div>
        
        <div class="complaint-body">
          <p>${complaint.text}</p>
          ${complaint.location ? `<p class="complaint-location">📍 ${complaint.location}</p>` : ''}
        </div>
        
        <div class="complaint-footer">
          <span class="complaint-time">⏱️ ${timeAgo}</span>
          <span class="complaint-reporter">${complaint.reporter || 'Anonymous'}</span>
          <button class="support-btn" onclick="feedbackSystem.supportReport(${complaint.id})">
            👍 Support (${complaint.supports || 0})
          </button>
        </div>
      </div>
    `;
  }
  
  renderStats(ward) {
    const complaints = ward.complaints;
    const openCount = complaints.filter(c => c.status === 'Open').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const avgResponseTime = this.calculateAvgResponseTime(complaints);
    
    return `
      <div class="stat-card">
        <div class="stat-value">${complaints.length}</div>
        <div class="stat-label">Total Reports</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${openCount}</div>
        <div class="stat-label">Open</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${resolvedCount}</div>
        <div class="stat-label">Resolved</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgResponseTime}</div>
        <div class="stat-label">Avg Response</div>
      </div>
    `;
  }
  
  renderEmptyState() {
    this.container.innerHTML = `
      <div class="feedback-panel empty-state">
        <div class="empty-icon">📢</div>
        <h3>Select a Ward</h3>
        <p>Choose a ward from the map to report pollution issues and view community feedback.</p>
      </div>
    `;
  }
  
  setupEventListeners() {
    const form = document.getElementById('pollutionReportForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitReport();
      });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.filterReports(e.target.getAttribute('data-filter'));
      });
    });
  }
  
  submitReport() {
    if (!this.currentWard) return;
    
    const issueType = document.getElementById('issueType').value;
    const severity = document.getElementById('severity').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const reporterName = document.getElementById('reporterName').value;
    
    const complaint = {
      id: Date.now(),
      type: issueType,
      severity: severity,
      location: location,
      text: description,
      reporter: reporterName || 'Anonymous',
      timestamp: new Date().toISOString(),
      status: 'Open',
      supports: 0
    };
    
    this.currentWard.complaints.push(complaint);
    this.currentWard.citizenReports++;
    
    // Show success message
    this.showSuccessMessage();
    
    // Re-render
    this.render(this.currentWard);
    
    // Scroll to reports
    document.getElementById('reportsList').scrollIntoView({ behavior: 'smooth' });
  }
  
  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">✅</span>
        <span>Report submitted successfully!</span>
      </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }
  
  filterReports(filter) {
    const cards = document.querySelectorAll('.complaint-card');
    cards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-status') === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  supportReport(reportId) {
    if (!this.currentWard) return;
    
    const complaint = this.currentWard.complaints.find(c => c.id === reportId);
    if (complaint) {
      complaint.supports = (complaint.supports || 0) + 1;
      this.render(this.currentWard);
    }
  }
  
  getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }
  
  calculateAvgResponseTime(complaints) {
    if (complaints.length === 0) return 'N/A';
    // Simplified - in real system would calculate based on resolution times
    return '2-3 days';
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CitizenFeedbackSystem;
} else {
  window.CitizenFeedbackSystem = CitizenFeedbackSystem;
}
