// Combat Machines block data with weights and thrust required to float
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

const PINNED_KEYS = ['thruster', 'thruster_v2'];

const blockMap = {};
blockData.forEach(block => { blockMap[block.key] = block; });

let blockInputCount = 0;
const STORAGE_KEY = 'combatMachinesCalculator';

// Tab switching
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

// Action buttons
document.getElementById('addBlockBtn').addEventListener('click', () => addBlockInput());

document.getElementById('clearAllBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all blocks? This cannot be undone.')) {
        document.getElementById('blockInputContainer').innerHTML = '';
        blockInputCount = 0;
        PINNED_KEYS.forEach(key => {
            const el = document.getElementById('pinnedCount_' + key);
            if (el) el.value = 0;
        });
        addBlockInput();
        recalculateWeight();
        clearLocalStorage();
    }
});

document.getElementById('exportBtn').addEventListener('click', exportCalculation);
document.getElementById('loadBtn').addEventListener('click', () => document.getElementById('fileInput').click());

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            loadCalculation(JSON.parse(event.target.result));
            alert('Calculation loaded successfully!');
        } catch(err) {
            alert('Error loading file. Please make sure it\'s a valid export file.');
        }
    };
    reader.readAsText(file);
});

// Dropdown management
let activeDropdown = null;

function closeAllDropdowns() {
    if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) closeAllDropdowns();
});

function getSelectedBlockKeys(excludeRowId) {
    const container = document.getElementById('blockInputContainer');
    return Array.from(container.querySelectorAll('.block-input-group'))
        .filter(g => excludeRowId == null || g.dataset.rowId !== String(excludeRowId))
        .map(g => { const h = g.querySelector('.block-type-hidden'); return h ? h.value : ''; })
        .filter(Boolean);
}

function openDropdown(wrapper, searchInput, hiddenInput, rowId, onPick) {
    closeAllDropdowns();

    const usedKeys = getSelectedBlockKeys(rowId);
    const available = blockData.filter(b => !PINNED_KEYS.includes(b.key) && !usedKeys.includes(b.key));
    const query = searchInput.value.trim().toLowerCase();
    const filtered = query ? available.filter(b => b.name.toLowerCase().includes(query)) : available;

    if (filtered.length === 0) return;

    const dropdown = document.createElement('ul');
    dropdown.className = 'block-dropdown';

    filtered.forEach(block => {
        const li = document.createElement('li');
        li.textContent = block.name + ' (' + block.weight.toFixed(2) + ' kg)';
        if (block.key === hiddenInput.value) li.classList.add('selected');
        li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            searchInput.value = block.name;
            hiddenInput.value = block.key;
            closeAllDropdowns();
            onPick();
        });
        dropdown.appendChild(li);
    });

    wrapper.appendChild(dropdown);
    activeDropdown = dropdown;
}

// Pinned thruster rows
function initPinnedThrusters() {
    const section = document.getElementById('pinnedThrusterSection');
    section.innerHTML = '';

    [
        { key: 'thruster', label: 'Thruster' },
        { key: 'thruster_v2', label: 'Thruster V2' }
    ].forEach(function(item) {
        const info = blockMap[item.key];
        const row = document.createElement('div');
        row.className = 'block-input-group pinned-thruster-group';
        row.dataset.pinnedKey = item.key;
        row.innerHTML =
            '<div class="pinned-label-wrapper">' +
                '<label>🔒 ' + item.label + '</label>' +
                '<small>' + info.weight.toFixed(2) + ' kg each</small>' +
            '</div>' +
            '<label>Quantity:</label>' +
            '<input type="number" class="block-count-input pinned-count" id="pinnedCount_' + item.key + '" min="0" placeholder="0" value="0">' +
            '<span class="pinned-spacer"></span>';
        section.appendChild(row);
        row.querySelector('.pinned-count').addEventListener('input', () => {
            recalculateWeight();
            saveToLocalStorage();
        });
    });
}

// Regular block rows
function addBlockInput(presetKey, presetCount) {
    presetKey = presetKey || null;
    presetCount = presetCount || 0;

    const container = document.getElementById('blockInputContainer');
    const available = blockData.filter(b => !PINNED_KEYS.includes(b.key));
    const currentRows = container.querySelectorAll('.block-input-group').length;

    if (currentRows >= available.length) {
        alert('You have already added all available blocks!');
        return;
    }

    const newId = blockInputCount++;
    const blockGroup = document.createElement('div');
    blockGroup.className = 'block-input-group';
    blockGroup.dataset.rowId = newId;

    blockGroup.innerHTML =
        '<div class="search-wrapper">' +
            '<input type="text" class="block-search" id="search' + newId + '" placeholder="Select a block..." autocomplete="off">' +
            '<input type="hidden" class="block-type-hidden" id="blockType' + newId + '" value="">' +
            '<button type="button" class="caret-btn" tabindex="-1">&#9660;</button>' +
        '</div>' +
        '<label for="blockCount' + newId + '">Quantity:</label>' +
        '<input type="number" id="blockCount' + newId + '" class="block-count-input" min="0" placeholder="0" value="' + (presetCount || '') + '">' +
        '<button class="btn-remove" onclick="removeBlockInput(' + newId + ')">Remove</button>';

    container.appendChild(blockGroup);

    const wrapper     = blockGroup.querySelector('.search-wrapper');
    const searchInput = blockGroup.querySelector('#search' + newId);
    const hiddenInput = blockGroup.querySelector('#blockType' + newId);
    const caretBtn    = blockGroup.querySelector('.caret-btn');
    const countInput  = blockGroup.querySelector('#blockCount' + newId);

    const onPick = () => { recalculateWeight(); saveToLocalStorage(); };

    searchInput.addEventListener('focus', () => openDropdown(wrapper, searchInput, hiddenInput, newId, onPick));
    searchInput.addEventListener('input', () => openDropdown(wrapper, searchInput, hiddenInput, newId, onPick));

    caretBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (activeDropdown && wrapper.contains(activeDropdown)) {
            closeAllDropdowns();
        } else {
            searchInput.focus();
            openDropdown(wrapper, searchInput, hiddenInput, newId, onPick);
        }
    });

    countInput.addEventListener('input', () => { recalculateWeight(); saveToLocalStorage(); });

    if (presetKey && blockMap[presetKey]) {
        hiddenInput.value = presetKey;
        searchInput.value = blockMap[presetKey].name;
    }
}

function removeBlockInput(id) {
    const group = document.querySelector('#blockInputContainer [data-row-id="' + id + '"]');
    if (group) { group.remove(); recalculateWeight(); saveToLocalStorage(); }
}

// Recalculate — thrust values used as-is (no * 150)
function recalculateWeight() {
    let totalWeight = 0;
    let totalThrust = 0;
    const blockSummary = [];

    PINNED_KEYS.forEach(key => {
        const input = document.getElementById('pinnedCount_' + key);
        if (!input) return;
        const count = parseInt(input.value) || 0;
        if (count > 0) {
            const info = blockMap[key];
            totalWeight += info.weight * count;
            totalThrust += info.thrust * count;
            blockSummary.push({ name: info.name, count: count, weight: info.weight * count, thrust: info.thrust * count });
        }
    });

    document.getElementById('blockInputContainer').querySelectorAll('.block-input-group').forEach(group => {
        const hidden   = group.querySelector('.block-type-hidden');
        const input    = group.querySelector('.block-count-input');
        const blockKey = hidden ? hidden.value : '';
        const count    = parseInt(input ? input.value : 0) || 0;
        if (blockKey && count > 0) {
            const info = blockMap[blockKey];
            totalWeight += info.weight * count;
            totalThrust += info.thrust * count;
            blockSummary.push({ name: info.name, count: count, weight: info.weight * count, thrust: info.thrust * count });
        }
    });

    document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalThrustResult').textContent = totalThrust.toFixed(3) + ' N';
    document.getElementById('thrusterWarning').innerHTML = '';

    let html = '<h4>Block Breakdown:</h4><table class="breakdown-table"><tr><th>Block</th><th>Quantity</th><th>Weight</th><th>Thrust</th></tr>';
    blockSummary.forEach(b => {
        html += '<tr><td>' + b.name + '</td><td>' + b.count + '</td><td>' + b.weight.toFixed(2) + ' kg</td><td>' + b.thrust.toFixed(3) + ' N</td></tr>';
    });
    html += '</table>';
    document.getElementById('weightBreakdown').innerHTML = html;
}

// Quick thrust calculator — no * 150
document.getElementById('machineWeight').addEventListener('input', () => {
    const val = parseFloat(document.getElementById('machineWeight').value);
    document.getElementById('thrustResult').textContent = (val > 0) ? (9.81 * val).toFixed(2) + ' N' : '--';
});

// Reference table — thrust as-is
function initializeReferenceTable() {
    const referenceTable = document.getElementById('referenceTable');
    const searchInput = document.getElementById('referenceSearch');

    function renderTable(filter) {
        filter = filter || '';
        let html = '<table class="reference-table"><tr><th>Block Name</th><th>Weight</th><th>Thrust to Float</th></tr>';
        blockData.forEach(block => {
            if (block.name.toLowerCase().includes(filter.toLowerCase())) {
                html += '<tr><td>' + block.name + '</td><td>' + block.weight.toFixed(2) + ' kg</td><td>' + block.thrust.toFixed(3) + ' N</td></tr>';
            }
        });
        html += '</table>';
        referenceTable.innerHTML = html;
    }

    renderTable();
    if (searchInput) searchInput.addEventListener('input', (e) => renderTable(e.target.value));
}

// Export
function exportCalculation() {
    const blocks = [];
    PINNED_KEYS.forEach(key => {
        const count = parseInt(document.getElementById('pinnedCount_' + key) ? document.getElementById('pinnedCount_' + key).value : 0) || 0;
        if (count > 0) blocks.push({ blockKey: key, blockName: blockMap[key].name, count: count, pinned: true });
    });
    document.getElementById('blockInputContainer').querySelectorAll('.block-input-group').forEach(group => {
        const blockKey = group.querySelector('.block-type-hidden') ? group.querySelector('.block-type-hidden').value : '';
        const count = parseInt(group.querySelector('.block-count-input') ? group.querySelector('.block-count-input').value : 0) || 0;
        if (blockKey && count > 0) blocks.push({ blockKey: blockKey, blockName: blockMap[blockKey].name, count: count });
    });
    const data = { version: '2.0', timestamp: new Date().toISOString(), blocks: blocks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'combat-machine-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Load
function loadCalculation(data) {
    document.getElementById('blockInputContainer').innerHTML = '';
    blockInputCount = 0;
    PINNED_KEYS.forEach(key => { const el = document.getElementById('pinnedCount_' + key); if (el) el.value = 0; });

    if (!data.blocks || !data.blocks.length) { addBlockInput(); recalculateWeight(); return; }

    data.blocks.forEach(block => {
        if (PINNED_KEYS.includes(block.blockKey)) {
            const el = document.getElementById('pinnedCount_' + block.blockKey);
            if (el) el.value = block.count;
        } else {
            addBlockInput(block.blockKey, block.count);
        }
    });
    recalculateWeight();
    saveToLocalStorage();
}

// Local storage
function saveToLocalStorage() {
    const blocks = [];
    PINNED_KEYS.forEach(key => {
        const el = document.getElementById('pinnedCount_' + key);
        blocks.push({ blockKey: key, count: parseInt(el ? el.value : 0) || 0, pinned: true });
    });
    document.getElementById('blockInputContainer').querySelectorAll('.block-input-group').forEach(group => {
        const blockKey = group.querySelector('.block-type-hidden') ? group.querySelector('.block-type-hidden').value : '';
        const count = parseInt(group.querySelector('.block-count-input') ? group.querySelector('.block-count-input').value : 0) || 0;
        if (blockKey) blocks.push({ blockKey: blockKey, count: count });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

function clearLocalStorage() { localStorage.removeItem(STORAGE_KEY); }

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        const blocks = JSON.parse(saved);
        document.getElementById('blockInputContainer').innerHTML = '';
        blockInputCount = 0;
        PINNED_KEYS.forEach(key => { const el = document.getElementById('pinnedCount_' + key); if (el) el.value = 0; });
        blocks.forEach(block => {
            if (PINNED_KEYS.includes(block.blockKey)) {
                const el = document.getElementById('pinnedCount_' + block.blockKey);
                if (el) el.value = block.count;
            } else {
                addBlockInput(block.blockKey, block.count);
            }
        });
        recalculateWeight();
    } catch(e) {
        console.error('Error loading from local storage:', e);
        addBlockInput();
    }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    initPinnedThrusters();
    loadFromLocalStorage();
    if (document.getElementById('blockInputContainer').children.length === 0) addBlockInput();
    initializeReferenceTable();
});
