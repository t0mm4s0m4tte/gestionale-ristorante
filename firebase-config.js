
const firebaseConfig = {
  apiKey: "AIzaSyB16cKVHCwLrHHsdajIPdVve_SxPwZ4JD4",
  authDomain: "restaurantapp-sfbr.firebaseapp.com",
  databaseURL: "https://restaurantapp-sfbr-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "restaurantapp-sfbr",
  storageBucket: "restaurantapp-sfbr.firebasestorage.app",
  messagingSenderId: "1031269351749",
  appId: "1:1031269351749:web:17d597b8d71a0920bbfe2c",
  measurementId: "G-2RE7X68H4Y"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Wrapper to mimic the previous MockRealtimeDB interface for easy migration
class RealtimeDB {
    constructor() {
        this.dbRef = database.ref('restaurant_db');
        this.checkAndInitData();
    }

    async checkAndInitData() {
        const snapshot = await this.dbRef.once('value');
        if (!snapshot.exists()) {
            await this.initDefaultData();
        }
    }

    async initDefaultData() {
        const defaultData = {
            tables: this.generateUniverseTables(),
            orders: {},
            menu: [
                { id: 1, name: "Antipasto Misto Terra", category: "Antipasti di terra", price: 12.00 },
                { id: 2, name: "Impepata di Cozze", category: "Antipasti di mare", price: 10.00 },
                { id: 3, name: "Spaghetti alla Carbonara", category: "Primi di terra", price: 10.00 },
                { id: 4, name: "Linguine allo Scoglio", category: "Primi di mare", price: 15.00 },
                { id: 5, name: "Gnocchi 4 Formaggi", category: "Gnocchi della casa", price: 9.00 },
                { id: 6, name: "Tagliata di Manzo", category: "Secondi di terra", price: 18.00 },
                { id: 7, name: "Frittura Mista", category: "Secondi di mare", price: 16.00 },
                { id: 8, name: "Margherita", category: "Pizze rosse", price: 6.00 },
                { id: 9, name: "4 Formaggi Bianca", category: "Pizze bianche", price: 8.00 },
                { id: 10, name: "Pizza al Tegamino", category: "Pizze al tegamino", price: 7.00 },
                { id: 11, name: "Focaccia Classica", category: "Focacce", price: 4.00 },
                { id: 12, name: "Coca Cola", category: "Bibite varie", price: 2.50 },
                { id: 13, name: "Birra Bionda Piccola", category: "Birre alla spina", price: 3.50 },
                { id: 14, name: "Ichnusa 33cl", category: "Birre in bottiglia", price: 4.00 },
                { id: 15, name: "Prosecco 1/4", category: "Vini alla spina", price: 4.50 },
                { id: 16, name: "Falanghina Bottiglia", category: "Vini bianchi", price: 18.00 },
                { id: 17, name: "Chianti Bottiglia", category: "Vini rossi", price: 20.00 },
                { id: 18, name: "Caffè Espresso", category: "Caffè", price: 1.50 },
                { id: 19, name: "Limoncello", category: "Amari", price: 3.00 }
            ]
        };
        await this.dbRef.set(defaultData);
    }

    generateUniverseTables() {
        const tables = [];
        // Sala Grande: 1-25
        for (let i = 1; i <= 25; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_GRANDE', status: 'LIBERO', isActive: false });
        }
        // Sala Grande: 100-120
        for (let i = 100; i <= 120; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_GRANDE', status: 'LIBERO', isActive: false });
        }
        // Sala Piccola: 50-56
        for (let i = 50; i <= 56; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_PICCOLA', status: 'LIBERO', isActive: false });
        }
        // Dehor: 57-70
        for (let i = 57; i <= 70; i++) {
            tables.push({ id: i, number: i, zone: 'DEHOR', status: 'LIBERO', isActive: false });
        }
        return tables;
    }

    set(newData) {
        this.dbRef.set(newData);
    }

    onDataChange(callback) {
        this.dbRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        });
    }
}

window.db = new RealtimeDB();
