// Combat Machines block data with weights and thrust required to float
// Ordered as provided in the original list
const blockData = [
    { key: 'wood', name: 'Wood', weight: 8.00, thrust: 10.464 },
    { key: 'scrap', name: 'Scrap', weight: 12.00, thrust: 15.696 },
    { key: 'metal', name: 'Metal', weight: 40.00, thrust: 52.32 },
    { key: 'seat', name: 'Seat', weight: 3.40, thrust: 4.447 },
    { key: 'wheel', name: 'Wheel', weight: 21.90, thrust: 28.645 },
    { key: 'servo', name: 'Servo', weight: 7.00, thrust: 9.156 },
    { key: 'spring', name: 'Spring', weight: 5.60, thrust: 7.325 },
    { key: 'spike', name: 'Spike', weight: 2.00, thrust: 2.616 },
    { key: 'saw', name: 'Saw', weight: 4.50, thrust: 5.886 },
    { key: 'thruster', name: 'Thruster', weight: 6.20, thrust: 8.11 },
    { key: 'piston', name: 'Piston', weight: 8.40, thrust: 10.987 },
    { key: 'glass', name: 'Glass', weight: 12.00, thrust: 15.696 },
    { key: 'armored_wheel', name: 'Armored Wheel', weight: 56.70, thrust: 74.164 },
    { key: 'armored_servo', name: 'Armored Servo', weight: 15.00, thrust: 19.62 },
    { key: 'stiff_spring', name: 'Stiff Spring', weight: 12.00, thrust: 15.696 },
    { key: 'metal_wedge', name: 'Metal Wedge', weight: 20.00, thrust: 26.16 },
    { key: 'scrap_wedge', name: 'Scrap Wedge', weight: 6.00, thrust: 7.848 },
    { key: 'wood_wedge', name: 'Wood Wedge', weight: 3.60, thrust: 4.709 },
    { key: 'flag', name: 'Flag (only 1)', weight: 5.30, thrust: 6.932 },
    { key: 'dynamite', name: 'Dynamite', weight: 10.50, thrust: 13.734 },
    { key: 'explosive', name: 'Explosive', weight: 11.30, thrust: 14.78 },
    { key: 'destructive', name: 'Destructive', weight: 3.30, thrust: 4.316 },
    { key: 'thruster_v2', name: 'Thruster V2', weight: 9.40, thrust: 12.295 },
    { key: 'missile_launcher', name: 'Missile Launcher', weight: 19.80, thrust: 25.898 },
    { key: 'mounted_lmg', name: 'Mounted LMG', weight: 16.50, thrust: 21.582 },
    { key: 'bearing_2_5', name: 'Bearing 2.5', weight: 2.50, thrust: 3.27 },
    { key: 'armored_bearing', name: 'Armored Bearing', weight: 5.30, thrust: 6.932 },
    { key: 'flak_cannon', name: 'Flak Cannon', weight: 30.50, thrust: 39.894 },
    { key: 'laser', name: 'Laser', weight: 2.40, thrust: 3.139 },
    { key: 'hammer', name: 'Hammer', weight: 33.50, thrust: 43.818 },
    { key: 'rubber_wedge', name: 'Rubber Wedge', weight: 6.00, thrust: 7.848 },
    { key: 'cardboard', name: 'Cardboard', weight: 0.80, thrust: 1.046 },
    { key: 'rubber', name: 'Rubber', weight: 12.00, thrust: 15.696 },
    { key: 'titanium', name: 'Titanium', weight: 12.00, thrust: 15.696 },
    { key: 'monster_wheel', name: 'Monster Wheel', weight: 177.90, thrust: 232.693 },
    { key: 'monster_piston', name: 'Monster Piston', weight: 8.40, thrust: 10.987 },
    { key: 'monster_servo', name: 'Monster Servo', weight: 15.00, thrust: 19.62 },
    { key: 'minigun', name: 'Minigun', weight: 9.40, thrust: 12.295 },
    { key: 'grenade_launcher', name: 'Grenade Launcher', weight: 2.80, thrust: 3.662 },
    { key: 'pontoon', name: 'Pontoon', weight: 25.20, thrust: 32.962 },
    { key: 'boat_propeller', name: 'Boat Propeller', weight: 6.60, thrust: 8.633 }
];

// Create block lookup map
const blockMap = {};
blockData.forEach(block => {
    blockMap[block.key] = block;
});

let blockInputCount = 0;

// Tab switching functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active from all buttons and content
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active to clicked button
        button.classList.add('active');

        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');

        // Initialize reference table if showing reference tab
        if (tabId === 'reference-tab') {
            initializeReferenceTable();
        }
    });
});

// Add block input functionality
document.getElementById('addBlockBtn').addEventListener('click', () => {
    addBlockInput();
});

function createBlockSelect(excludeKeys = []) {
    let options = '<option value="">-- Select Block Type --</option>';
    blockData.forEach(block => {
        if (!excludeKeys.includes(block.key)) {
            options += `<option value="${block.key}">${block.name} (${block.weight.toFixed(2)} kg)</option>`;
        }
    });
    return options;
}

function getSelectedBlocks() {
    const container = document.getElementById('blockInputContainer');
    const selects = container.querySelectorAll('.block-type-select');
    const selected = [];
    selects.forEach(select => {
        if (select.value) {
            selected.push(select.value);
        }
    });
    return selected;
}

function addBlockInput() {
    const container = document.getElementById('blockInputContainer');
    const groups = container.querySelectorAll('.block-input-group');
    
    // Check if there's already 41 blocks (max possible)
    if (groups.length >= 41) {
        alert('You have already added all available blocks!');
        return;
    }

    const newId = blockInputCount++;
    const blockGroup = document.createElement('div');
    blockGroup.className = 'block-input-group';
    blockGroup.innerHTML = `
        <div class="search-wrapper">
            <input type="text" class="block-search" id="search${newId}" placeholder="Search blocks...">
            <select id="blockType${newId}" class="block-type-select">
                ${createBlockSelect()}
            </select>
        </div>
        <label for="blockCount${newId}">Quantity:</label>
        <input type="number" id="blockCount${newId}" class="block-count-input" min="0" placeholder="0">
        <button class="btn-remove" onclick="removeBlockInput(${newId})">Remove</button>
    `;

    container.appendChild(blockGroup);

    // Setup search and change handlers
    const select = blockGroup.querySelector(`#blockType${newId}`);
    const search = blockGroup.querySelector(`#search${newId}`);
    const countInput = blockGroup.querySelector(`#blockCount${newId}`);

    // Search functionality
    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const selected = getSelectedBlocks();
        let options = '<option value="">-- Select Block Type --</option>';
        
        blockData.forEach(block => {
            if (block.name.toLowerCase().includes(query) && !selected.includes(block.key)) {
                options += `<option value="${block.key}">${block.name} (${block.weight.toFixed(2)} kg)</option>`;
            }
        });
        
        select.innerHTML = options;
    });

    // Update dropdown when selection changes
    select.addEventListener('change', (e) => {
        search.value = '';
        recalculateWeight();
        updateAllBlockSelects();
    });

    // Real-time calculation on count change
    countInput.addEventListener('input', () => {
        recalculateWeight();
    });
}

function updateAllBlockSelects() {
    const container = document.getElementById('blockInputContainer');
    const groups = container.querySelectorAll('.block-input-group');
    const selected = getSelectedBlocks();

    groups.forEach(group => {
        const select = group.querySelector('.block-type-select');
        const search = group.querySelector('.block-search');
        const currentValue = select.value;

        // Rebuild options excluding selected blocks
        let options = '<option value="">-- Select Block Type --</option>';
        blockData.forEach(block => {
            // Show this block if it's not selected, or if it's the current selection
            if (!selected.includes(block.key) || block.key === currentValue) {
                options += `<option value="${block.key}">${block.name} (${block.weight.toFixed(2)} kg)</option>`;
            }
        });

        select.innerHTML = options;
        select.value = currentValue;
    });
}

function removeBlockInput(id) {
    const container = document.getElementById('blockInputContainer');
    const groups = container.querySelectorAll('.block-input-group');
    
    const groupToRemove = Array.from(groups).find(group => {
        const select = group.querySelector('select');
        return select.id === `blockType${id}`;
    });

    if (groupToRemove) {
        groupToRemove.remove();
        updateAllBlockSelects();
        recalculateWeight();
    }
}

function recalculateWeight() {
    const container = document.getElementById('blockInputContainer');
    const blockGroups = container.querySelectorAll('.block-input-group');

    let totalWeight = 0;
    let totalThrust = 0;
    let thrusterCount = 0;
    let thrusterThrustAmount = 0;
    let blockSummary = [];

    blockGroups.forEach(group => {
        const select = group.querySelector('select');
        const input = group.querySelector('input');
        const blockKey = select.value;
        const count = parseInt(input.value) || 0;

        if (blockKey && count > 0) {
            const blockInfo = blockMap[blockKey];
            const blockWeight = blockInfo.weight * count;
            const blockThrust = blockInfo.thrust * count;
            
            totalWeight += blockWeight;
            totalThrust += blockThrust;

            // Track thrusters
            if (blockKey === 'thruster' || blockKey === 'thruster_v2') {
                thrusterCount += count;
                thrusterThrustAmount += blockThrust;
            }
            
            blockSummary.push({
                name: blockInfo.name,
                count: count,
                weight: blockWeight,
                thrust: blockThrust
            });
        }
    });

    // Update results
    document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalThrustResult').textContent = (totalThrust * 150).toFixed(2) + ' N';
    
    // Update thruster info
    if (thrusterCount === 0) {
        document.getElementById('thrusterWarning').innerHTML = '<span class="warning">⚠️ No thrusters added! You need at least 1 thruster to achieve neutral buoyancy.</span>';
    } else {
        document.getElementById('thrusterWarning').innerHTML = `<span class="info">✓ Thrusters: ${thrusterCount} | Thruster Thrust: ${(thrusterThrustAmount * 150).toFixed(2)} N</span>`;
    }

    // Display block breakdown
    let breakdownHTML = '<h4>Block Breakdown:</h4><table class="breakdown-table"><tr><th>Block</th><th>Quantity</th><th>Weight</th><th>Thrust</th></tr>';
    blockSummary.forEach(block => {
        breakdownHTML += `<tr><td>${block.name}</td><td>${block.count}</td><td>${block.weight.toFixed(2)} kg</td><td>${(block.thrust * 150).toFixed(2)} N</td></tr>`;
    });
    breakdownHTML += '</table>';
    
    document.getElementById('weightBreakdown').innerHTML = breakdownHTML;
}

// Quick thrust calculator with real-time update
document.getElementById('machineWeight').addEventListener('input', () => {
    const weightInput = document.getElementById('machineWeight').value;

    if (weightInput && weightInput > 0) {
        const machineWeight = parseFloat(weightInput);
        const thrustNewtons = (9.81 * machineWeight) / 150;
        document.getElementById('thrustResult').textContent = (thrustNewtons * 150).toFixed(2) + ' N';
    } else {
        document.getElementById('thrustResult').textContent = '--';
    }
});

// Reference table with search
function initializeReferenceTable() {
    const referenceTable = document.getElementById('referenceTable');
    const searchInput = document.getElementById('referenceSearch');

    function renderTable(filter = '') {
        let tableHTML = '<table class="reference-table"><tr><th>Block Name</th><th>Weight</th><th>Thrust to Float</th></tr>';
        blockData.forEach(block => {
            if (block.name.toLowerCase().includes(filter.toLowerCase())) {
                tableHTML += `<tr><td>${block.name}</td><td>${block.weight.toFixed(2)} kg</td><td>${(block.thrust * 150).toFixed(2)} N</td></tr>`;
            }
        });
        tableHTML += '</table>';
        referenceTable.innerHTML = tableHTML;
    }

    // Initial render
    renderTable();

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTable(e.target.value);
        });
    }
}

// Initialize first block input on page load
window.addEventListener('DOMContentLoaded', () => {
    addBlockInput();
    initializeReferenceTable();
});
