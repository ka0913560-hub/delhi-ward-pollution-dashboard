/**
 * Ward-Based Data Architecture for Delhi Pollution Dashboard
 * Contains mock and hybrid data structures for 250+ wards
 */

// Sample ward data structure - represents Delhi's administrative wards
const wardDataStructure = {
  wardId: "001",
  wardName: "Civil Lines",
  wardCode: "WD001",
  zone: "North Delhi",
  coordinates: { lat: 28.6692, lng: 77.2174 },
  
  // Multi-dimensional pollution data
  pollution: {
    air: {
      aqi: 421,
      pm25: 145,
      pm10: 199,
      no2: 45,
      so2: 12,
      co: 1.2,
      o3: 32,
      timestamp: new Date().toISOString(),
      trend: "worsening", // improving, stable, worsening
      status: "Severe"
    },
    water: {
      tds: 680,
      ph: 7.2,
      turbidity: 3.5,
      dissolvedOxygen: 6.2,
      status: "Poor",
      sources: ["Yamuna", "Municipal Supply"]
    },
    soil: {
      contamination: "Moderate",
      heavyMetals: { lead: 45, mercury: 2.1, cadmium: 1.3 },
      organicPollutants: 23,
      status: "Moderate"
    },
    noise: {
      level: 75, // dB
      status: "High",
      peakHours: ["8-10 AM", "6-9 PM"]
    },
    waste: {
      collectionEfficiency: 78, // percentage
      segregationRate: 34,
      status: "Needs Improvement",
      lastCollection: "2 hours ago"
    }
  },
  
  // Civic accountability
  governance: {
    councillor: {
      name: "Rajesh Kumar",
      party: "AAP",
      contact: "+91-98765-43210",
      email: "rajesh.ward001@delhi.gov.in",
      officeAddress: "Ward Office, Civil Lines"
    },
    initiatives: [
      { name: "Clean Air Drive 2026", status: "Active", budget: "₹5 Lakh" },
      { name: "Waste Segregation Campaign", status: "Planned", budget: "₹3 Lakh" }
    ],
    budget: {
      allocated: 5000000, // in rupees
      utilized: 3200000,
      environmental: 1500000
    }
  },
  
  // Citizen engagement data
  complaints: [],
  pollutionScore: 45, // 0-100, higher is better
  rank: 0, // Will be calculated
  citizenReports: 0
};

// Generate mock data for 250 Delhi wards
class WardDataManager {
  constructor() {
    this.wards = this.generateWardData();
    this.selectedWard = null;
  }
  
  generateWardData() {
    const zones = ["North", "South", "East", "West", "Central", "North East", "North West", "South East", "South West", "New Delhi"];
    const wards = [];
    
    for (let i = 1; i <= 250; i++) {
      const wardId = String(i).padStart(3, '0');
      const zone = zones[Math.floor(Math.random() * zones.length)];
      
      wards.push({
        wardId: wardId,
        wardName: `${zone} Ward ${i}`,
        wardCode: `WD${wardId}`,
        zone: `${zone} Delhi`,
        coordinates: this.generateCoordinates(),
        
        pollution: {
          air: this.generateAirData(),
          water: this.generateWaterData(),
          soil: this.generateSoilData(),
          noise: this.generateNoiseData(),
          waste: this.generateWasteData()
        },
        
        governance: this.generateGovernanceData(wardId),
        complaints: [],
        pollutionScore: 0, // Will be calculated
        rank: 0,
        citizenReports: Math.floor(Math.random() * 50)
      });
    }
    
    // Calculate pollution scores and ranks
    this.calculateScoresAndRanks(wards);
    
    return wards;
  }
  
  generateCoordinates() {
    // Delhi coordinates roughly: 28.4-28.9°N, 76.8-77.3°E
    return {
      lat: 28.4 + Math.random() * 0.5,
      lng: 76.8 + Math.random() * 0.5
    };
  }
  
  generateAirData() {
    const aqi = Math.floor(50 + Math.random() * 400);
    return {
      aqi: aqi,
      pm25: Math.floor(20 + Math.random() * 180),
      pm10: Math.floor(40 + Math.random() * 250),
      no2: Math.floor(10 + Math.random() * 60),
      so2: Math.floor(5 + Math.random() * 25),
      co: (0.5 + Math.random() * 2).toFixed(1),
      o3: Math.floor(15 + Math.random() * 50),
      timestamp: new Date().toISOString(),
      trend: ["improving", "stable", "worsening"][Math.floor(Math.random() * 3)],
      status: this.getAQIStatus(aqi)
    };
  }
  
  generateWaterData() {
    const tds = Math.floor(50 + Math.random() * 1500);
    return {
      tds: tds,
      ph: (6.5 + Math.random() * 2).toFixed(1),
      turbidity: (1 + Math.random() * 5).toFixed(1),
      dissolvedOxygen: (4 + Math.random() * 4).toFixed(1),
      status: this.getTDSStatus(tds),
      sources: this.getWaterSources()
    };
  }
  
  generateSoilData() {
    return {
      contamination: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
      heavyMetals: {
        lead: Math.floor(10 + Math.random() * 100),
        mercury: (0.5 + Math.random() * 5).toFixed(1),
        cadmium: (0.3 + Math.random() * 3).toFixed(1)
      },
      organicPollutants: Math.floor(5 + Math.random() * 50),
      status: ["Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)]
    };
  }
  
  generateNoiseData() {
    const level = Math.floor(45 + Math.random() * 50);
    return {
      level: level,
      status: level < 55 ? "Normal" : level < 70 ? "Moderate" : "High",
      peakHours: ["7-10 AM", "6-9 PM"]
    };
  }
  
  generateWasteData() {
    return {
      collectionEfficiency: Math.floor(60 + Math.random() * 40),
      segregationRate: Math.floor(20 + Math.random() * 60),
      status: ["Excellent", "Good", "Needs Improvement"][Math.floor(Math.random() * 3)],
      lastCollection: this.getRandomTimeAgo()
    };
  }
  
  generateGovernanceData(wardId) {
    const parties = ["AAP", "BJP", "INC", "Independent"];
    const firstNames = ["Rajesh", "Priya", "Amit", "Sunita", "Vikram", "Deepa", "Sanjay", "Meera"];
    const lastNames = ["Kumar", "Sharma", "Singh", "Verma", "Gupta", "Patel", "Reddy", "Rao"];
    
    return {
      councillor: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        party: parties[Math.floor(Math.random() * parties.length)],
        contact: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        email: `councillor.${wardId}@delhi.gov.in`,
        officeAddress: `Ward Office, ${wardId}`
      },
      initiatives: this.generateInitiatives(),
      budget: {
        allocated: Math.floor(3000000 + Math.random() * 7000000),
        utilized: 0,
        environmental: 0
      }
    };
  }
  
  generateInitiatives() {
    const allInitiatives = [
      { name: "Clean Air Drive 2026", status: "Active" },
      { name: "Waste Segregation Campaign", status: "Active" },
      { name: "Green Belt Development", status: "Planned" },
      { name: "Water Conservation Project", status: "Active" },
      { name: "Noise Monitoring System", status: "Planned" },
      { name: "E-Waste Collection Drive", status: "Active" }
    ];
    
    const count = 2 + Math.floor(Math.random() * 3);
    return allInitiatives
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map(init => ({
        ...init,
        budget: `₹${Math.floor(2 + Math.random() * 8)} Lakh`
      }));
  }
  
  calculateScoresAndRanks(wards) {
    // Calculate pollution score (0-100, higher is better)
    wards.forEach(ward => {
      const airScore = Math.max(0, 100 - (ward.pollution.air.aqi / 5));
      const waterScore = Math.max(0, 100 - (ward.pollution.water.tds / 20));
      const wasteScore = ward.pollution.waste.collectionEfficiency;
      const noiseScore = Math.max(0, 100 - ward.pollution.noise.level);
      
      ward.pollutionScore = Math.floor((airScore + waterScore + wasteScore + noiseScore) / 4);
    });
    
    // Sort and assign ranks
    const sorted = [...wards].sort((a, b) => b.pollutionScore - a.pollutionScore);
    sorted.forEach((ward, index) => {
      const originalWard = wards.find(w => w.wardId === ward.wardId);
      originalWard.rank = index + 1;
    });
  }
  
  getAQIStatus(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Very Poor";
    if (aqi <= 400) return "Severe";
    return "Hazardous";
  }
  
  getTDSStatus(tds) {
    if (tds <= 300) return "Excellent";
    if (tds <= 600) return "Good";
    if (tds <= 900) return "Poor";
    return "Unfit";
  }
  
  getWaterSources() {
    const sources = ["Yamuna", "Municipal Supply", "Ground Water", "Treated Water"];
    const count = 1 + Math.floor(Math.random() * 2);
    return sources.sort(() => 0.5 - Math.random()).slice(0, count);
  }
  
  getRandomTimeAgo() {
    const hours = Math.floor(Math.random() * 24);
    if (hours === 0) return "Just now";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  }
  
  // API methods
  getWardById(wardId) {
    return this.wards.find(w => w.wardId === wardId);
  }
  
  getWardsByZone(zone) {
    return this.wards.filter(w => w.zone.includes(zone));
  }
  
  getTopWards(limit = 10) {
    return [...this.wards]
      .sort((a, b) => b.pollutionScore - a.pollutionScore)
      .slice(0, limit);
  }
  
  getBottomWards(limit = 10) {
    return [...this.wards]
      .sort((a, b) => a.pollutionScore - b.pollutionScore)
      .slice(0, limit);
  }
  
  searchWards(query) {
    const lowerQuery = query.toLowerCase();
    return this.wards.filter(w => 
      w.wardName.toLowerCase().includes(lowerQuery) ||
      w.wardCode.toLowerCase().includes(lowerQuery) ||
      w.zone.toLowerCase().includes(lowerQuery)
    );
  }
  
  addComplaint(wardId, complaint) {
    const ward = this.getWardById(wardId);
    if (ward) {
      ward.complaints.push({
        id: Date.now(),
        text: complaint,
        timestamp: new Date().toISOString(),
        status: "Open"
      });
      ward.citizenReports++;
      return true;
    }
    return false;
  }
  
  updateLiveData(wardId) {
    const ward = this.getWardById(wardId);
    if (ward) {
      // Simulate live data updates
      const change = Math.floor(Math.random() * 10) - 5;
      ward.pollution.air.aqi = Math.max(0, ward.pollution.air.aqi + change);
      ward.pollution.air.status = this.getAQIStatus(ward.pollution.air.aqi);
      ward.pollution.air.timestamp = new Date().toISOString();
      
      this.calculateScoresAndRanks(this.wards);
    }
  }
  
  getAllWards() {
    return this.wards;
  }
}

// Export singleton instance
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WardDataManager;
} else {
  window.WardDataManager = WardDataManager;
}
