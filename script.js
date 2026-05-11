// Block weights in kg
const blockWeights = {
    oak: 150,
    spruce: 150,
    birch: 150,
    jungle: 150,
    acacia: 150,
    dark_oak: 150,
    stone: 300,
    dirt: 125,
    sand: 125,
    gravel: 150,
    iron_block: 700,
    gold_block: 1000,
    diamond_block: 1000,
    obsidian: 500
};

// Gravity constant (m/s²)
const GRAVITY = 9.81;

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

function addBlockInput() {
    const container = document.getElementById('blockInputContainer');
    const newId = blockInputCount;

    const blockGroup = document.createElement('div');
    blockGroup.className = 'block-input-group';
    blockGroup.innerHTML = `
        <label for="blockType${newId}">Block Type:</label>
        <select id="blockType${newId}" class="block-type-select">
            <option value="">-- Select Block Type --</option>
            <option value="oak">Oak (150 kg)</option>
            <option value="spruce">Spruce (150 kg)</option>
            <option value="birch">Birch (150 kg)</option>
            <option value="jungle">Jungle (150 kg)</option>
            <option value="acacia">Acacia (150 kg)</option>
            <option value="dark_oak">Dark Oak (150 kg)</option>
            <option value="stone">Stone (300 kg)</option>
            <option value="dirt">Dirt (125 kg)</option>
            <option value="sand">Sand (125 kg)</option>
            <option value="gravel">Gravel (150 kg)</option>
            <option value="iron_block">Iron Block (700 kg)</option>
            <option value="gold_block">Gold Block (1000 kg)</option>
            <option value="diamond_block">Diamond Block (1000 kg)</option>
            <option value="obsidian">Obsidian (500 kg)</option>
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

// Calculate weight from blocks
document.getElementById('calculateWeightBtn').addEventListener('click', () => {
    const container = document.getElementById('blockInputContainer');
    const blockGroups = container.querySelectorAll('.block-input-group');

    let totalWeight = 0;
    let isValid = true;

    blockGroups.forEach(group => {
        const select = group.querySelector('select');
        const input = group.querySelector('input');
        const blockType = select.value;
        const count = parseInt(input.value) || 0;

        if (blockType && count > 0) {
            const blockWeight = blockWeights[blockType];
            totalWeight += blockWeight * count;
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

    document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2) + ' kg';
});

// Calculate thrust from weight
document.getElementById('calculateThrustBtn').addEventListener('click', () => {
    const weightInput = document.getElementById('machineWeight').value;
    const waterDensityInput = document.getElementById('waterDensity').value;

    if (!weightInput || weightInput <= 0) {
        alert('Please enter a valid machine weight.');
        return;
    }

    const machineWeight = parseFloat(weightInput);
    const waterDensity = parseFloat(waterDensityInput) || 1000;

    // Formula: Thrust (N) = Weight (kg) × Gravity (m/s²)
    const thrustNewtons = machineWeight * GRAVITY;
    
    // Convert to kg-force (1 kgf = 9.81 N)
    const thrustKgf = machineWeight;

    document.getElementById('thrustResult').textContent = thrustNewtons.toFixed(2) + ' N';
    document.getElementById('thrustKgfResult').textContent = thrustKgf.toFixed(2) + ' kgf';
});

// Allow Enter key to calculate
document.getElementById('machineWeight').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('calculateThrustBtn').click();
    }
});

// Re-calculate weight when block values change
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('block-type-select') || e.target.classList.contains('block-count-input')) {
        // Optional: Auto-calculate on input change
        // Uncomment the line below for live calculation
        // document.getElementById('calculateWeightBtn').click();
    }
});
