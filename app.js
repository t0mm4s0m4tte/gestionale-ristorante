// --- STATO GLOBALE ---
let currentZone = 'SALA_GRANDE';
let activeTableId = null;
let globalData = null;

// --- GESTIONE UI SCHERMATE ---
const screens = {
    dashboard: document.getElementById('dashboardScreen'),
    order: document.getElementById('orderScreen'),
    admin: document.getElementById('adminScreen'),
    menu: document.getElementById('menuScreen'),
    reservation: document.getElementById('reservationScreen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(s => {
        if(s) s.classList.remove('active');
    });
    screens[screenName].classList.add('active');
    
    if (screenName === 'dashboard') renderTables();
    if (screenName === 'menu') renderMenuAdminScreen();
    if (screenName === 'reservation') renderReservationsScreen();
}

// --- LISTENER DATI REALTIME ---
db.onDataChange((data) => {
    if (data) {
        if (data.tables && !Array.isArray(data.tables)) data.tables = Object.values(data.tables);
        if (data.tables) data.tables = data.tables.filter(t => t != null);

        if (data.menu && !Array.isArray(data.menu)) data.menu = Object.values(data.menu);
        if (data.menu) data.menu = data.menu.filter(t => t != null);

        if (data.reservations && !Array.isArray(data.reservations)) data.reservations = Object.values(data.reservations);
        if (data.reservations) data.reservations = data.reservations.filter(t => t != null);
    }
    
    globalData = data;
    if (screens.dashboard.classList.contains('active')) renderTables();
    if (screens.order.classList.contains('active') && activeTableId) renderOrderScreen();
    if (screens.admin && screens.admin.classList.contains('active')) renderAdminScreen();
    if (screens.menu && screens.menu.classList.contains('active')) renderMenuAdminScreen();
    if (screens.reservation && screens.reservation.classList.contains('active')) renderReservationsScreen();
});

// --- DASHBOARD TAVOLI ---
document.querySelectorAll('#dashboardScreen .zone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#dashboardScreen .zone-btn').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentZone = e.target.dataset.zone;
        renderTables();
    });
});

document.getElementById('reservationFab').addEventListener('click', () => {
    showScreen('reservation');
});

const backToDashboardFromReservationsBtn = document.getElementById('backToDashboardFromReservationsBtn');
if(backToDashboardFromReservationsBtn) {
    backToDashboardFromReservationsBtn.addEventListener('click', () => {
        showScreen('dashboard');
    });
}

function createReservationCard(res) {
    let timeStr = "Orario non definito";
    if (res.dateTime) {
        const d = new Date(res.dateTime);
        timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }
    
    const card = document.createElement('div');
    card.style.background = 'white';
    card.style.borderRadius = '8px';
    card.style.padding = '1rem';
    card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.style.borderLeft = '4px solid var(--primary-color)';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        openReservationActionModal(res);
    });
    
    let assignedTableBadge = '';
    if (res.assignedTableId) {
        const t = globalData.tables ? globalData.tables.find(t => t.id == res.assignedTableId) : null;
        if (t) {
            assignedTableBadge = `<span style="background: #10B981; color: white; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">Tavolo ${t.number}</span>`;
        }
    }
    
    let detailsHtml = `
        <div style="flex: 1; padding-right: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <h3 style="margin: 0; font-size: 1.1rem;">${res.customerName || 'Cliente anonimo'}</h3>
                ${assignedTableBadge}
            </div>
            <div style="color: #64748B; font-size: 0.9rem; margin-bottom: 0.25rem;">👥 ${res.partySize || 2} persone</div>
    `;
    
    if (res.phoneNumber && res.phoneNumber.trim() !== "") {
        detailsHtml += `<div style="color: #64748B; font-size: 0.9rem; margin-bottom: 0.25rem;">📞 ${res.phoneNumber}</div>`;
    }
    
    let badgesHtml = '';
    if (res.extras && res.extras.length > 0) {
        res.extras.forEach(extra => {
            let icon = '';
            if(extra === 'Cani') icon = '🐕 ';
            if(extra === 'Seggiolone') icon = '🪑 ';
            if(extra === 'Carrozzina') icon = '👶 ';
            if(extra === 'Torta Compleanno') icon = '🎂 ';
            badgesHtml += `<span style="display: inline-block; background: #F1F5F9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-right: 0.4rem; margin-bottom: 0.4rem;">${icon}${extra}</span>`;
        });
    }
    if (res.menuType && res.menuType.trim() !== "") {
        let icon = res.menuType === 'Menù di Carne' ? '🥩 ' : '🐟 ';
        badgesHtml += `<span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-right: 0.4rem; margin-bottom: 0.4rem;">${icon}${res.menuType}</span>`;
    }
    
    if (badgesHtml !== '') {
        detailsHtml += `<div style="margin-top: 0.5rem;">${badgesHtml}</div>`;
    }

    if (res.notes && res.notes.trim() !== "") {
        detailsHtml += `<div style="color: #64748B; font-size: 0.9rem; margin-top: 0.5rem;">📝 ${res.notes}</div>`;
    }
    
    detailsHtml += `</div>`;
    
    const timeHtml = `
        <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">
                ${timeStr}
            </div>
        </div>
    `;
    
    card.innerHTML = detailsHtml + timeHtml;
    return card;
}

let currentReservationDate = new Date();

function renderReservationsScreen() {
    if (!globalData) return;
    
    const today = new Date();
    const isToday = currentReservationDate.getDate() === today.getDate() && 
                    currentReservationDate.getMonth() === today.getMonth() && 
                    currentReservationDate.getFullYear() === today.getFullYear();
    
    let displayDate = currentReservationDate.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    displayDate = displayDate.charAt(0).toUpperCase() + displayDate.slice(1);
    
    const displayEl = document.getElementById('currentResDateDisplay');
    if (displayEl) {
        displayEl.textContent = isToday ? "Oggi" : displayDate;
    }
    
    const container = document.getElementById('reservationsListContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let reservations = [];
    if (globalData.reservations) {
        if (Array.isArray(globalData.reservations)) {
            reservations = globalData.reservations.filter(r => r != null);
        } else {
            reservations = Object.values(globalData.reservations).filter(r => r != null);
        }
    }
    
    reservations.sort((a, b) => (a.dateTime || 0) - (b.dateTime || 0));

    const yyyy = currentReservationDate.getFullYear();
    const mm = String(currentReservationDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentReservationDate.getDate()).padStart(2, '0');
    const targetDateKey = `${yyyy}-${mm}-${dd}`;

    const grouped = {
        pranzo: [],
        cena: []
    };
    
    reservations.forEach(res => {
        if (!res.dateTime) return;
        const d = new Date(res.dateTime);
        const r_yyyy = d.getFullYear();
        const r_mm = String(d.getMonth() + 1).padStart(2, '0');
        const r_dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${r_yyyy}-${r_mm}-${r_dd}`;
        
        if (dateKey === targetDateKey) {
            const hour = d.getHours();
            if (hour < 16) {
                grouped.pranzo.push(res);
            } else {
                grouped.cena.push(res);
            }
        }
    });

    if (grouped.pranzo.length === 0 && grouped.cena.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: #666; margin-top: 2rem;">Nessuna prenotazione per questo giorno.</p>';
        return;
    }

    if (grouped.pranzo.length > 0) {
        const pranzoHeader = document.createElement('h3');
        pranzoHeader.style.fontSize = '1.1rem';
        pranzoHeader.style.color = '#D97706'; 
        pranzoHeader.style.margin = '0 0 0.8rem 0';
        pranzoHeader.innerHTML = '☀️ Servizio del Pranzo';
        container.appendChild(pranzoHeader);
        
        const pranzoContainer = document.createElement('div');
        pranzoContainer.style.display = 'flex';
        pranzoContainer.style.flexDirection = 'column';
        pranzoContainer.style.gap = '0.8rem';
        pranzoContainer.style.marginBottom = '1.5rem';
        
        grouped.pranzo.forEach(res => {
            pranzoContainer.appendChild(createReservationCard(res));
        });
        container.appendChild(pranzoContainer);
    }

    if (grouped.cena.length > 0) {
        const cenaHeader = document.createElement('h3');
        cenaHeader.style.fontSize = '1.1rem';
        cenaHeader.style.color = '#2563EB'; 
        cenaHeader.style.margin = '0 0 0.8rem 0';
        cenaHeader.innerHTML = '🌙 Servizio della Cena';
        container.appendChild(cenaHeader);
        
        const cenaContainer = document.createElement('div');
        cenaContainer.style.display = 'flex';
        cenaContainer.style.flexDirection = 'column';
        cenaContainer.style.gap = '0.8rem';
        
        grouped.cena.forEach(res => {
            cenaContainer.appendChild(createReservationCard(res));
        });
        container.appendChild(cenaContainer);
    }
}

document.getElementById('prevResDateBtn').addEventListener('click', () => {
    currentReservationDate.setDate(currentReservationDate.getDate() - 1);
    renderReservationsScreen();
});

document.getElementById('nextResDateBtn').addEventListener('click', () => {
    currentReservationDate.setDate(currentReservationDate.getDate() + 1);
    renderReservationsScreen();
});

document.getElementById('openResCalendarBtn').addEventListener('click', () => {
    const picker = document.getElementById('hiddenResDatePicker');
    try {
        if (typeof picker.showPicker === 'function') {
            picker.showPicker();
        } else {
            picker.focus();
        }
    } catch (e) {
        picker.focus();
    }
});

document.getElementById('hiddenResDatePicker').addEventListener('change', (e) => {
    if (e.target.value) {
        const parts = e.target.value.split('-');
        if (parts.length === 3) {
            currentReservationDate = new Date(parts[0], parts[1] - 1, parts[2]);
            renderReservationsScreen();
        }
    }
});

document.getElementById('reservationScreenFab').addEventListener('click', () => {
    document.getElementById('resCustomerName').value = '';
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('resDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('resTime').value = '20:00';
    
    document.getElementById('resPartySize').value = 2;
    document.getElementById('resPhone').value = '';
    
    document.getElementById('resExtraDog').checked = false;
    document.getElementById('resExtraHighChair').checked = false;
    document.getElementById('resExtraStroller').checked = false;
    document.getElementById('resExtraCake').checked = false;
    
    document.getElementById('resMenuType').value = '';
    document.getElementById('resNotes').value = '';
    
    document.getElementById('addReservationModal').style.display = 'flex';
    setTimeout(() => { document.getElementById('resCustomerName').focus(); }, 50);
});

document.getElementById('cancelAddReservationBtn').addEventListener('click', () => {
    document.getElementById('addReservationModal').style.display = 'none';
});

document.getElementById('confirmAddReservationBtn').addEventListener('click', () => {
    const name = document.getElementById('resCustomerName').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const partySize = parseInt(document.getElementById('resPartySize').value) || 2;
    const phone = document.getElementById('resPhone').value.trim();
    
    if (!name) {
        alert("Inserisci il nome del cliente.");
        return;
    }
    if (!date || !time) {
        alert("Inserisci giorno e orario della prenotazione.");
        return;
    }
    
    const dateTimeMs = new Date(`${date}T${time}`).getTime();
    
    const extras = [];
    if (document.getElementById('resExtraDog').checked) extras.push('Cani');
    if (document.getElementById('resExtraHighChair').checked) extras.push('Seggiolone');
    if (document.getElementById('resExtraStroller').checked) extras.push('Carrozzina');
    if (document.getElementById('resExtraCake').checked) extras.push('Torta Compleanno');
    
    const menuType = document.getElementById('resMenuType').value;
    const notes = document.getElementById('resNotes').value.trim();
    
    if (!globalData.reservations) {
        globalData.reservations = [];
    } else if (!Array.isArray(globalData.reservations)) {
        globalData.reservations = Object.values(globalData.reservations);
    }
    
    const newId = globalData.reservations.length > 0 ? Math.max(...globalData.reservations.map(r => r.id || 0)) + 1 : 1;
    
    const newRes = {
        id: newId,
        customerName: name,
        partySize: partySize,
        dateTime: dateTimeMs,
        phoneNumber: phone,
        notes: notes,
        extras: extras,
        menuType: menuType
    };
    
    globalData.reservations.push(newRes);
    db.set(globalData);
    
    document.getElementById('addReservationModal').style.display = 'none';
    renderReservationsScreen();
});

let pendingReservationActionId = null;

function openReservationActionModal(res) {
    pendingReservationActionId = res.id;
    document.getElementById('resActionTitle').textContent = `Gestione: ${res.customerName}`;
    
    const select = document.getElementById('resAssignTableSelect');
    select.innerHTML = '<option value="">Nessun tavolo</option>';
    
    if (globalData.tables) {
        globalData.tables.filter(t => t.isActive).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            const zoneName = t.zone === 'SALA_GRANDE' ? 'Sala G.' : (t.zone === 'SALA_PICCOLA' ? 'Sala P.' : 'Dehor');
            opt.textContent = `Tavolo ${t.number} (${zoneName})`;
            if (res.assignedTableId && String(res.assignedTableId) === String(t.id)) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
    }
    
    document.getElementById('reservationActionModal').style.display = 'flex';
}

document.getElementById('closeResActionModalBtn').addEventListener('click', () => {
    document.getElementById('reservationActionModal').style.display = 'none';
    pendingReservationActionId = null;
});

document.getElementById('deleteReservationBtn').addEventListener('click', () => {
    if (!pendingReservationActionId) return;
    if (confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
        const resToDelete = globalData.reservations.find(r => r.id === pendingReservationActionId);
        if (resToDelete && resToDelete.assignedTableId) {
            const table = globalData.tables.find(t => t.id === resToDelete.assignedTableId);
            if (table && table.status === 'PRENOTATO') {
                table.status = 'LIBERO';
                table.partySize = null;
            }
        }
        
        globalData.reservations = globalData.reservations.filter(r => r.id !== pendingReservationActionId);
        db.set(globalData);
        document.getElementById('reservationActionModal').style.display = 'none';
        pendingReservationActionId = null;
        renderReservationsScreen();
    }
});

document.getElementById('confirmAssignTableBtn').addEventListener('click', () => {
    if (!pendingReservationActionId) return;
    const tableIdStr = document.getElementById('resAssignTableSelect').value;
    
    const index = globalData.reservations.findIndex(r => r.id === pendingReservationActionId);
    if (index !== -1) {
        const oldTableId = globalData.reservations[index].assignedTableId;
        
        if (tableIdStr === "") {
            delete globalData.reservations[index].assignedTableId;
            if (oldTableId) {
                const oldT = globalData.tables.find(x => x.id === oldTableId);
                if (oldT && oldT.status === 'PRENOTATO') {
                    oldT.status = 'LIBERO';
                    oldT.partySize = null;
                }
            }
        } else {
            const newTableId = parseInt(tableIdStr);
            if (oldTableId && oldTableId !== newTableId) {
                const oldT = globalData.tables.find(x => x.id === oldTableId);
                if (oldT && oldT.status === 'PRENOTATO') {
                    oldT.status = 'LIBERO';
                    oldT.partySize = null;
                }
            }
            
            globalData.reservations[index].assignedTableId = newTableId;
            const newT = globalData.tables.find(x => x.id === newTableId);
            if (newT && (newT.status === 'LIBERO' || newT.status === 'PRENOTATO')) {
                newT.status = 'PRENOTATO';
                newT.partySize = globalData.reservations[index].partySize;
            }
        }
        db.set(globalData);
        renderReservationsScreen();
    }
    document.getElementById('reservationActionModal').style.display = 'none';
    pendingReservationActionId = null;
});

let currentDashboardDate = new Date();
let currentDashboardService = new Date().getHours() < 16 ? 'pranzo' : 'cena';

function renderTables() {
    if (!globalData || !globalData.tables) return;
    const grid = document.getElementById('tablesGrid');
    grid.innerHTML = '';
    
    const today = new Date();
    const isToday = currentDashboardDate.getDate() === today.getDate() && 
                    currentDashboardDate.getMonth() === today.getMonth() && 
                    currentDashboardDate.getFullYear() === today.getFullYear();
    
    let displayDate = currentDashboardDate.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    displayDate = displayDate.charAt(0).toUpperCase() + displayDate.slice(1);
    
    const displayEl = document.getElementById('currentDashDateDisplay');
    if (displayEl) {
        displayEl.textContent = isToday ? "Oggi" : displayDate;
    }
    
    const realTimeService = today.getHours() < 16 ? 'pranzo' : 'cena';
    const isLookingAtRealTime = isToday && currentDashboardService === realTimeService;
    
    const yyyy = currentDashboardDate.getFullYear();
    const mm = String(currentDashboardDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDashboardDate.getDate()).padStart(2, '0');
    const dashDateKey = `${yyyy}-${mm}-${dd}`;
    
    const activeTablesInZone = globalData.tables.filter(t => t.zone === currentZone && t.isActive === true);
    
    if (activeTablesInZone.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: #666;">Nessun tavolo attivo in questa zona. Attivali dalle impostazioni.</p>';
        return;
    }

    activeTablesInZone.forEach(table => {
        let displayStatus = 'LIBERO';
        let displayPartySize = null;
        
        let hasReservation = false;
        if (globalData.reservations) {
            let resArray = Array.isArray(globalData.reservations) ? globalData.reservations : Object.values(globalData.reservations);
            const assignedRes = resArray.find(r => {
                if (!r || r.assignedTableId !== table.id || !r.dateTime) return false;
                const d = new Date(r.dateTime);
                const r_yyyy = d.getFullYear();
                const r_mm = String(d.getMonth() + 1).padStart(2, '0');
                const r_dd = String(d.getDate()).padStart(2, '0');
                if (`${r_yyyy}-${r_mm}-${r_dd}` !== dashDateKey) return false;
                
                const hour = d.getHours();
                const service = hour < 16 ? 'pranzo' : 'cena';
                return service === currentDashboardService;
            });
            
            if (assignedRes) {
                displayStatus = 'PRENOTATO';
                displayPartySize = assignedRes.partySize;
                hasReservation = true;
            }
        }
        
        if (!hasReservation && isLookingAtRealTime && table.status === 'OCCUPATO') {
            displayStatus = 'OCCUPATO';
            displayPartySize = table.partySize;
        }

        const card = document.createElement('div');
        card.className = `table-card table-${displayStatus}`;
        card.innerHTML = `
            <span class="number">${table.number}</span>
            <span class="status">${displayStatus}</span>
        `;
        card.addEventListener('click', () => openTable(table.id, displayStatus, displayPartySize));
        grid.appendChild(card);
    });
}

document.getElementById('prevDashDateBtn')?.addEventListener('click', () => {
    currentDashboardDate.setDate(currentDashboardDate.getDate() - 1);
    renderTables();
});
document.getElementById('nextDashDateBtn')?.addEventListener('click', () => {
    currentDashboardDate.setDate(currentDashboardDate.getDate() + 1);
    renderTables();
});
document.getElementById('dashServicePranzoBtn')?.addEventListener('click', () => {
    currentDashboardService = 'pranzo';
    document.getElementById('dashServicePranzoBtn').classList.add('active');
    document.getElementById('dashServiceCenaBtn').classList.remove('active');
    renderTables();
});
document.getElementById('dashServiceCenaBtn')?.addEventListener('click', () => {
    currentDashboardService = 'cena';
    document.getElementById('dashServiceCenaBtn').classList.add('active');
    document.getElementById('dashServicePranzoBtn').classList.remove('active');
    renderTables();
});
document.getElementById('openDashCalendarBtn')?.addEventListener('click', () => {
    const picker = document.getElementById('hiddenDashDatePicker');
    try {
        if (typeof picker.showPicker === 'function') {
            picker.showPicker();
        } else {
            picker.focus();
        }
    } catch (e) {
        picker.focus();
    }
});
document.getElementById('hiddenDashDatePicker')?.addEventListener('change', (e) => {
    if (e.target.value) {
        const parts = e.target.value.split('-');
        if (parts.length === 3) {
            currentDashboardDate = new Date(parts[0], parts[1] - 1, parts[2]);
            renderTables();
        }
    }
});

// --- GESTIONE IMPOSTAZIONI (ADMIN) ---
const settingsBtn = document.getElementById('settingsBtn');
if(settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        showScreen('admin');
        renderAdminScreen();
    });
}

const manageMenuBtn = document.getElementById('manageMenuBtn');
if(manageMenuBtn) {
    manageMenuBtn.addEventListener('click', () => {
        showScreen('menu');
        renderMenuAdminScreen();
    });
}

const backToDashboardFromAdminBtn = document.getElementById('backToDashboardFromAdminBtn');
if(backToDashboardFromAdminBtn) {
    backToDashboardFromAdminBtn.addEventListener('click', () => {
        showScreen('dashboard');
        renderTables();
    });
}

const backToDashboardFromMenuBtn = document.getElementById('backToDashboardFromMenuBtn');
if(backToDashboardFromMenuBtn) {
    backToDashboardFromMenuBtn.addEventListener('click', () => {
        showScreen('dashboard');
        renderTables();
    });
}

function renderAdminScreen() {
    if (!globalData || !globalData.tables) return;
    
    const container = document.getElementById('adminTablesContainer');
    container.innerHTML = '';
    
    const zones = ['SALA_GRANDE', 'SALA_PICCOLA', 'DEHOR'];
    const zoneLabels = {
        'SALA_GRANDE': 'Sala Grande',
        'SALA_PICCOLA': 'Sala Piccola',
        'DEHOR': 'Dehor'
    };

    zones.forEach(zone => {
        const zoneTitle = document.createElement('h3');
        zoneTitle.textContent = zoneLabels[zone];
        container.appendChild(zoneTitle);

        const grid = document.createElement('div');
        grid.className = 'admin-tables-grid';
        
        const zoneTables = globalData.tables.filter(t => t.zone === zone);
        zoneTables.forEach(table => {
            const label = document.createElement('label');
            label.className = 'admin-table-toggle';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = table.isActive;
            checkbox.addEventListener('change', (e) => {
                table.isActive = e.target.checked;
                db.set(globalData);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` Tavolo ${table.number}`));
            grid.appendChild(label);
        });
        
        container.appendChild(grid);
    });
}

// --- GESTIONE MENU (ADMIN) ---
let currentMenuTab = 'CUCINA';
let editingMenuItemId = null;

const CATEGORY_GROUPS = {
    'CUCINA': ['Taglieri Speciali', 'Antipasti di terra', 'Antipasti di mare', 'Primi di terra', 'Primi di mare', 'Gnocchi della casa', 'Secondi di terra', 'Secondi di mare', 'Insalate', 'Hamburger', 'Varie'],
    'PIZZERIA': ['Pizze rosse', 'Pizze bianche', 'Pizze al tegamino', 'Pizze Baby', 'Focacce', 'Panuozzi', 'Calzoni'],
    'BEVANDE': ['Bibite varie', 'Birre alla spina', 'Birre in bottiglia', 'Vini alla spina', 'Vini bianchi', 'Vini rossi', 'Bollicine', 'Alcolici', 'Caffè', 'Amari']
};

document.querySelectorAll('#menuScreen .tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('#menuScreen .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentMenuTab = e.target.dataset.category;
        renderMenuAdminScreen();
    });
});

function renderMenuAdminScreen() {
    if (!globalData || !globalData.menu) return;
    
    const container = document.getElementById('menuAdminContainer');
    container.innerHTML = '';
    
    const allowedCategories = CATEGORY_GROUPS[currentMenuTab] || [];
    
    allowedCategories.forEach(category => {
        const itemsInCategory = globalData.menu.filter(m => m.category === category);
        
        if (itemsInCategory.length > 0) {
            const catDiv = document.createElement('div');
            catDiv.className = 'menu-admin-category';
            catDiv.innerHTML = `<h3>${category}</h3>`;
            
            itemsInCategory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-admin-item' + (item.active === false ? ' inactive-item' : '');
                itemDiv.style.cursor = 'pointer';
                const statusBadge = item.active === false ? '<span style="color:#EF4444; font-size:0.7rem; border:1px solid #EF4444; padding:0.1rem 0.3rem; border-radius:3px; margin-left:0.5rem;">DISATTIVATO</span>' : '';
                const ingredientsHtml = item.ingredients ? `<div class="menu-item-description">${item.ingredients}</div>` : '';
                itemDiv.innerHTML = `
                    <div class="details">
                        <h4>${item.name}${statusBadge}</h4>
                        ${ingredientsHtml}
                    </div>
                    <div class="actions">
                        <span class="price">€${item.price.toFixed(2)}</span>
                        <button class="btn danger small delete-menu-item" data-id="${item.id}">X</button>
                    </div>
                `;
                
                // Modifica piatto
                itemDiv.addEventListener('click', (e) => {
                    if(e.target.classList.contains('delete-menu-item')) return; // ignoriamo se clicca la X
                    
                    editingMenuItemId = item.id;
                    document.getElementById('menuItemModalTitle').textContent = 'Modifica Piatto';
                    const nameInput = document.getElementById('newMenuItemName');
                    nameInput.value = item.name;
                    document.getElementById('newMenuItemPrice').value = item.price;
                    document.getElementById('newMenuItemCategory').value = item.category;
                    document.getElementById('menuItemIngredients').value = item.ingredients || '';
                    document.getElementById('menuItemActive').checked = item.active !== false;
                    document.getElementById('addMenuItemModal').style.display = 'flex';
                    
                    setTimeout(() => { nameInput.focus(); }, 50);
                });
                
                catDiv.appendChild(itemDiv);
            });
            container.appendChild(catDiv);
        }
    });

    document.querySelectorAll('.delete-menu-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            if(confirm("Vuoi davvero eliminare questo piatto?")) {
                globalData.menu = globalData.menu.filter(m => m.id !== id);
                db.set(globalData);
            }
        });
    });
}

document.getElementById('openAddMenuItemModalBtn').addEventListener('click', () => {
    editingMenuItemId = null;
    document.getElementById('menuItemModalTitle').textContent = 'Nuovo Piatto';
    const nameInput = document.getElementById('newMenuItemName');
    nameInput.value = '';
    document.getElementById('newMenuItemPrice').value = '';
    document.getElementById('menuItemIngredients').value = '';
    document.getElementById('menuItemActive').checked = true;
    document.getElementById('addMenuItemModal').style.display = 'flex';
    
    // Autofocus per permettere di scrivere subito
    setTimeout(() => {
        nameInput.focus();
    }, 50);
});

document.getElementById('cancelAddMenuItemBtn').addEventListener('click', () => {
    document.getElementById('addMenuItemModal').style.display = 'none';
});

document.getElementById('confirmAddMenuItemBtn').addEventListener('click', () => {
    const name = document.getElementById('newMenuItemName').value.trim();
    const priceStr = document.getElementById('newMenuItemPrice').value;
    const category = document.getElementById('newMenuItemCategory').value;
    const ingredients = document.getElementById('menuItemIngredients').value.trim();
    const isActive = document.getElementById('menuItemActive').checked;
    
    if (!name || !priceStr) {
        alert("Inserisci nome e prezzo del piatto.");
        return;
    }
    const price = parseFloat(priceStr);
    
    if (editingMenuItemId) {
        // Modalità modifica
        const itemToUpdate = globalData.menu.find(m => m.id === editingMenuItemId);
        if (itemToUpdate) {
            itemToUpdate.name = name;
            itemToUpdate.price = price;
            itemToUpdate.category = category;
            itemToUpdate.ingredients = ingredients;
            itemToUpdate.active = isActive;
        }
    } else {
        // Modalità nuovo inserimento
        const newId = globalData.menu.length > 0 ? Math.max(...globalData.menu.map(m => m.id)) + 1 : 1;
        globalData.menu.push({
            id: newId,
            name: name,
            category: category,
            price: price,
            ingredients: ingredients,
            active: isActive
        });
    }
    
    db.set(globalData);
    document.getElementById('addMenuItemModal').style.display = 'none';
});

// --- APERTURA COMANDA TAVOLO ---
let pendingTableId = null;

function openTable(tableId, displayStatus, displayPartySize) {
    let table = globalData.tables.find(t => t.id === tableId);
    
    const effectiveStatus = displayStatus !== undefined ? displayStatus : table.status;
    const effectivePartySize = displayPartySize !== undefined ? displayPartySize : table.partySize;
    
    if (effectiveStatus === 'LIBERO') {
        pendingTableId = tableId;
        document.getElementById('partySizeModalTitle').textContent = `Tavolo ${table.number} - Libero`;
        document.getElementById('partySizeInput').value = 2;
        document.getElementById('partyArrivedCheckbox').checked = false; // Default a solo prenotato
        document.getElementById('partyArrivedLabelText').textContent = "Clienti NON prenotati (occupa subito)";
        document.getElementById('cancelReservationInModalBtn').style.display = 'none';
        document.getElementById('partySizeModal').style.display = 'flex';
    } else if (effectiveStatus === 'PRENOTATO') {
        pendingTableId = tableId;
        document.getElementById('partySizeModalTitle').textContent = `Tavolo ${table.number} - Prenotato`;
        document.getElementById('partySizeInput').value = effectivePartySize || 2;
        document.getElementById('partyArrivedCheckbox').checked = true; // Default a arrivati
        document.getElementById('partyArrivedLabelText').textContent = "I clienti sono arrivati (occupa)";
        document.getElementById('cancelReservationInModalBtn').style.display = 'block';
        document.getElementById('partySizeModal').style.display = 'flex';
    } else {
        // OCCUPATO
        activeTableId = tableId;
        showScreen('order');
        renderOrderScreen();
    }
}

// Gestione popup numero coperti (unico per Prenotare/Occupare)
document.getElementById('cancelPartySizeBtn').addEventListener('click', () => {
    document.getElementById('partySizeModal').style.display = 'none';
    pendingTableId = null;
});

document.getElementById('cancelReservationInModalBtn').addEventListener('click', () => {
    if (pendingTableId) {
        let table = globalData.tables.find(t => t.id === pendingTableId);
        
        if (table.status === 'OCCUPATO') {
            table.status = 'LIBERO';
            table.partySize = null;
        }
        
        if (globalData.reservations) {
            const yyyy = currentDashboardDate.getFullYear();
            const mm = String(currentDashboardDate.getMonth() + 1).padStart(2, '0');
            const dd = String(currentDashboardDate.getDate()).padStart(2, '0');
            const dashDateKey = `${yyyy}-${mm}-${dd}`;
            
            let resArray = Array.isArray(globalData.reservations) ? globalData.reservations : Object.values(globalData.reservations);
            resArray.forEach(r => {
                if (r && r.assignedTableId === pendingTableId && r.dateTime) {
                    const d = new Date(r.dateTime);
                    const r_yyyy = d.getFullYear();
                    const r_mm = String(d.getMonth() + 1).padStart(2, '0');
                    const r_dd = String(d.getDate()).padStart(2, '0');
                    if (`${r_yyyy}-${r_mm}-${r_dd}` === dashDateKey) {
                        const hour = d.getHours();
                        const service = hour < 16 ? 'pranzo' : 'cena';
                        if (service === currentDashboardService) {
                            delete r.assignedTableId;
                        }
                    }
                }
            });
        }
        
        db.set(globalData);
        renderTables();
    }
    document.getElementById('partySizeModal').style.display = 'none';
    pendingTableId = null;
});

document.getElementById('confirmPartySizeBtn').addEventListener('click', () => {
    const partySize = parseInt(document.getElementById('partySizeInput').value) || 2;
    const occupyImmediately = document.getElementById('partyArrivedCheckbox').checked;
    
    document.getElementById('partySizeModal').style.display = 'none';
    
    if (pendingTableId) {
        let table = globalData.tables.find(t => t.id === pendingTableId);
        
        if (occupyImmediately) {
            table.status = 'OCCUPATO';
            table.partySize = null; // pulizia per non sporcare i dati del tavolo
            
            if (!globalData.orders) globalData.orders = {};
            globalData.orders[pendingTableId] = { partySize: partySize, items: [] };
            
            db.set(globalData);
            activeTableId = pendingTableId;
            pendingTableId = null;
            showScreen('order');
            renderOrderScreen();
        } else {
            // "Prenota ora"
            const newRes = {
                id: globalData.reservations ? (globalData.reservations.length > 0 ? Math.max(...globalData.reservations.map(r => r.id || 0)) + 1 : 1) : 1,
                customerName: "Prenotazione Rapida (Dashboard)",
                partySize: partySize,
                dateTime: new Date(currentDashboardDate).setHours(currentDashboardService === 'pranzo' ? 12 : 20, 0, 0, 0),
                assignedTableId: pendingTableId
            };
            if (!globalData.reservations) globalData.reservations = [];
            if (!Array.isArray(globalData.reservations)) globalData.reservations = Object.values(globalData.reservations);
            globalData.reservations.push(newRes);
            
            db.set(globalData);
            renderTables();
            pendingTableId = null;
        }
    }
});

function renderOrderScreen() {
    const table = globalData.tables.find(t => t.id === activeTableId);
    const orderObj = globalData.orders && globalData.orders[activeTableId] ? globalData.orders[activeTableId] : null;
    const copertiText = orderObj && orderObj.partySize ? ` (${orderObj.partySize} persone)` : '';
    
    document.getElementById('orderTitle').textContent = `Tavolo ${table.number}${copertiText}`;

    // Recupera o crea ordine
    if (!globalData.orders) globalData.orders = {};
    let order = globalData.orders[activeTableId];
    if (!order) {
        order = { items: [] };
        globalData.orders[activeTableId] = order;
        db.set(globalData);
    }

    // Renderizza elementi ordine
    const itemsList = document.getElementById('orderItemsList');
    itemsList.innerHTML = '';
    let total = 0;

    // Calcolo automatico coperti
    const partySize = order.partySize || 2;
    const copertiTotal = partySize * 2.00;
    total += copertiTotal;
    
    // Riga fissa Coperti in cima
    const copertiLi = document.createElement('li');
    copertiLi.style.background = '#F8FAFC';
    copertiLi.style.padding = '0.75rem';
    copertiLi.style.borderRadius = '8px';
    copertiLi.style.marginBottom = '0.5rem';
    copertiLi.style.borderBottom = 'none';
    copertiLi.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <div style="display:flex; align-items:center; gap: 0.8rem;">
                <button class="btn secondary small coperti-btn-minus" style="padding:0.1rem 0.6rem; font-size:1.2rem; border-radius:8px;">-</button>
                <span style="font-weight: bold; font-size:1rem; min-width: 80px; text-align:center;">${partySize} Coperti</span>
                <button class="btn secondary small coperti-btn-plus" style="padding:0.1rem 0.5rem; font-size:1.2rem; border-radius:8px;">+</button>
            </div>
            <span style="font-weight: bold; color: var(--primary-color);">€${copertiTotal.toFixed(2)}</span>
        </div>
    `;
    itemsList.appendChild(copertiLi);
    
    copertiLi.querySelector('.coperti-btn-minus').addEventListener('click', () => {
        if(order.partySize > 1) {
            order.partySize -= 1;
            db.set(globalData);
            renderOrderScreen();
        }
    });
    copertiLi.querySelector('.coperti-btn-plus').addEventListener('click', () => {
        order.partySize = (order.partySize || 2) + 1;
        db.set(globalData);
        renderOrderScreen();
    });

    if (order.items && order.items.length > 0) {
        window.decreaseItemQuantity = function(identifier) {
            if (!activeTableId || !globalData.orders[activeTableId]) return;
            const ord = globalData.orders[activeTableId];
            const itemIndex = ord.items.findIndex(i => (i.uniqueLineId || String(i.id)) === String(identifier));
            if (itemIndex !== -1) {
                ord.items[itemIndex].quantity -= 1;
                if (ord.items[itemIndex].quantity <= 0) {
                    ord.items.splice(itemIndex, 1);
                }
                db.set(globalData);
                renderOrderScreen();
            }
        };

        window.changeItemCourse = function(identifier, newCourse) {
            if (!activeTableId || !globalData.orders[activeTableId]) return;
            const ord = globalData.orders[activeTableId];
            const item = ord.items.find(i => (i.uniqueLineId || String(i.id)) === String(identifier));
            if (item) {
                item.course = parseInt(newCourse);
                db.set(globalData);
                renderOrderScreen();
            }
        };

        window.editOrderItem = function(identifier) {
            if (!activeTableId || !globalData.orders[activeTableId]) return;
            const ord = globalData.orders[activeTableId];
            const item = ord.items.find(i => (i.uniqueLineId || String(i.id)) === String(identifier));
            if (!item) return;

            const menuItem = globalData.menu.find(m => m.id === item.id);
            if (!menuItem) return;

            pendingMenuItemIdForOptions = item.id;
            pendingEditItemIdentifier = identifier;
            document.getElementById('optionsModalTitle').textContent = "Modifica: " + item.name;

            const cat = menuItem.category || '';
            const isPizza = ['Pizze rosse', 'Pizze bianche', 'Pizze al tegamino', 'Pizze Baby'].includes(cat);
            const allowsExtra = isPizza || ['Focacce', 'Hamburger', 'Panuozzi', 'Calzoni'].includes(cat);

            // Reset all
            document.getElementById('cookingLevelSection').style.display = 'none';
            document.getElementById('sideDishSection').style.display = 'none';
            document.getElementById('pizzaCookingSection').style.display = 'none';
            document.getElementById('pizzaEdgeSection').style.display = 'none';
            document.getElementById('extraIngredientsSection').style.display = 'none';
            document.getElementById('extraIngredientsInput').value = '';
            document.getElementById('itemNotesInput').value = '';
            
            document.querySelector('input[name="cookingLevel"][value="Non applicabile"]').checked = true;
            document.querySelector('input[name="sideDish"][value="Nessun contorno"]').checked = true;
            document.querySelector('input[name="pizzaCooking"][value="Normale"]').checked = true;
            document.querySelector('input[name="pizzaEdge"][value="Bordo classico"]').checked = true;

            // Show sections based on category
            if (cat === 'Secondi di terra' || cat === 'Secondi di mare') {
                const nameLower = menuItem.name.toLowerCase();
                const requiresCooking = nameLower.includes('filetto') || nameLower.includes('tagliata') || nameLower.includes('costata') || nameLower.includes('entrecôte') || nameLower.includes('entrecote') || nameLower.includes('grigliata mista');
                document.getElementById('cookingLevelSection').style.display = requiresCooking ? 'block' : 'none';
                document.getElementById('sideDishSection').style.display = 'block';
            }
            if (isPizza) {
                document.getElementById('pizzaCookingSection').style.display = 'block';
                document.getElementById('pizzaEdgeSection').style.display = 'block';
            }
            if (allowsExtra) {
                document.getElementById('extraIngredientsSection').style.display = 'block';
            }

            // Load values from item.variants
            if (item.variants) {
                item.variants.forEach(v => {
                    if (v.startsWith('Cottura: ')) {
                        const val = v.replace('Cottura: ', '');
                        if (['Normale', 'Ben cotta'].includes(val)) {
                            const rb = document.querySelector(`input[name="pizzaCooking"][value="${val}"]`);
                            if(rb) rb.checked = true;
                        } else {
                            const rb = document.querySelector(`input[name="cookingLevel"][value="${val}"]`);
                            if(rb) rb.checked = true;
                        }
                    }
                    if (v.startsWith('Contorno: ')) {
                        let val = v.replace('Contorno: ', '');
                        if (val.includes('Verdure grigliate')) val = 'Verdure grigliate (+2,50€)';
                        const rb = document.querySelector(`input[name="sideDish"][value="${val}"]`);
                        if(rb) rb.checked = true;
                    }
                    if (v.startsWith('Bordo: ')) {
                        const val = v.replace('Bordo: ', '');
                        const rb = document.querySelector(`input[name="pizzaEdge"][value="${val}"]`);
                        if(rb) rb.checked = true;
                    }
                    if (v.startsWith('Extra: ')) {
                        document.getElementById('extraIngredientsInput').value = v.replace('Extra: ', '');
                    }
                    if (v.startsWith('Note: ')) {
                        document.getElementById('itemNotesInput').value = v.replace('Note: ', '');
                    }
                });
            }

            document.getElementById('itemOptionsModal').style.display = 'flex';
        };

        [1, 2, 3].forEach(courseNum => {
            const courseItems = order.items.filter(i => (i.course || 1) === courseNum);
            
            const courseHeader = document.createElement('li');
            courseHeader.style.background = '#EFF6FF';
            courseHeader.style.padding = '0.5rem';
            courseHeader.style.fontWeight = 'bold';
            courseHeader.style.color = 'var(--primary-color)';
            courseHeader.style.borderBottom = 'none';
            courseHeader.style.marginTop = '0.5rem';
            courseHeader.textContent = `${courseNum}ª Uscita`;
            itemsList.appendChild(courseHeader);
            
            if (courseItems.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.style.padding = '0.5rem';
                emptyLi.style.color = '#94A3B8';
                emptyLi.style.fontStyle = 'italic';
                emptyLi.textContent = 'Nessun piatto';
                itemsList.appendChild(emptyLi);
            } else {
                courseItems.forEach(item => {
                    const lineTotal = item.quantity * item.price;
                    total += lineTotal;
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.flexDirection = 'column';
                    
                    const variantsHtml = (item.variants && item.variants.length > 0) ? `<br><small style="color:#64748B;">${item.variants.join(' | ')}</small>` : '';
                    const identifier = String(item.uniqueLineId || item.id);
                    const safeIdentifier = identifier.replace(/'/g, "\\'");
                    
                    li.innerHTML = `
                        <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                            <div style="display:flex; align-items:flex-start; gap:0.5rem; flex:1; cursor:pointer;" onclick="editOrderItem('${safeIdentifier}')">
                                <button class="btn danger small" style="padding:0.1rem 0.5rem; font-size:1.2rem; border-radius:4px; margin-top:0.2rem;" onclick="event.stopPropagation(); decreaseItemQuantity('${safeIdentifier}')">-</button>
                                <div>
                                    <span style="font-weight:600;">${item.quantity}x ${item.name} <span style="font-size:0.8rem; margin-left:0.3rem;">✏️</span></span>
                                    ${variantsHtml}
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.3rem;">
                                <span style="font-weight:bold;">€${lineTotal.toFixed(2)}</span>
                                <select class="course-select" onchange="changeItemCourse('${identifier}', this.value)">
                                    <option value="1" ${courseNum === 1 ? 'selected' : ''}>1ª Uscita</option>
                                    <option value="2" ${courseNum === 2 ? 'selected' : ''}>2ª Uscita</option>
                                    <option value="3" ${courseNum === 3 ? 'selected' : ''}>3ª Uscita</option>
                                </select>
                            </div>
                        </div>
                    `;
                    itemsList.appendChild(li);
                });
            }
        });
    }

    document.getElementById('orderTotalAmount').textContent = `€${total.toFixed(2)}`;

    // Renderizza Menu (aggiornato per raggruppare per categorie)
    const menuList = document.getElementById('menuItemsList');
    menuList.innerHTML = '';
    if (globalData.menu) {
        // Raggruppiamo i piatti per categoria
        const groupedMenu = {};
        globalData.menu.forEach(item => {
            if (item.active === false) return; // Salta piatti disattivati
            if (!groupedMenu[item.category]) groupedMenu[item.category] = [];
            groupedMenu[item.category].push(item);
        });

        for (const [category, items] of Object.entries(groupedMenu)) {
            const catHeader = document.createElement('h4');
            catHeader.textContent = category;
            catHeader.style.marginTop = "1rem";
            catHeader.style.color = "var(--primary-color)";
            menuList.appendChild(catHeader);

            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                const ingredientsHtml = item.ingredients ? `<div class="menu-item-description">${item.ingredients}</div>` : '';
                menuItem.innerHTML = `
                    <div class="details">
                        <h4>${item.name}</h4>
                        ${ingredientsHtml}
                    </div>
                    <div style="display:flex; align-items:center;">
                        <span class="price">€${item.price.toFixed(2)}</span>
                        <button class="add-btn" data-id="${item.id}">+</button>
                    </div>
                `;
                menuList.appendChild(menuItem);
            });
        }
    }

    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            handleAddBtnClick(itemId);
        });
    });
}

let pendingMenuItemIdForOptions = null;
let pendingEditItemIdentifier = null;

function handleAddBtnClick(menuItemId) {
    const menuItem = globalData.menu.find(m => m.id === menuItemId);
    if (!menuItem) return;
    
    const cat = menuItem.category || '';
    const nameLower = menuItem.name.toLowerCase();
    
    const isPizza = ['Pizze rosse', 'Pizze bianche', 'Pizze al tegamino', 'Pizze Baby'].includes(cat);
    const allowsExtra = isPizza || ['Focacce', 'Hamburger', 'Panuozzi', 'Calzoni'].includes(cat);
    const isSecondo = cat === 'Secondi di terra' || cat === 'Secondi di mare';
    
    // Se è un piatto semplice (es. Bibite, Primi), aggiungi subito senza aprire il popup
    if (!isPizza && !allowsExtra && !isSecondo) {
        addMenuItemToOrder(menuItemId, [], 0);
        return;
    }
    
    pendingMenuItemIdForOptions = menuItemId;
    pendingEditItemIdentifier = null; // Nuova variabile per tracciare la modifica
    document.getElementById('optionsModalTitle').textContent = menuItem.name;
    
    // Reset inputs
    document.getElementById('extraIngredientsInput').value = '';
    document.getElementById('itemNotesInput').value = '';
    
    // Secondi: Cottura e Contorni
    if (cat === 'Secondi di terra' || cat === 'Secondi di mare') {
        const requiresCooking = nameLower.includes('filetto') || nameLower.includes('tagliata') || nameLower.includes('costata') || nameLower.includes('entrecôte') || nameLower.includes('entrecote') || nameLower.includes('grigliata mista');
        document.getElementById('cookingLevelSection').style.display = requiresCooking ? 'block' : 'none';
        document.querySelector(`input[name="cookingLevel"][value="${requiresCooking ? 'Media' : 'Non applicabile'}"]`).checked = true;
        
        document.getElementById('sideDishSection').style.display = 'block';
        document.querySelector('input[name="sideDish"][value="Nessun contorno"]').checked = true;
    } else {
        document.getElementById('cookingLevelSection').style.display = 'none';
        document.getElementById('sideDishSection').style.display = 'none';
        document.querySelector('input[name="cookingLevel"][value="Non applicabile"]').checked = true;
        document.querySelector('input[name="sideDish"][value="Nessun contorno"]').checked = true;
    }

    // Pizze: Cottura Pizza e Bordo
    if (isPizza) {
        document.getElementById('pizzaCookingSection').style.display = 'block';
        document.getElementById('pizzaEdgeSection').style.display = 'block';
        document.querySelector('input[name="pizzaCooking"][value="Normale"]').checked = true;
        document.querySelector('input[name="pizzaEdge"][value="Bordo classico"]').checked = true;
    } else {
        document.getElementById('pizzaCookingSection').style.display = 'none';
        document.getElementById('pizzaEdgeSection').style.display = 'none';
    }

    // Ingredienti Extra: Pizze, Focacce, Hamburger, Panuozzi, Calzoni
    if (allowsExtra) {
        document.getElementById('extraIngredientsSection').style.display = 'block';
    } else {
        document.getElementById('extraIngredientsSection').style.display = 'none';
    }
    
    // Mostra Modal per tutti
    document.getElementById('itemOptionsModal').style.display = 'flex';
    
    // Focus sul campo note o ingredienti per velocizzare l'inserimento
    setTimeout(() => {
        if (allowsExtra) {
            document.getElementById('extraIngredientsInput').focus();
        } else {
            document.getElementById('itemNotesInput').focus();
        }
    }, 50);
}

const cancelOptionsBtn = document.getElementById('cancelOptionsBtn');
if(cancelOptionsBtn) {
    cancelOptionsBtn.addEventListener('click', () => {
        document.getElementById('itemOptionsModal').style.display = 'none';
        pendingMenuItemIdForOptions = null;
        pendingEditItemIdentifier = null;
    });
}

const confirmOptionsBtn = document.getElementById('confirmOptionsBtn');
if(confirmOptionsBtn) {
    confirmOptionsBtn.addEventListener('click', () => {
        if (!pendingMenuItemIdForOptions) return;
        
        const menuItem = globalData.menu.find(m => m.id === pendingMenuItemIdForOptions);
        if (!menuItem) return;
        
        const cat = menuItem.category || '';
        const isPizza = ['Pizze rosse', 'Pizze bianche', 'Pizze al tegamino', 'Pizze Baby'].includes(cat);
        const allowsExtra = isPizza || ['Focacce', 'Hamburger', 'Panuozzi', 'Calzoni'].includes(cat);
        
        let variants = [];
        let extraPrice = 0;
        
        // Secondi
        if (cat === 'Secondi di terra' || cat === 'Secondi di mare') {
            const cookingLevel = document.querySelector('input[name="cookingLevel"]:checked').value;
            if (cookingLevel !== 'Non applicabile') variants.push(`Cottura: ${cookingLevel}`);
            
            const sideDish = document.querySelector('input[name="sideDish"]:checked').value;
            if (sideDish !== 'Nessun contorno') {
                if (sideDish.startsWith('Verdure grigliate')) {
                    variants.push(`Contorno: Verdure grigliate (+2,50€)`);
                    extraPrice += 2.50;
                } else {
                    variants.push(`Contorno: ${sideDish}`);
                }
            }
        }
        
        // Pizze
        if (isPizza) {
            const pCooking = document.querySelector('input[name="pizzaCooking"]:checked').value;
            if (pCooking !== 'Normale') variants.push(`Cottura: ${pCooking}`);
            
            const pEdge = document.querySelector('input[name="pizzaEdge"]:checked').value;
            if (pEdge !== 'Bordo classico') variants.push(`Bordo: ${pEdge}`);
        }
        
        // Extra Ingredients
        if (allowsExtra) {
            const extraIng = document.getElementById('extraIngredientsInput').value.trim();
            if (extraIng) variants.push(`Extra: ${extraIng}`);
        }
        
        // Notes
        const notes = document.getElementById('itemNotesInput').value.trim();
        if (notes) variants.push(`Note: ${notes}`);
        
        if (pendingEditItemIdentifier) {
            const order = globalData.orders[activeTableId];
            if (order && order.items) {
                const index = order.items.findIndex(i => (i.uniqueLineId || String(i.id)) === String(pendingEditItemIdentifier));
                if (index !== -1) {
                    order.items[index].variants = variants;
                    order.items[index].uniqueLineId = menuItem.id + '-' + variants.join('-');
                    db.set(globalData);
                    renderOrderScreen();
                }
            }
        } else {
            addMenuItemToOrder(pendingMenuItemIdForOptions, variants, extraPrice);
        }
        
        document.getElementById('itemOptionsModal').style.display = 'none';
        pendingMenuItemIdForOptions = null;
        pendingEditItemIdentifier = null;
    });
}

function addMenuItemToOrder(menuItemId, variantsText = [], extraPrice = 0) {
    const menuItem = globalData.menu.find(m => m.id === menuItemId);
    const order = globalData.orders[activeTableId];
    
    if (!order.items) order.items = [];
    
    const uniqueLineId = menuItem.id + '-' + variantsText.join('-');
    
    // Determinazione Uscita automatica intelligente
    const isAntipasto = (itemId, cat, name) => {
        if (!cat) {
            const mi = globalData.menu.find(m => m.id === itemId);
            cat = mi ? mi.category : '';
        }
        const n = name.toLowerCase();
        return cat.includes('Antipasti') || cat === 'Taglieri Speciali' || n.includes('farinata') || n.includes('chiacchere') || n.includes('chiacchiere');
    };
    
    const currentlyHasAntipasto = order.items.some(i => isAntipasto(i.id, i.category || '', i.name || ''));
    const isNewItemAntipasto = isAntipasto(menuItem.id, menuItem.category, menuItem.name);
    
    let defaultCourse = 1;
    if ((currentlyHasAntipasto || isNewItemAntipasto) && !isNewItemAntipasto) {
        defaultCourse = 2; // Se c'è un antipasto nella comanda, tutti gli altri piatti vanno in uscita 2 di default
    }

    // Se stiamo aggiungendo il primo antipasto della comanda, spostiamo gli altri piatti già presenti in Uscita 2
    if (isNewItemAntipasto && !currentlyHasAntipasto) {
        order.items.forEach(i => {
            if (!isAntipasto(i.id, i.category || '', i.name || '') && i.course === 1) {
                i.course = 2;
            }
        });
    }

    const existingItem = order.items.find(i => (i.uniqueLineId === uniqueLineId) || (!i.uniqueLineId && i.id === menuItemId && variantsText.length === 0));
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.course = defaultCourse; // Aggiorna all'uscita di default se viene aggiunto di nuovo
    } else {
        order.items.push({
            id: menuItem.id,
            uniqueLineId: uniqueLineId,
            name: menuItem.name,
            price: menuItem.price + extraPrice,
            variants: variantsText,
            quantity: 1,
            course: defaultCourse
        });
    }
    db.set(globalData);
}

// --- CHIUSURA CONTO ---
document.getElementById('closeOrderBtn').addEventListener('click', () => {
    let table = globalData.tables.find(t => t.id === activeTableId);
    table.status = 'LIBERO'; // Libera il tavolo
    delete globalData.orders[activeTableId]; // Elimina l'ordine chiuso
    db.set(globalData);
    
    showScreen('dashboard');
    renderTables();
});

// --- NAVIGAZIONE BACK ---
document.getElementById('backToDashboardBtn').addEventListener('click', () => {
    activeTableId = null;
    showScreen('dashboard');
});
