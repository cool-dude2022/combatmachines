// Combat Machines block data with weights and thrust required to float
const blockData = {
    wood: { weight: 8.00, thrust: 10.464 },
    scrap: { weight: 12.00, thrust: 15.696 },
    metal: { weight: 40.00, thrust: 52.32 },
    seat: { weight: 3.40, thrust: 4.447 },
    wheel: { weight: 21.90, thrust: 28.645 },
    servo: { weight: 7.00, thrust: 9.156 },
    spring: { weight: 5.60, thrust: 7.325 },
    spike: { weight: 2.00, thrust: 2.616 },
    saw: { weight: 4.50, thrust: 5.886 },
    thruster: { weight: 6.20, thrust: 8.11 },
    piston: { weight: 8.40, thrust: 10.987 },
    glass: { weight: 12.00, thrust: 15.696 },
    armored_wheel: { weight: 56.70, thrust: 74.164 },
    armored_servo: { weight: 15.00, thrust: 19.62 },
    stiff_spring: { weight: 12.00, thrust: 15.696 },
    metal_wedge: { weight: 20.00, thrust: 26.16 },
    scrap_wedge: { weight: 6.00, thrust: 7.848 },
    wood_wedge: { weight: 3.60, thrust: 4.709 },
    flag: { weight: 5.30, thrust: 6.932 },
    dynamite: { weight: 10.50, thrust: 13.734 },
    explosive: { weight: 11.30, thrust: 14.78 },
    destructive: { weight: 3.30, thrust: 4.316 },
    thruster_v2: { weight: 9.40, thrust: 12.295 },
    missile_launcher: { weight: 19.80, thrust: 25.898 },
    mounted_lmg: { weight: 16.50, thrust: 21.582 },
    bearing_2_5: { weight: 2.50, thrust: 3.27 },
    armored_bearing: { weight: 5.30, thrust: 6.932 },
    flak_cannon: { weight: 30.50, thrust: 39.894 },
    laser: { weight: 2.40, thrust: 3.139 },
    hammer: { weight: 33.50, thrust: 43.818 },
    rubber_wedge: { weight: 6.00, thrust: 7.848 },
    cardboard: { weight: 0.80, thrust: 1.046 },
    rubber: { weight: 12.00, thrust: 15.696 },
    titanium: { weight: 12.00, thrust: 15.696 },
    monster_wheel: { weight: 177.90, thrust: 232.693 },
    monster_piston: { weight: 8.40, thrust: 10.987 },
    monster_servo: { weight: 15.00, thrust: 19.62 },
    minigun: { weight: 9.40, thrust: 12.295 },
    grenade_launcher: { weight: 2.80, thrust: 3.662 },
    pontoon: { weight: 25.20, thrust: 32.962 },
    boat_propeller: { weight: 6.60, thrust: 8.633 }
};

// Create sorted block names for dropdown
const blockNames = Object.keys(blockData).sort().map(key => ({
    value: key,
    display: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}));

let blockInputCount = 1;

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
    });
});

// Add block input functionality
document.getElementById('addBlockBtn').addEventListener('click', () => {
    addBlockInput();
});

function createBlockSelect() {
    let options = '<option value="">-- Select Block Type --</option>';
    blockNames.forEach(block => {
        options += `<option value="${block.value}">${block.display} (${blockData[block.value].weight.toFixed(2)} kg)</option>`;
    });
    return options;
}

function addBlockInput() {
    const container = document.getElementById('blockInputContainer');
    const newId = blockInputCount;

    const blockGroup = document.createElement('div');
    blockGroup.className = 'block-input-group';
    blockGroup.innerHTML = `
        <label for="blockType${newId}">Block Type:</label>
        <select id="blockType${newId}" class="block-type-select">
            ${createBlockSelect()}
        </select>
        <label for="blockCount${newId}">Quantity:</label>
        <input type="number" id="blockCount${newId}" class="block-count-input" min="0" placeholder="Number of blocks">
        <button class="btn-remove" onclick="removeBlockInput(${newId})">Remove</button>
    `;

    container.appendChild(blockGroup);
    blockInputCount++;
}

function removeBlockInput(id) {
    const container = document.getElementById('blockInputContainer');
    const inputs = container.querySelectorAll('.block-input-group');
    
    // Prevent removing the last input
    if (inputs.length === 1) {
        alert('You must have at least one block type.');
        return;
    }

    const groupToRemove = Array.from(inputs).find(group => {
        const select = group.querySelector('select');
        return select.id === `blockType${id}`;
    });

    if (groupToRemove) {
        groupToRemove.remove();
    }
}

// Calculate weight and thrust from blocks
document.getElementById('calculateWeightBtn').addEventListener('click', () => {
    const container = document.getElementById('blockInputContainer');
    const blockGroups = container.querySelectorAll('.block-input-group');

    let totalWeight = 0;
    let totalThrust = 0;
    let isValid = true;
    let blockSummary = [];

    blockGroups.forEach(group => {
        const select = group.querySelector('select');
        const input = group.querySelector('input');
        const blockType = select.value;
        const count = parseInt(input.value) || 0;

        if (blockType && count > 0) {
            const blockInfo = blockData[blockType];
            const blockWeight = blockInfo.weight * count;
            const blockThrust = blockInfo.thrust * count;
            
            totalWeight += blockWeight;
            totalThrust += blockThrust;
            
            blockSummary.push({
                name: select.options[select.selectedIndex].text.split('(')[0].trim(),
                count: count,
                weight: blockWeight,
                thrust: blockThrust
            });
        } else if ((blockType && count === 0) || (!blockType && count > 0)) {
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Please select a block type AND enter a quantity for all entries.');
        return;
    }

    if (totalWeight === 0) {
        alert('Please add at least one block with a quantity greater than 0.');
        return;
    }

    // Display results
    document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalThrustResult').textContent = totalThrust.toFixed(3) + ' N';
    
    // Display block breakdown
    let breakdownHTML = '<h4>Block Breakdown:</h4><table class="breakdown-table"><tr><th>Block</th><th>Quantity</th><th>Weight</th><th>Thrust</th></tr>';
    blockSummary.forEach(block => {
        breakdownHTML += `<tr><td>${block.name}</td><td>${block.count}</td><td>${block.weight.toFixed(2)} kg</td><td>${block.thrust.toFixed(3)} N</td></tr>`;
    });
    breakdownHTML += '</table>';
    
    document.getElementById('weightBreakdown').innerHTML = breakdownHTML;
});

// Calculate thrust from weight
document.getElementById('calculateThrustBtn').addEventListener('click', () => {
    const weightInput = document.getElementById('machineWeight').value;

    if (!weightInput || weightInput <= 0) {
        alert('Please enter a valid machine weight.');
        return;
    }

    const machineWeight = parseFloat(weightInput);

    // Formula: Thrust = (gravity * weight) / 150 = (9.81 * weight) / 150
    // Simplified: Thrust = weight * 0.0654
    const thrustNewtons = (9.81 * machineWeight) / 150;

    document.getElementById('thrustResult').textContent = thrustNewtons.toFixed(3) + ' N';
});

// Allow Enter key to calculate
document.getElementById('machineWeight').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('calculateThrustBtn').click();
    }
});

// Populate block reference table
window.addEventListener('DOMContentLoaded', () => {
    const referenceTable = document.getElementById('referenceTable');
    if (referenceTable) {
        let tableHTML = '<table class="reference-table"><tr><th>Block Name</th><th>Weight</th><th>Thrust to Float</th></tr>';
        blockNames.forEach(block => {
            const data = blockData[block.value];
            tableHTML += `<tr><td>${block.display}</td><td>${data.weight.toFixed(2)} kg</td><td>${data.thrust.toFixed(3)} N</td></tr>`;
        });
        tableHTML += '</table>';
        referenceTable.innerHTML = tableHTML;
    }
});
