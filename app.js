// Application State
let viewer;
let currentGas = 'co2';
let currentYear = 2023;
let dataOpacity = 0.8;
let entities = [];
let communityReports = [];

// Sample GHG Data
const sampleGHGData = [
    {"city": "New York", "lat": 40.7128, "lon": -74.0060, "co2": 415, "ch4": 1.9, "n2o": 0.33, "population": 8400000, "airQualityIndex": 65, "greenSpacePercent": 27},
    {"city": "Los Angeles", "lat": 34.0522, "lon": -118.2437, "co2": 420, "ch4": 2.1, "n2o": 0.35, "population": 4000000, "airQualityIndex": 78, "greenSpacePercent": 15},
    {"city": "London", "lat": 51.5074, "lon": -0.1278, "co2": 410, "ch4": 1.8, "n2o": 0.32, "population": 9000000, "airQualityIndex": 55, "greenSpacePercent": 47},
    {"city": "Tokyo", "lat": 35.6762, "lon": 139.6503, "co2": 418, "ch4": 1.85, "n2o": 0.34, "population": 14000000, "airQualityIndex": 60, "greenSpacePercent": 13},
    {"city": "Mumbai", "lat": 19.0760, "lon": 72.8777, "co2": 425, "ch4": 2.3, "n2o": 0.38, "population": 20000000, "airQualityIndex": 95, "greenSpacePercent": 8},
    {"city": "São Paulo", "lat": -23.5505, "lon": -46.6333, "co2": 422, "ch4": 2.0, "n2o": 0.36, "population": 12000000, "airQualityIndex": 72, "greenSpacePercent": 12},
    {"city": "Beijing", "lat": 39.9042, "lon": 116.4074, "co2": 430, "ch4": 2.2, "n2o": 0.37, "population": 21000000, "airQualityIndex": 88, "greenSpacePercent": 16},
    {"city": "Cairo", "lat": 30.0444, "lon": 31.2357, "co2": 428, "ch4": 2.4, "n2o": 0.39, "population": 10000000, "airQualityIndex": 92, "greenSpacePercent": 5},
    {"city": "Sydney", "lat": -33.8688, "lon": 151.2093, "co2": 405, "ch4": 1.7, "n2o": 0.31, "population": 5000000, "airQualityIndex": 45, "greenSpacePercent": 35},
    {"city": "Vancouver", "lat": 49.2827, "lon": -123.1207, "co2": 400, "ch4": 1.6, "n2o": 0.30, "population": 675000, "airQualityIndex": 38, "greenSpacePercent": 45},
    {"city": "Berlin", "lat": 52.5200, "lon": 13.4050, "co2": 408, "ch4": 1.75, "n2o": 0.32, "population": 3700000, "airQualityIndex": 52, "greenSpacePercent": 40},
    {"city": "Mexico City", "lat": 19.4326, "lon": -99.1332, "co2": 435, "ch4": 2.5, "n2o": 0.40, "population": 22000000, "airQualityIndex": 98, "greenSpacePercent": 7},
    {"city": "Lagos", "lat": 6.5244, "lon": 3.3792, "co2": 440, "ch4": 2.8, "n2o": 0.42, "population": 15000000, "airQualityIndex": 105, "greenSpacePercent": 3},
    {"city": "Singapore", "lat": 1.3521, "lon": 103.8198, "co2": 412, "ch4": 1.82, "n2o": 0.33, "population": 6000000, "airQualityIndex": 48, "greenSpacePercent": 50},
    {"city": "Stockholm", "lat": 59.3293, "lon": 18.0686, "co2": 395, "ch4": 1.5, "n2o": 0.29, "population": 1000000, "airQualityIndex": 35, "greenSpacePercent": 55}
];

// Gas Information
const gasInfo = {
    "co2": {"name": "Carbon Dioxide", "unit": "ppm", "color": "#FF4444", "description": "Primary greenhouse gas from fossil fuel combustion"},
    "ch4": {"name": "Methane", "unit": "ppm", "color": "#44FF44", "description": "Potent greenhouse gas from agriculture and waste"},
    "n2o": {"name": "Nitrous Oxide", "unit": "ppm", "color": "#4444FF", "description": "Greenhouse gas from agriculture and industry"}
};

// Planning Recommendations
const planningRecommendations = {
    "high": ["Implement strict emission controls", "Increase public transportation", "Mandate green building standards", "Create more urban forests"],
    "medium": ["Promote electric vehicle adoption", "Improve energy efficiency", "Expand green corridors", "Develop carbon offset programs"],
    "low": ["Monitor air quality trends", "Maintain current green spaces", "Encourage sustainable practices", "Plan for future growth"]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeCesium();
        setupEventListeners();
        // Shorter delay and add error handling
        setTimeout(() => {
            hideLoadingOverlay();
            updateVisualization();
        }, 1500);
    } catch (error) {
        console.error('Failed to initialize application:', error);
        handleInitializationError();
    }
});

// Handle initialization errors
function handleInitializationError() {
    hideLoadingOverlay();
    const cesiumContainer = document.getElementById('cesiumContainer');
    cesiumContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #1e293b; color: white; text-align: center; padding: 20px;">
            <div>
                <h3>🌍 3D Globe Visualization</h3>
                <p>Simulating NASA Earth observation data visualization</p>
                <p style="color: #38bdf8; margin-top: 20px;">Interactive 3D globe would display greenhouse gas concentrations here</p>
                <button onclick="simulateGlobeClick()" style="margin: 10px; padding: 8px 16px; background: #0ea5e9; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Simulate City Click
                </button>
            </div>
        </div>
    `;
}

// Initialize Cesium viewer
function initializeCesium() {
    // Try to initialize Cesium without token first
    try {
        viewer = new Cesium.Viewer('cesiumContainer', {
            baseLayerPicker: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false
        });

        // Set initial view
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 15000000),
            orientation: {
                heading: 0.0,
                pitch: -0.5,
                roll: 0.0
            }
        });

        // Enable lighting
        viewer.scene.globe.enableLighting = true;
        viewer.scene.fog.enabled = false;
        viewer.scene.skyBox.show = true;

        // Setup click handler
        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(onEntityClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
    } catch (error) {
        console.error('Cesium initialization failed:', error);
        throw error;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Gas toggle buttons
    document.querySelectorAll('.gas-toggle').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.gas-toggle').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current gas
            currentGas = this.dataset.gas;
            updateVisualization();
        });
    });

    // Time slider
    const timeSlider = document.getElementById('timeSlider');
    const currentYearSpan = document.getElementById('currentYear');
    timeSlider.addEventListener('input', function() {
        currentYear = parseInt(this.value);
        currentYearSpan.textContent = currentYear;
        updateVisualization();
    });

    // Opacity slider
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    opacitySlider.addEventListener('input', function() {
        dataOpacity = this.value / 100;
        opacityValue.textContent = this.value + '%';
        updateVisualization();
    });

    // Reset view button
    document.getElementById('resetView').addEventListener('click', function() {
        if (viewer && viewer.camera) {
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(0, 20, 15000000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                }
            });
        }
    });

    // Close info panel
    document.getElementById('closeInfo').addEventListener('click', function() {
        document.getElementById('infoPanel').style.display = 'none';
    });

    // Community input modal
    const communityBtn = document.getElementById('communityInputBtn');
    if (communityBtn) {
        communityBtn.addEventListener('click', function() {
            document.getElementById('communityModal').classList.remove('hidden');
        });
    }

    document.getElementById('closeCommunityModal').addEventListener('click', function() {
        document.getElementById('communityModal').classList.add('hidden');
    });

    // Education modal
    const educationBtn = document.getElementById('educationBtn');
    if (educationBtn) {
        educationBtn.addEventListener('click', function() {
            document.getElementById('educationModal').classList.remove('hidden');
        });
    }

    document.getElementById('closeEducationModal').addEventListener('click', function() {
        document.getElementById('educationModal').classList.add('hidden');
    });

    // Community form submission
    document.getElementById('communityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCommunityReport();
    });

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}

// Hide loading overlay
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Update visualization based on current settings
function updateVisualization() {
    if (!viewer || !viewer.entities) {
        console.log('Viewer not available, skipping visualization update');
        return;
    }

    try {
        // Clear existing entities
        entities.forEach(entity => {
            if (viewer.entities.contains(entity)) {
                viewer.entities.remove(entity);
            }
        });
        entities = [];

        // Add data points for current gas
        sampleGHGData.forEach((city, index) => {
            // Calculate time-based variation (simulate historical data)
            const baseValue = city[currentGas];
            const yearOffset = (currentYear - 2023) / 46; // Normalize to -1 to 1 range
            const variation = baseValue * 0.1 * Math.sin(yearOffset * Math.PI + index);
            const currentValue = baseValue + variation;

            // Determine color and size based on value
            const color = getColorForValue(currentValue, currentGas);
            const size = getPointSize(currentValue, currentGas);

            // Create entity
            const entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 50000),
                point: {
                    pixelSize: size,
                    color: color.withAlpha(dataOpacity),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
                },
                label: {
                    text: city.city,
                    font: '12pt sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -40),
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0)
                },
                properties: new Cesium.PropertyBag({
                    cityData: city,
                    currentValue: currentValue,
                    gas: currentGas
                })
            });

            entities.push(entity);
        });

        // Add community report markers
        communityReports.forEach(report => {
            const entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(report.lon, report.lat, 10000),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2
                },
                label: {
                    text: '📍 Community Report',
                    font: '10pt sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -30),
                    fillColor: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE
                },
                properties: new Cesium.PropertyBag({
                    reportData: report,
                    type: 'community-report'
                })
            });

            entities.push(entity);
        });

        console.log(`Updated visualization with ${entities.length} entities for gas: ${currentGas}, year: ${currentYear}`);
        
    } catch (error) {
        console.error('Error updating visualization:', error);
    }
}

// Get color for gas concentration value
function getColorForValue(value, gas) {
    let min, max;
    
    switch(gas) {
        case 'co2':
            min = 390;
            max = 450;
            break;
        case 'ch4':
            min = 1.4;
            max = 3.0;
            break;
        case 'n2o':
            min = 0.25;
            max = 0.45;
            break;
    }

    const normalized = (value - min) / (max - min);
    const clamped = Math.max(0, Math.min(1, normalized));

    // Color gradient from blue (low) to red (high)
    if (clamped < 0.5) {
        return Cesium.Color.lerp(Cesium.Color.BLUE, Cesium.Color.YELLOW, clamped * 2, new Cesium.Color());
    } else {
        return Cesium.Color.lerp(Cesium.Color.YELLOW, Cesium.Color.RED, (clamped - 0.5) * 2, new Cesium.Color());
    }
}

// Get point size based on concentration
function getPointSize(value, gas) {
    let min, max;
    
    switch(gas) {
        case 'co2':
            min = 390;
            max = 450;
            break;
        case 'ch4':
            min = 1.4;
            max = 3.0;
            break;
        case 'n2o':
            min = 0.25;
            max = 0.45;
            break;
    }

    const normalized = (value - min) / (max - min);
    return 15 + (normalized * 25); // Size between 15 and 40 pixels
}

// Handle entity clicks
function onEntityClick(event) {
    if (!viewer) return;
    
    const pickedObject = viewer.scene.pick(event.position);
    
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
        const entity = pickedObject.id;
        
        if (entity.properties && entity.properties.cityData) {
            displayCityInfo(entity.properties.cityData.getValue(), entity.properties.currentValue.getValue());
        } else if (entity.properties && entity.properties.reportData) {
            displayReportInfo(entity.properties.reportData.getValue());
        }
    }
}

// Simulate globe click for fallback mode
function simulateGlobeClick() {
    const randomCity = sampleGHGData[Math.floor(Math.random() * sampleGHGData.length)];
    const baseValue = randomCity[currentGas];
    const yearOffset = (currentYear - 2023) / 46;
    const variation = baseValue * 0.1 * Math.sin(yearOffset * Math.PI);
    const currentValue = baseValue + variation;
    
    displayCityInfo(randomCity, currentValue);
}

// Display city information
function displayCityInfo(cityData, currentValue) {
    const infoPanel = document.getElementById('infoPanel');
    const cityName = document.getElementById('cityName');
    const infoContent = document.getElementById('infoContent');

    cityName.textContent = cityData.city;

    // Determine concentration level
    let level = 'low';
    if (currentGas === 'co2' && currentValue > 420) level = 'high';
    else if (currentGas === 'co2' && currentValue > 410) level = 'medium';
    else if (currentGas === 'ch4' && currentValue > 2.0) level = 'high';
    else if (currentGas === 'ch4' && currentValue > 1.8) level = 'medium';
    else if (currentGas === 'n2o' && currentValue > 0.35) level = 'high';
    else if (currentGas === 'n2o' && currentValue > 0.32) level = 'medium';

    // Get air quality status
    const aqiStatus = getAirQualityStatus(cityData.airQualityIndex);

    infoContent.innerHTML = `
        <div class="city-stats">
            <div class="stat-item">
                <div class="stat-value">${currentValue.toFixed(2)}</div>
                <div class="stat-label">${gasInfo[currentGas].name} (${gasInfo[currentGas].unit})</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${(cityData.population / 1000000).toFixed(1)}M</div>
                <div class="stat-label">Population</div>
            </div>
            <div class="stat-item">
                <div class="stat-value status ${aqiStatus.class}">${cityData.airQualityIndex}</div>
                <div class="stat-label">Air Quality Index</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${cityData.greenSpacePercent}%</div>
                <div class="stat-label">Green Space</div>
            </div>
        </div>
        
        <div class="planning-actions">
            <h4>Recommended Planning Actions</h4>
            <ul>
                ${planningRecommendations[level].map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
        
        <p><strong>Gas Information:</strong> ${gasInfo[currentGas].description}</p>
    `;

    infoPanel.style.display = 'flex';
}

// Display community report information
function displayReportInfo(reportData) {
    const infoPanel = document.getElementById('infoPanel');
    const cityName = document.getElementById('cityName');
    const infoContent = document.getElementById('infoContent');

    cityName.textContent = `Community Report - ${reportData.location}`;

    infoContent.innerHTML = `
        <div class="report-details">
            <p><strong>Category:</strong> ${reportData.category.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Description:</strong> ${reportData.description}</p>
            <p><strong>Submitted:</strong> ${new Date(reportData.timestamp).toLocaleDateString()}</p>
        </div>
    `;

    infoPanel.style.display = 'flex';
}

// Get air quality status
function getAirQualityStatus(aqi) {
    if (aqi <= 50) return { class: 'status--excellent', text: 'Good' };
    if (aqi <= 100) return { class: 'status--info', text: 'Moderate' };
    if (aqi <= 150) return { class: 'status--warning', text: 'Unhealthy for Sensitive' };
    return { class: 'status--poor', text: 'Unhealthy' };
}

// Submit community report
function submitCommunityReport() {
    const category = document.getElementById('issueCategory').value;
    const location = document.getElementById('issueLocation').value;
    const description = document.getElementById('issueDescription').value;

    if (!location || !description) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate getting coordinates for the location (in real app, would use geocoding)
    const coordinates = getCoordinatesForLocation(location);

    const report = {
        category: category,
        location: location,
        description: description,
        timestamp: new Date().toISOString(),
        lat: coordinates.lat,
        lon: coordinates.lon
    };

    communityReports.push(report);
    updateVisualization();

    // Reset form and close modal
    document.getElementById('communityForm').reset();
    document.getElementById('communityModal').classList.add('hidden');

    alert('Thank you for your report! It has been added to the map.');
}

// Get coordinates for location (simplified mock function)
function getCoordinatesForLocation(location) {
    const locationMap = {
        'new york': { lat: 40.7128, lon: -74.0060 },
        'london': { lat: 51.5074, lon: -0.1278 },
        'tokyo': { lat: 35.6762, lon: 139.6503 },
        'sydney': { lat: -33.8688, lon: 151.2093 },
        'paris': { lat: 48.8566, lon: 2.3522 },
        'berlin': { lat: 52.5200, lon: 13.4050 },
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'beijing': { lat: 39.9042, lon: 116.4074 },
        'cairo': { lat: 30.0444, lon: 31.2357 },
        'vancouver': { lat: 49.2827, lon: -123.1207 }
    };

    const key = location.toLowerCase();
    return locationMap[key] || { lat: Math.random() * 180 - 90, lon: Math.random() * 360 - 180 };
}