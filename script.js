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

// Blocks excluded from the regular picker (handled by pinned rows)
const PINNED_KEYS = ['thruster', 'thruster_v2'];

// Create block lookup map
const blockMap = {};
blockData.forEach(block => {
    blockMap[block.key] = block;
});

let blockInputCount = 0;
const STORAGE_KEY = 'combatMachinesCalculator';

// ─── Tab switching ────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        if (tabId === 'reference-tab') initializeReferenceTable();
    });
});

// ─── Action buttons ───────────────────────────────────────────────────────────
document.getElementById('addBlockBtn').addEventListener('click', () => addBlockInput());

document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all blocks? This cannot be undone.')) {
        const container = document.getElementById('blockInputContainer');
        container.innerHTML = '';
        blockInputCount = 0;
        addBlockInput();
        recalculateWeight();
        clearLocalStorage();
    }
});

document.getElementById('exportBtn').addEventListener('click', () => exportCalculation());

document.getElementById('loadBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                loadCalculation(data);
                alert('Calculation loaded successfully!');
            } catch (error) {
                alert('Error loading file. Please make sure it\'s a valid export file.');
            }
        };
        reader.readAsText(file);
    }
});

// ─── Autocomplete helper ──────────────────────────────────────────────────────
/**
 * Attaches an autocomplete dropdown to a text input.
 * @param {HTMLInputElement} input  - the search text box
 * @param {Array}            items  - array of { key, name, weight }
 * @param {Function}         onPick - called with the chosen block key
 */
function attachAutocomplete(input, items, onPick) {
    let dropdown = null;

    function closeDropdown() {
        if (dropdown) { dropdown.remove(); dropdown = null; }
    }

    input.addEventListener('input', () => {
        closeDropdown();
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        const matches = items.filter(b => b.name.toLowerCase().includes(query));
        if (matches.length === 0) return;

        dropdown = document.createElement('ul');
        dropdown.className = 'autocomplete-dropdown';

        matches.forEach(block => {
            const li = document.createElement('li');
            li.textContent = `${block.name} (${block.weight.toFixed(2)} kg)`;
            li.addEventListener('mousedown', (e) => {
                e.preventDefault(); // keep focus so blur doesn't fire first
                input.value = block.name;
                closeDropdown();
                onPick(block.key);
            });
            dropdown.appendChild(li);
        });

        // Position below the input
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);
    });

    input.addEventListener('blur', () => {
        // Small delay so mousedown on a list item fires first
        setTimeout(closeDropdown, 150);
    });

    input.addEventListener('keydown', (e) => {
        if (!dropdown) return;
        const items = dropdown.querySelectorAll('li');
        const active = dropdown.querySelector('li.ac-active');
        let idx = Array.from(items).indexOf(active);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (active) active.classList.remove('ac-active');
            idx = (idx + 1) % items.length;
            items[idx].classList.add('ac-active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (active) active.classList.remove('ac-active');
            idx = (idx - 1 + items.length) % items.length;
            items[idx].classList.add('ac-active');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (active) active.dispatchEvent(new MouseEvent('mousedown'));
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });
}

// ─── Pinned thruster rows ─────────────────────────────────────────────────────
function initPinnedThrusters() {
    const section = document.getElementById('pinnedThrusterSection');
    section.innerHTML = ''; // reset on clear

    [
        { key: 'thruster',    label: 'Thruster' },
        { key: 'thruster_v2', label: 'Thruster V2' }
    ].forEach(({ key, label }) => {
        const info = blockMap[key];
        const row = document.createElement('div');
        row.className = 'block-input-group pinned-thruster-group';
        row.dataset.pinnedKey = key;
        row.innerHTML = `
            <div class="pinned-label-wrapper">
                <label>🔒 ${label}</label>
                <small>${info.weight.toFixed(2)} kg each</small>
            </div>
            <label>Quantity:</label>
            <input type="number" class="block-count-input pinned-count" id="pinnedCount_${key}" min="0" placeholder="0" value="0">
            <span class="pinned-spacer"></span>
        `;
        section.appendChild(row);

        row.querySelector('.pinned-count').addEventListener('input', () => {
            recalculateWeight();
            saveToLocalStorage();
        });
    });
}

// ─── Regular block rows ───────────────────────────────────────────────────────
function addBlockInput(presetKey = null, presetCount = 0) {
    const container = document.getElementById('blockInputContainer');
    const groups = container.querySelectorAll('.block-input-group');

    // Available blocks = all minus pinned ones
    const available = blockData.filter(b => !PINNED_KEYS.includes(b.key));

    if (groups.length >= available.length) {
        alert('You have already added all available blocks!');
        return;
    }

    const newId = blockInputCount++;
    const blockGroup = document.createElement('div');
    blockGroup.className = 'block-input-group';
    blockGroup.dataset.rowId = newId;

    blockGroup.innerHTML = `
        <div class="search-wrapper">
            <input type="text" class="block-search" id="search${newId}" placeholder="Type to search blocks..." autocomplete="off">
            <input type="hidden" class="block-type-select" id="blockType${newId}" value="">
        </div>
        <label for="blockCount${newId}">Quantity:</label>
        <input type="number" id="blockCount${newId}" class="block-count-input" min="0" placeholder="0" value="${presetCount || ''}">
        <button class="btn-remove" onclick="removeBlockInput(${newId})">Remove</button>
    `;

    container.appendChild(blockGroup);

    const searchInput = blockGroup.querySelector(`#search${newId}`);
    const hiddenInput = blockGroup.querySelector(`#blockType${newId}`);
    const countInput  = blockGroup.querySelector(`#blockCount${newId}`);

    // Build available list excluding already-selected blocks in other rows
    function getAvailableItems() {
        const usedKeys = getSelectedBlockKeys().filter(k => k !== hiddenInput.value);
        return available.filter(b => !usedKeys.includes(b.key));
    }

    attachAutocomplete(searchInput, available, (chosenKey) => {
        hiddenInput.value = chosenKey;
        recalculateWeight();
        saveToLocalStorage();
    });

    // Override the items list dynamically on focus so duplicates are excluded
    searchInput.addEventListener('focus', () => {
        // Re-attach with current available list (simple: just let input event handle it)
    });

    countInput.addEventListener('input', () => {
        recalculateWeight();
        saveToLocalStorage();
    });

    // Preset values when loading
    if (presetKey) {
        const block = blockMap[presetKey];
        if (block) {
            hiddenInput.value = presetKey;
            searchInput.value = block.name;
        }
    }
}

function getSelectedBlockKeys() {
    const container = document.getElementById('blockInputContainer');
    return Array.from(container.querySelectorAll('.block-type-select'))
        .map(h => h.value)
        .filter(Boolean);
}

function removeBlockInput(id) {
    const container = document.getElementById('blockInputContainer');
    const group = container.querySelector(`[data-row-id="${id}"]`);
    if (group) {
        group.remove();
        recalculateWeight();
        saveToLocalStorage();
    }
}

// ─── Recalculate ──────────────────────────────────────────────────────────────
function recalculateWeight() {
    let totalWeight = 0;
    let totalThrust = 0;
    let blockSummary = [];

    // Pinned thrusters
    PINNED_KEYS.forEach(key => {
        const input = document.getElementById(`pinnedCount_${key}`);
        if (!input) return;
        const count = parseInt(input.value) || 0;
        if (count > 0) {
            const info = blockMap[key];
            totalWeight += info.weight * count;
            totalThrust += info.thrust * count;
            blockSummary.push({ name: info.name, count, weight: info.weight * count, thrust: info.thrust * count });
        }
    });

    // Regular blocks
    const container = document.getElementById('blockInputContainer');
    container.querySelectorAll('.block-input-group').forEach(group => {
        const hidden = group.querySelector('.block-type-select');
        const input  = group.querySelector('.block-count-input');
        const blockKey = hidden ? hidden.value : '';
        const count = parseInt(input ? input.value : 0) || 0;

        if (blockKey && count > 0) {
            const info = blockMap[blockKey];
            totalWeight += info.weight * count;
            totalThrust += info.thrust * count;
            blockSummary.push({ name: info.name, count, weight: info.weight * count, thrust: info.thrust * count });
        }
    });

    document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalThrustResult').textContent = (totalThrust * 150).toFixed(2) + ' N';

    // Thruster warning removed per request
    document.getElementById('thrusterWarning').innerHTML = '';

    let breakdownHTML = '<h4>Block Breakdown:</h4><table class="breakdown-table"><tr><th>Block</th><th>Quantity</th><th>Weight</th><th>Thrust</th></tr>';
    blockSummary.forEach(block => {
        breakdownHTML += `<tr><td>${block.name}</td><td>${block.count}</td><td>${block.weight.toFixed(2)} kg</td><td>${(block.thrust * 150).toFixed(2)} N</td></tr>`;
    });
    breakdownHTML += '</table>';
    document.getElementById('weightBreakdown').innerHTML = breakdownHTML;
}

// ─── Quick thrust calculator ──────────────────────────────────────────────────
document.getElementById('machineWeight').addEventListener('input', () => {
    const val = document.getElementById('machineWeight').value;
    if (val && val > 0) {
        const thrust = (9.81 * parseFloat(val));
        document.getElementById('thrustResult').textContent = thrust.toFixed(2) + ' N';
    } else {
        document.getElementById('thrustResult').textContent = '--';
    }
});

// ─── Reference table ──────────────────────────────────────────────────────────
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

    renderTable();
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderTable(e.target.value));
    }
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportCalculation() {
    const blocks = [];

    // Pinned thrusters
    PINNED_KEYS.forEach(key => {
        const input = document.getElementById(`pinnedCount_${key}`);
        const count = parseInt(input ? input.value : 0) || 0;
        if (count > 0) blocks.push({ blockKey: key, blockName: blockMap[key].name, count, pinned: true });
    });

    // Regular blocks
    const container = document.getElementById('blockInputContainer');
    container.querySelectorAll('.block-input-group').forEach(group => {
        const hidden = group.querySelector('.block-type-select');
        const input  = group.querySelector('.block-count-input');
        const blockKey = hidden ? hidden.value : '';
        const count = parseInt(input ? input.value : 0) || 0;
        if (blockKey && count > 0) blocks.push({ blockKey, blockName: blockMap[blockKey].name, count });
    });

    const data = { version: '2.0', timestamp: new Date().toISOString(), blocks };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `combat-machine-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ─── Load ─────────────────────────────────────────────────────────────────────
function loadCalculation(data) {
    const container = document.getElementById('blockInputContainer');
    container.innerHTML = '';
    blockInputCount = 0;

    // Reset pinned counts
    PINNED_KEYS.forEach(key => {
        const input = document.getElementById(`pinnedCount_${key}`);
        if (input) input.value = 0;
    });

    if (!data.blocks || data.blocks.length === 0) {
        addBlockInput();
        recalculateWeight();
        return;
    }

    data.blocks.forEach(block => {
        if (PINNED_KEYS.includes(block.blockKey)) {
            const input = document.getElementById(`pinnedCount_${block.blockKey}`);
            if (input) input.value = block.count;
        } else {
            addBlockInput(block.blockKey, block.count);
        }
    });

    recalculateWeight();
    saveToLocalStorage();
}

// ─── Local storage ────────────────────────────────────────────────────────────
function saveToLocalStorage() {
    const blocks = [];

    PINNED_KEYS.forEach(key => {
        const input = document.getElementById(`pinnedCount_${key}`);
        const count = parseInt(input ? input.value : 0) || 0;
        blocks.push({ blockKey: key, count, pinned: true });
    });

    const container = document.getElementById('blockInputContainer');
    container.querySelectorAll('.block-input-group').forEach(group => {
        const hidden = group.querySelector('.block-type-select');
        const input  = group.querySelector('.block-count-input');
        const blockKey = hidden ? hidden.value : '';
        const count = parseInt(input ? input.value : 0) || 0;
        if (blockKey) blocks.push({ blockKey, count });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const blocks = JSON.parse(saved);
        const container = document.getElementById('blockInputContainer');
        container.innerHTML = '';
        blockInputCount = 0;

        PINNED_KEYS.forEach(key => {
            const input = document.getElementById(`pinnedCount_${key}`);
            if (input) input.value = 0;
        });

        blocks.forEach(block => {
            if (PINNED_KEYS.includes(block.blockKey)) {
                const input = document.getElementById(`pinnedCount_${block.blockKey}`);
                if (input) input.value = block.count;
            } else {
                addBlockInput(block.blockKey, block.count);
            }
        });

        recalculateWeight();
    } catch (error) {
        console.error('Error loading from local storage:', error);
        addBlockInput();
    }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    initPinnedThrusters();
    loadFromLocalStorage();
    if (document.getElementById('blockInputContainer').children.length === 0) {
        addBlockInput();
    }
    initializeReferenceTable();
});
