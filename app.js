// --- STATO GLOBALE ---
const SECRET_PIN = "1234"; // Sostituisci con la vera password del ristorante
let currentZone = 'SALA_GRANDE';
let activeTableId = null;
let globalData = null;

// --- GESTIONE UI SCHERMATE ---
const screens = {
    login: document.getElementById('loginScreen'),
    dashboard: document.getElementById('dashboardScreen'),
    order: document.getElementById('orderScreen'),
    reservations: document.getElementById('reservationsScreen'),
    admin: document.getElementById('adminScreen'),
    menu: document.getElementById('menuScreen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(s => {
        if(s) s.classList.remove('active');
    });
    screens[screenName].classList.add('active');
    
    if (screenName === 'dashboard') renderTables();
    if (screenName === 'menu') renderMenuAdminScreen();
}

// --- LOGIN ---
document.getElementById('loginBtn').addEventListener('click', () => {
    const pin = document.getElementById('pinInput').value;
    if (pin === SECRET_PIN) {
        showScreen('dashboard');
    } else {
        document.getElementById('loginError').textContent = "PIN Errato";
    }
});

document.getElementById('pinInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginBtn').click();
    }
});

// --- LISTENER DATI REALTIME ---
db.onDataChange((data) => {
    globalData = data;
    if (screens.dashboard.classList.contains('active')) renderTables();
    if (screens.order.classList.contains('active') && activeTableId) renderOrderScreen();
    if (screens.admin && screens.admin.classList.contains('active')) renderAdminScreen();
    if (screens.menu && screens.menu.classList.contains('active')) renderMenuAdminScreen();
});

// --- DASHBOARD TAVOLI ---
document.querySelectorAll('#dashboardScreen .tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('#dashboardScreen .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentZone = e.target.dataset.zone;
        renderTables();
    });
});

function renderTables() {
    if (!globalData || !globalData.tables) return;
    const grid = document.getElementById('tablesGrid');
    grid.innerHTML = '';
    
    // Mostra solo i tavoli ATTIVI per la zona corrente
    const activeTablesInZone = globalData.tables.filter(t => t.zone === currentZone && t.isActive === true);
    
    if (activeTablesInZone.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: #666;">Nessun tavolo attivo in questa zona. Attivali dalle impostazioni.</p>';
        return;
    }

    activeTablesInZone.forEach(table => {
        const card = document.createElement('div');
        card.className = `table-card table-${table.status}`;
        card.innerHTML = `
            <span class="number">${table.number}</span>
            <span class="status">${table.status}</span>
        `;
        card.addEventListener('click', () => openTable(table.id));
        grid.appendChild(card);
    });
}

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

function openTable(tableId) {
    let table = globalData.tables.find(t => t.id === tableId);
    
    if (table.status === 'LIBERO') {
        pendingTableId = tableId;
        document.getElementById('partySizeInput').value = 2;
        document.getElementById('partyArrivedCheckbox').checked = true; // Auto check for walk-ins
        document.getElementById('partyArrivedCheckbox').parentElement.style.display = 'none'; // Hide it
        document.getElementById('partySizeModal').style.display = 'flex';
    } else if (table.status === 'PRENOTATO') {
        pendingTableId = tableId;
        if (!globalData.reservations) globalData.reservations = [];
        const sortedRes = [...globalData.reservations].sort((a, b) => a.time.localeCompare(b.time));
        const nextRes = sortedRes.find(r => r.tableId === tableId && r.status === 'PENDING');
        
        if (nextRes) {
            document.getElementById('partySizeInput').value = nextRes.pax;
            document.getElementById('partyArrivedLabelText').textContent = ` ${nextRes.name} (${nextRes.time}) è arrivato? (Occupa tavolo)`;
        } else {
            document.getElementById('partySizeInput').value = 2;
            document.getElementById('partyArrivedLabelText').textContent = ' Occupare tavolo?';
        }
        document.getElementById('partyArrivedCheckbox').checked = false;
        document.getElementById('partyArrivedCheckbox').parentElement.style.display = 'block'; 
        
        document.getElementById('partySizeModal').style.display = 'flex';
    } else {
        // OCCUPATO
        activeTableId = tableId;
        showScreen('order');
        renderOrderScreen();
    }
}

// Gestione popup numero coperti
document.getElementById('cancelPartySizeBtn').addEventListener('click', () => {
    document.getElementById('partySizeModal').style.display = 'none';
    pendingTableId = null;
});

document.getElementById('confirmPartySizeBtn').addEventListener('click', () => {
    const partySize = parseInt(document.getElementById('partySizeInput').value) || 2;
    const isArrived = document.getElementById('partyArrivedCheckbox').checked;
    document.getElementById('partySizeModal').style.display = 'none';
    
    if (pendingTableId) {
        let table = globalData.tables.find(t => t.id === pendingTableId);
        
        if (!globalData.orders) globalData.orders = {};
        if (!globalData.orders[pendingTableId]) {
            globalData.orders[pendingTableId] = { partySize: partySize, items: [] };
        } else {
            globalData.orders[pendingTableId].partySize = partySize;
        }

        if (isArrived) {
            table.status = 'OCCUPATO';
            
            if (!globalData.reservations) globalData.reservations = [];
            const sortedRes = [...globalData.reservations].sort((a, b) => a.time.localeCompare(b.time));
            const nextRes = sortedRes.find(r => r.tableId === pendingTableId && r.status === 'PENDING');
            if (nextRes) {
                nextRes.status = 'SEATED';
            }
            
            db.set(globalData);
            activeTableId = pendingTableId;
            pendingTableId = null;
            showScreen('order');
            renderOrderScreen();
        } else {
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
    const isPizza = ['Pizze rosse', 'Pizze bianche', 'Pizze al tegamino', 'Pizze Baby'].includes(cat);
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
    const allowsExtra = isPizza || ['Focacce', 'Hamburger', 'Panuozzi', 'Calzoni'].includes(cat);
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
    
    if(!globalData.reservations) globalData.reservations = [];
    const hasNext = globalData.reservations.some(r => r.tableId === table.id && r.status === 'PENDING');
    
    table.status = hasNext ? 'PRENOTATO' : 'LIBERO';
    
    delete globalData.orders[activeTableId]; // Elimina l'ordine chiuso
    db.set(globalData);
    
    showScreen('dashboard');
    renderTables();
});

// --- GESTIONE PRENOTAZIONI AVANZATA ---
if (!globalData.reservations) globalData.reservations = [];

function renderReservations() {
    if (!globalData.reservations) globalData.reservations = [];
    const list = document.getElementById('reservationsList');
    if(!list) return;
    list.innerHTML = '';
    
    const sorted = [...globalData.reservations].sort((a, b) => a.time.localeCompare(b.time));
    
    if (sorted.length === 0) {
        list.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">Nessuna prenotazione presente.</p>';
        return;
    }
    
    sorted.forEach(res => {
        const table = globalData.tables.find(t => t.id === res.tableId);
        const tableNome = table ? `Tavolo ${table.number}` : `Tavolo N/D`;
        
        const card = document.createElement('div');
        card.className = `reservation-card ${res.status === 'SEATED' ? 'seated' : ''}`;
        
        card.innerHTML = `
            <div class="reservation-header">
                <span>🕒 ${res.time} - 👤 ${res.name}</span>
                <span>${tableNome}</span>
            </div>
            <div class="reservation-details">
                <span>📞 ${res.phone || 'Nessun numero'} | 👥 ${res.pax} persone</span>
                <span style="color: ${res.status === 'SEATED' ? 'var(--success-color)' : 'var(--warning-color)'}; font-weight: bold;">
                    ${res.status === 'SEATED' ? 'Arrivato e Seduto' : 'In attesa'}
                </span>
            </div>
        `;
        list.appendChild(card);
    });
}

document.getElementById('viewReservationsBtn').addEventListener('click', () => {
    showScreen('reservations');
    renderReservations();
});

document.getElementById('backToDashboardFromResBtn').addEventListener('click', () => {
    showScreen('dashboard');
    renderTables();
});

document.getElementById('addReservationBtn').addEventListener('click', () => {
    const select = document.getElementById('resTableSelect');
    if(select) {
        select.innerHTML = '';
        globalData.tables.filter(t => t.active).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `Tavolo ${t.number}`;
            select.appendChild(opt);
        });
    }
    
    document.getElementById('resTimeInput').value = '20:00';
    document.getElementById('resNameInput').value = '';
    document.getElementById('resPhoneInput').value = '';
    document.getElementById('resPaxInput').value = '2';
    
    document.getElementById('reservationFormModal').style.display = 'flex';
});

document.getElementById('cancelResBtn').addEventListener('click', () => {
    document.getElementById('reservationFormModal').style.display = 'none';
});

document.getElementById('saveResBtn').addEventListener('click', () => {
    const time = document.getElementById('resTimeInput').value;
    const name = document.getElementById('resNameInput').value.trim();
    const phone = document.getElementById('resPhoneInput').value.trim();
    const pax = parseInt(document.getElementById('resPaxInput').value) || 2;
    const tableId = parseInt(document.getElementById('resTableSelect').value);
    
    if (!time || !name) {
        alert("Inserisci orario e nome del cliente.");
        return;
    }
    
    if (!globalData.reservations) globalData.reservations = [];
    
    globalData.reservations.push({
        id: Date.now(),
        time,
        name,
        phone,
        pax,
        tableId,
        status: 'PENDING'
    });
    
    const table = globalData.tables.find(t => t.id === tableId);
    if (table && table.status === 'LIBERO') {
        table.status = 'PRENOTATO';
    }
    
    db.set(globalData);
    document.getElementById('reservationFormModal').style.display = 'none';
    renderReservations();
});

// --- NAVIGAZIONE BACK ---
document.getElementById('backToDashboardBtn').addEventListener('click', () => {
    activeTableId = null;
    showScreen('dashboard');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    showScreen('login');
});
