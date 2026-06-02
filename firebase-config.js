
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

const isLocalFile = false;
let app = null;
let database = null;

if (typeof firebase !== 'undefined' && !isLocalFile) {
    app = firebase.initializeApp(firebaseConfig);
    database = firebase.database();
} else {
    console.warn("Esecuzione locale o Firebase non caricato. Uso LocalStorage.");
}

// Wrapper to mimic the previous MockRealtimeDB interface for easy migration
class RealtimeDB {
    constructor() {
        this.isLocalFallback = (typeof firebase === 'undefined' || isLocalFile);
        if (!this.isLocalFallback) {
            this.dbRef = database.ref('restaurant_db');
            this.checkAndInitData();
        } else {
            this.checkAndInitLocalData();
        }
    }

    async checkAndInitData() {
        const snapshot = await this.dbRef.once('value');
        if (!snapshot.exists()) {
            await this.initDefaultData();
        }
    }

    async checkAndInitLocalData() {
        const localData = localStorage.getItem('restaurant_db');
        if (!localData) {
            await this.initDefaultData();
        }
    }

    async initDefaultData() {
        const defaultData = {
            tables: this.generateUniverseTables(),
            orders: {},
            menu: [
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 1,
    "ingredients": "Pane tostato, burro all'olio, acciughe del Cantabrico",
    "name": "Pane Burro all'olio e acciughe del Cantabrico",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 2,
    "ingredients": "Pane tostato, pomodoro a cubetti, basilico, olio EVO, aglio",
    "name": "La bruschetta: pomodoro, mozzarella, basilico",
    "price": 10
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 3,
    "ingredients": "Prosciutto crudo, salame, coppa, pancetta",
    "name": "Tagliere di salumi",
    "price": 12
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 4,
    "ingredients": "Selezione di formaggi locali e marmellate",
    "name": "Tagliere di formaggi",
    "price": 12
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 5,
    "ingredients": "Prosciutto crudo, salame, coppa, selezione di formaggi, miele",
    "name": "Tagliere di salumi e formaggi",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 6,
    "ingredients": "Bresaola punta d'anca, rucola, scaglie di grana, limone, olio EVO",
    "name": "Bresaola con rucola e parmigiano",
    "price": 14
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 7,
    "ingredients": "Girello di vitello, salsa tonnata (tonno, maionese, capperi, acciughe)",
    "name": "Vitello tonnato con la sua salsa",
    "price": 12
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 8,
    "ingredients": "Carne cruda di vitello fassone, sale, pepe, olio EVO",
    "name": "Battuta di vitello al coltello",
    "price": 14
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 9,
    "ingredients": "",
    "name": "Battuta con fonduta di gorgonzola DOP e miele",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 10,
    "ingredients": "",
    "name": "Flan di verdure con fonduta",
    "price": 12
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 11,
    "ingredients": "",
    "name": "Antipasto della casa",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di mare",
    "id": 12,
    "ingredients": "Polpo, burrata, granella di nocciole, olio EVO",
    "name": "Polpo croccante su letto di burrata e nocciole",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di mare",
    "id": 13,
    "ingredients": "Polpo, patate, olive taggiasche, prezzemolo",
    "name": "Insalata di polpo tiepida, patate e olive taggiasche",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di mare",
    "id": 14,
    "ingredients": "Pomodoro, aglio, origano, basilico",
    "name": "Sautè di cozze alla marinara",
    "price": 13
  },
  {
    "active": true,
    "category": "Antipasti di mare",
    "id": 15,
    "ingredients": "Pomodoro, mozzarella, salamino piccante",
    "name": "Sautè di cozze alla diavola",
    "price": 14
  },
  {
    "active": true,
    "category": "Antipasti di mare",
    "id": 16,
    "ingredients": "",
    "name": "Insalata di mare",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 17,
    "ingredients": "",
    "name": "Patate al forno",
    "price": 4
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 18,
    "ingredients": "",
    "name": "Patate fritte",
    "price": 4
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 19,
    "ingredients": "",
    "name": "Chiacchere con lardo",
    "price": 10
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 20,
    "ingredients": "",
    "name": "Chiacchere con crudo di Parma 24 mesi",
    "price": 12
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 21,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto",
    "name": "Chiacchere con prosciutto cotto",
    "price": 10
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 22,
    "ingredients": "",
    "name": "Chiacchere con crudo 24 mesi e burrata",
    "price": 15
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 23,
    "ingredients": "",
    "name": "Chiacchere pomodorini, mozzarella e basilico",
    "price": 10
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 24,
    "ingredients": "",
    "name": "Chiacchere con Nutella",
    "price": 10
  },
  {
    "active": true,
    "category": "Antipasti di terra",
    "id": 25,
    "ingredients": "",
    "name": "Chiacchere salate",
    "price": 6
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 26,
    "ingredients": "Rigatoni, salmone affumicato, panna, passata di pomodoro",
    "name": "Rigatoni salmone, panna e pomodoro",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 27,
    "ingredients": "",
    "name": "Paccheri del Diavolo",
    "price": 12
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 28,
    "ingredients": "",
    "name": "Paccheri spada e pomodorini",
    "price": 14
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 29,
    "ingredients": "Spaghetti alla chitarra, vongole veraci, aglio, prezzemolo, peperoncino",
    "name": "Spaghetti alla chitarra alle vongole veraci",
    "price": 14
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 30,
    "ingredients": "Spaghetti alla chitarra, cozze, vongole, calamari, gamberetti, pomodorini",
    "name": "Spaghetti alla chitarra allo scoglio",
    "price": 13
  },
  {
    "active": true,
    "category": "Primi di mare",
    "id": 31,
    "ingredients": "",
    "name": "Paccheri pesto di zucchine e gamberi",
    "price": 14
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 32,
    "ingredients": "",
    "name": "Rigatoni Rigatony",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 33,
    "ingredients": "",
    "name": "Rigatoni Nonna Rosa",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 34,
    "ingredients": "",
    "name": "Rigatoni speck e taleggio",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 35,
    "ingredients": "",
    "name": "Rigatoni pomodoro, salsiccia e burrata",
    "price": 12
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 36,
    "ingredients": "",
    "name": "Rigatoni Spring Team",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 37,
    "ingredients": "",
    "name": "Rigatoni Vegetariani",
    "price": 9
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 38,
    "ingredients": "",
    "name": "Tonnarelli aglio, olio, peperoncino, acciughe e pane fritto",
    "price": 11
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 39,
    "ingredients": "Orecchiette, ragù di carne bovina e suina, pomodoro",
    "name": "Orecchiette al ragù",
    "price": 9
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 40,
    "ingredients": "",
    "name": "Orecchiette salsiccia e pomodorini",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 41,
    "ingredients": "Tonnarelli, guanciale, pecorino, pomodoro, pepe nero",
    "name": "Tonnarelli all'Amatriciana",
    "price": 10
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 42,
    "ingredients": "",
    "name": "Tonnarelli del Direttore",
    "price": 13
  },
  {
    "active": true,
    "category": "Primi di terra",
    "id": 43,
    "ingredients": "Tonnarelli, pecorino romano, pepe nero",
    "name": "Tonnarelli cacio e pepe",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 44,
    "ingredients": "Gnocchi di patate, salsa di pomodoro, basilico",
    "name": "Gnocchi al pomodoro",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 45,
    "ingredients": "Gnocchi di patate, fonduta di formaggi misti",
    "name": "Gnocchi ai formaggi",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 46,
    "ingredients": "",
    "name": "Gnocchi alla bava",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 47,
    "ingredients": "Gnocchi di patate, gorgonzola DOP, panna",
    "name": "Gnocchi al gorgonzola",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 48,
    "ingredients": "",
    "name": "Gnocchi speck e brie",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 49,
    "ingredients": "Gnocchi di patate, pomodoro, mozzarella fiordilatte, basilico, parmigiano",
    "name": "Gnocchi alla sorrentina",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 50,
    "ingredients": "",
    "name": "Gnocchi con salsiccia",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 51,
    "ingredients": "",
    "name": "Gnocchi Nonna Rosa",
    "price": 10
  },
  {
    "active": true,
    "category": "Gnocchi della casa",
    "id": 52,
    "ingredients": "",
    "name": "Gnocchi con radicchio, gorgonzola e salsiccia",
    "price": 10
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 53,
    "ingredients": "Filetto di manzo, senape, panna, pepe verde in grani",
    "name": "Filetto al pepe verde",
    "price": 26
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 54,
    "ingredients": "Filetto di manzo, sale grosso, olio EVO",
    "name": "Filetto alla griglia",
    "price": 24
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 55,
    "ingredients": "Carne di manzo, rucola fresca, pomodorini, scaglie di grana",
    "name": "Tagliata di filetto con rucola, grana e pomodorini",
    "price": 25
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 56,
    "ingredients": "",
    "name": "Arrosticini (8 pezzi) con bruschetta",
    "price": 12
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 57,
    "ingredients": "",
    "name": "Petto di pollo",
    "price": 10
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 58,
    "ingredients": "Pomodoro, mozzarella, salsiccia, origano, basilico",
    "name": "Salsiccia",
    "price": 10
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 59,
    "ingredients": "",
    "name": "Milanese di pollo/vitello",
    "price": 12
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 60,
    "ingredients": "Carne di manzo, rucola fresca, pomodorini, scaglie di grana",
    "name": "Tagliata di vitello 300g con rucola e ciliegino",
    "price": 16
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 61,
    "ingredients": "",
    "name": "Grigliata mista di carne e patate",
    "price": 21
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 62,
    "ingredients": "",
    "name": "La nostra costata all'etto",
    "price": 5
  },
  {
    "active": true,
    "category": "Secondi di terra",
    "id": 63,
    "ingredients": "",
    "name": "Entrecôte alla griglia",
    "price": 19
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 64,
    "ingredients": "Calamari, gamberoni, merluzzo, farina, limone",
    "name": "Frittura di calamari, gamberoni e merluzzo",
    "price": 16
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 65,
    "ingredients": "Pesce spada, pomodorini, olive, capperi, origano",
    "name": "Spada alla mediterranea con insalata",
    "price": 15
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 66,
    "ingredients": "",
    "name": "Spada alla griglia e contorno",
    "price": 14
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 67,
    "ingredients": "",
    "name": "Baccalà in tempura",
    "price": 13
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 68,
    "ingredients": "",
    "name": "Gamberi in tempura",
    "price": 14
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 69,
    "ingredients": "",
    "name": "Grigliata di pesce min 2 persone",
    "price": 25
  },
  {
    "active": true,
    "category": "Secondi di mare",
    "id": 70,
    "ingredients": "",
    "name": "Filetto di branzino e/o orata al forno/alla piastra",
    "price": 15
  },
  {
    "active": true,
    "category": "Insalate",
    "id": 71,
    "ingredients": "",
    "name": "Cerutti (Insalata verde)",
    "price": 6
  },
  {
    "active": true,
    "category": "Insalate",
    "id": 72,
    "ingredients": "",
    "name": "Ricco (Insalata, pomodoro, mozzarella, tonno, mais, uova)",
    "price": 8
  },
  {
    "active": true,
    "category": "Insalate",
    "id": 73,
    "ingredients": "",
    "name": "Di muro (Verdure grigliate)",
    "price": 8
  },
  {
    "active": true,
    "category": "Insalate",
    "id": 74,
    "ingredients": "",
    "name": "Longo (Insalata, crostini, pollo, caesar)",
    "price": 10
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 75,
    "ingredients": "Pane bun, hamburger di manzo 200g, insalata, pomodoro",
    "name": "Hamburger",
    "price": 8
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 76,
    "ingredients": "",
    "name": "Parigino",
    "price": 10
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 77,
    "ingredients": "",
    "name": "Totò",
    "price": 10
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 78,
    "ingredients": "",
    "name": "Rincon",
    "price": 10
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 79,
    "ingredients": "",
    "name": "Valentino",
    "price": 10
  },
  {
    "active": true,
    "category": "Hamburger",
    "id": 80,
    "ingredients": "",
    "name": "Hamburger Siamo Fritti",
    "price": 11
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 81,
    "ingredients": "Pomodoro, aglio, origano, basilico",
    "name": "Marinara",
    "price": 5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 82,
    "ingredients": "Pomodoro, mozzarella, basilico",
    "name": "Margherita",
    "price": 6.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 83,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto",
    "name": "Prosciutto",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 84,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto, funghi champignon",
    "name": "Prosciutto e funghi",
    "price": 9.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 85,
    "ingredients": "",
    "name": "Mara",
    "price": 10.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 86,
    "ingredients": "Pomodoro, mozzarella, salamino piccante",
    "name": "Diavola",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 87,
    "ingredients": "Pomodoro, mozzarella, uovo, prosciutto cotto",
    "name": "Bismark",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 88,
    "ingredients": "Pomodoro, mozzarella, würstel",
    "name": "Würstel",
    "price": 8
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 89,
    "ingredients": "Pomodoro, mozzarella, würstel, patatine fritte",
    "name": "Würstel e patatine fritte",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 90,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto, fontina",
    "name": "Valdostana",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 91,
    "ingredients": "Pomodoro, mozzarella, gorgonzola, fontina, parmigiano",
    "name": "4 Formaggi",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 92,
    "ingredients": "Mozzarella, stracciatella, pomodorini, pistacchio",
    "name": "Rosa",
    "price": 10
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 93,
    "ingredients": "",
    "name": "Angelica",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 94,
    "ingredients": "",
    "name": "Claudia",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 95,
    "ingredients": "",
    "name": "Anna",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 96,
    "ingredients": "",
    "name": "Giorgia",
    "price": 9.5
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 97,
    "ingredients": "",
    "name": "Maddalena",
    "price": 11.5
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 98,
    "ingredients": "",
    "name": "Desi",
    "price": 10
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 99,
    "ingredients": "",
    "name": "Isabel",
    "price": 10
  },
  {
    "active": true,
    "category": "Pizze bianche",
    "id": 100,
    "ingredients": "",
    "name": "Siamo Fritti Bianca",
    "price": 11
  },
  {
    "active": true,
    "category": "Pizze Baby",
    "id": 101,
    "ingredients": "Pomodoro, mozzarella, salamino piccante",
    "name": "Baby Diavola",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze Baby",
    "id": 102,
    "ingredients": "Pomodoro, mozzarella, basilico",
    "name": "Baby Margherita",
    "price": 5
  },
  {
    "active": true,
    "category": "Pizze Baby",
    "id": 103,
    "ingredients": "Pomodoro, mozzarella, würstel",
    "name": "Baby Würstel",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze Baby",
    "id": 104,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto",
    "name": "Baby Prosciutto",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze Baby",
    "id": 105,
    "ingredients": "Pomodoro, mozzarella, würstel, patatine fritte",
    "name": "Baby Würstel e Patatine",
    "price": 6
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 106,
    "ingredients": "",
    "name": "Oasi latina",
    "price": 11
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 107,
    "ingredients": "",
    "name": "Focaccia Prosciutto crudo",
    "price": 10
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 108,
    "ingredients": "",
    "name": "Focaccia Lardo",
    "price": 9
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 109,
    "ingredients": "",
    "name": "Focaccia Marra",
    "price": 11
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 110,
    "ingredients": "",
    "name": "Focaccia La Mole",
    "price": 12
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 111,
    "ingredients": "",
    "name": "Focaccia Scapazzoni",
    "price": 12
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 112,
    "ingredients": "",
    "name": "Focaccia Donegà",
    "price": 12
  },
  {
    "active": true,
    "category": "Focacce",
    "id": 113,
    "ingredients": "",
    "name": "Focaccia Felline (Nutella)",
    "price": 8
  },
  {
    "active": true,
    "category": "Taglieri Speciali",
    "id": 114,
    "ingredients": "",
    "name": "Tagliere Siamo Fritti",
    "price": 50
  },
  {
    "active": true,
    "category": "Taglieri Speciali",
    "id": 115,
    "ingredients": "",
    "name": "Mini tagliere Siamo Fritti",
    "price": 25
  },
  {
    "active": true,
    "category": "Panuozzi",
    "id": 116,
    "ingredients": "",
    "name": "Panuozzo Luca",
    "price": 11
  },
  {
    "active": true,
    "category": "Panuozzi",
    "id": 117,
    "ingredients": "",
    "name": "Panuozzo Antonio",
    "price": 11
  },
  {
    "active": true,
    "category": "Panuozzi",
    "id": 118,
    "ingredients": "",
    "name": "Panuozzo Roberto",
    "price": 11
  },
  {
    "active": true,
    "category": "Panuozzi",
    "id": 119,
    "ingredients": "",
    "name": "Panuozzo Lollo",
    "price": 11
  },
  {
    "active": true,
    "category": "Calzoni",
    "id": 120,
    "ingredients": "Pomodoro, mozzarella, prosciutto cotto, funghi",
    "name": "Calzone Zio Mario",
    "price": 8.5
  },
  {
    "active": true,
    "category": "Calzoni",
    "id": 121,
    "ingredients": "Pomodoro, mozzarella, ricotta, salamino, pepe",
    "name": "Calzone Nonno Beppe",
    "price": 9
  },
  {
    "active": true,
    "category": "Calzoni",
    "id": 122,
    "ingredients": "Pomodoro, mozzarella, ciccioli, ricotta, pepe",
    "name": "Calzone Nonno Mimmo",
    "price": 10
  },
  {
    "active": true,
    "category": "Calzoni",
    "id": 123,
    "ingredients": "Mozzarella, scarola, olive, capperi, acciughe",
    "name": "Siamo Fritti Calzone",
    "price": 14
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 124,
    "ingredients": "",
    "name": "CocaCola",
    "price": 4
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 125,
    "ingredients": "",
    "name": "Fanta",
    "price": 4
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 126,
    "ingredients": "",
    "name": "CocaCola Zero",
    "price": 4
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 127,
    "ingredients": "",
    "name": "Chinotto Lurisia",
    "price": 4
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 128,
    "ingredients": "",
    "name": "Sprite",
    "price": 4
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 129,
    "ingredients": "",
    "name": "Tonica Schweppes",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 130,
    "ingredients": "",
    "name": "Lemon Soda",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 131,
    "ingredients": "",
    "name": "Estathè al limone",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 132,
    "ingredients": "",
    "name": "Estathè alla pesca",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 133,
    "ingredients": "",
    "name": "Acqua 1/2 naturale",
    "price": 2
  },
  {
    "active": true,
    "category": "Bibite varie",
    "id": 134,
    "ingredients": "",
    "name": "Acqua 1/2 frizzante",
    "price": 2
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 135,
    "ingredients": "",
    "name": "Caffè espresso",
    "price": 1.5
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 136,
    "ingredients": "",
    "name": "Caffè corretto",
    "price": 2
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 137,
    "ingredients": "",
    "name": "Caffè decaffeinato",
    "price": 1.5
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 138,
    "ingredients": "",
    "name": "Thè caldo",
    "price": 2
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 139,
    "ingredients": "",
    "name": "Tisana",
    "price": 2
  },
  {
    "active": true,
    "category": "Caffè",
    "id": 140,
    "ingredients": "",
    "name": "Caffè d'orzo",
    "price": 1.5
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 141,
    "ingredients": "Pomodoro, aglio, origano, basilico",
    "name": "Marinara al tegamino",
    "price": 4
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 142,
    "ingredients": "Pomodoro, mozzarella, basilico",
    "name": "Margherita al tegamino",
    "price": 5
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 143,
    "ingredients": "Pomodoro, mozzarella, acciughe, origano",
    "name": "Napoli al tegamino",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 144,
    "ingredients": "Pomodoro, mozzarella, olive",
    "name": "La Greca al tegamino",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 145,
    "ingredients": "Pomodoro, mozzarella, salamino piccante, basilico",
    "name": "Diavola al tegamino",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 146,
    "ingredients": "Pomodoro, mozzarella, prosciutto, basilico",
    "name": "Prosciutto al tegamino",
    "price": 6
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 147,
    "ingredients": "Pomodoro, mozzarella, prosciutto, funghi, basilico",
    "name": "Prosciutto e funghi al tegamino",
    "price": 6.5
  },
  {
    "active": true,
    "category": "Pizze al tegamino",
    "id": 148,
    "ingredients": "",
    "name": "Teglia di farinata",
    "price": 7
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 149,
    "ingredients": "Pomodoro, mozzarella, gorgonzola, salamino piccante, basilico",
    "name": "Gorgonzola e salamino",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 150,
    "ingredients": "Pomodoro, mozzarella, champignon, carciofini, olive, prosciutto cotto, salamino, basilico",
    "name": "Capricciosa",
    "price": 11
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 151,
    "ingredients": "Pomodoro, mozzarella, champignon, basilico",
    "name": "Funghi",
    "price": 8.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 152,
    "ingredients": "Pomodoro, mozzarella, champignon, salamino piccante, basilico",
    "name": "Mary Samuel",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 153,
    "ingredients": "Pomodoro, mozzarella, champignon, salsiccia, basilico",
    "name": "Del Gaizo",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 154,
    "ingredients": "Pomodoro, mozzarella, melanzane fritte, cacio ricotta, basilico",
    "name": "Vizzari",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 155,
    "ingredients": "Pomodoro, mozzarella, prosciutto crudo di Parma, pomodorini, basilico",
    "name": "Monteparma",
    "price": 11
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 156,
    "ingredients": "Pomodoro, gorgo, patate al forno, salsiccia, olive taggiasche",
    "name": "Siamo Fritti Rossa",
    "price": 12.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 157,
    "ingredients": "Pomodoro, mozzarella, champignon, prosciutto cotto, olive, carciofi, basilico",
    "name": "4 Stagioni",
    "price": 10
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 158,
    "ingredients": "Pomodoro, mozzarella, peperoni, melanzane, zucchine, rucola, pomodorini",
    "name": "Vegetariana",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 159,
    "ingredients": "Pomodoro, mozzarella, acciughe del Cantabrico, origano",
    "name": "Don Vittorio",
    "price": 11
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 160,
    "ingredients": "Pomodoro, mozzarella, speck, brie, basilico",
    "name": "Tirolese",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 161,
    "ingredients": "Pomodoro, mozzarella, salsiccia, origano, basilico",
    "name": "Salsiccia",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 162,
    "ingredients": "Pomodoro, mozzarella, salsiccia, burrata, basilico",
    "name": "Salsiccia e burrata",
    "price": 12
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 163,
    "ingredients": "Pomodoro, mozzarella, salsiccia, peperoni arrostiti, basilico",
    "name": "Chicco",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 164,
    "ingredients": "Pomodoro, mozzarella, salsiccia, gorgonzola, cipolla, origano",
    "name": "Sporcacciona",
    "price": 10
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 165,
    "ingredients": "Pomodoro, mozzarella, gorgonzola, basilico",
    "name": "Gorgo",
    "price": 8.5
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 166,
    "ingredients": "Pomodoro, mozzarella, cipolla rossa, gorgonzola, basilico",
    "name": "Gorgo e cipolla",
    "price": 9
  },
  {
    "active": true,
    "category": "Pizze rosse",
    "id": 167,
    "ingredients": "Pomodoro, gorgonzola, salamino, burrata, basilico",
    "name": "Vincentony",
    "price": 11.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 168,
    "ingredients": "",
    "name": "Forst Bionda/Panaché (Piccola)",
    "price": 3
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 169,
    "ingredients": "",
    "name": "Forst Bionda/Panaché (Media)",
    "price": 4.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 170,
    "ingredients": "",
    "name": "Forst Rossa (Piccola)",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 171,
    "ingredients": "",
    "name": "Forst Rossa (Media)",
    "price": 5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 172,
    "ingredients": "",
    "name": "Felsenkeller (Media)",
    "price": 4
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 173,
    "ingredients": "",
    "name": "Leffe Ambrata (Piccola)",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 174,
    "ingredients": "",
    "name": "Leffe Ambrata (Media)",
    "price": 5.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 175,
    "ingredients": "",
    "name": "Weihenstephaner (Piccola)",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Birre alla spina",
    "id": 176,
    "ingredients": "",
    "name": "Weihenstephaner (Media)",
    "price": 5.5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 177,
    "ingredients": "",
    "name": "Ceres",
    "price": 4.5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 178,
    "ingredients": "",
    "name": "Becks",
    "price": 4
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 179,
    "ingredients": "",
    "name": "Heineken analcolica",
    "price": 4.5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 180,
    "ingredients": "",
    "name": "Tennent's",
    "price": 4.5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 181,
    "ingredients": "",
    "name": "Corona",
    "price": 4.5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 182,
    "ingredients": "",
    "name": "Tennent's senza glutine",
    "price": 5
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 183,
    "ingredients": "",
    "name": "Ichnusa",
    "price": 4
  },
  {
    "active": true,
    "category": "Birre in bottiglia",
    "id": 184,
    "ingredients": "",
    "name": "Wiess 0,50cl",
    "price": 5
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 185,
    "ingredients": "",
    "name": "Arneis - Carlin de Paolo",
    "price": 24
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 186,
    "ingredients": "",
    "name": "Roero Arneis Cayega - Tenuta Carretta",
    "price": 25
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 187,
    "ingredients": "",
    "name": "Gevurztraminer - Henri Weber",
    "price": 26
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 188,
    "ingredients": "",
    "name": "Cervaro della Sala - Cantina Antinori",
    "price": 110
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 189,
    "ingredients": "",
    "name": "La Falanghina",
    "price": 25
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 190,
    "ingredients": "",
    "name": "Monferrato Chiaretto Rosè - Carlin de Paolo",
    "price": 26
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 191,
    "ingredients": "",
    "name": "Chardonnay - Carlin de Paolo",
    "price": 27
  },
  {
    "active": true,
    "category": "Vini bianchi",
    "id": 192,
    "ingredients": "",
    "name": "Regina di fiori - Carlin de Paolo",
    "price": 25
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 193,
    "ingredients": "",
    "name": "Spumante extra dry Luis - Carlin de Paolo",
    "price": 25
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 194,
    "ingredients": "",
    "name": "Spumante brut Exe - Pescaja",
    "price": 24
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 195,
    "ingredients": "",
    "name": "Moscato - Carlin de Paolo",
    "price": 26
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 196,
    "ingredients": "",
    "name": "Franciacorta Grande Cuvèe Bellavista",
    "price": 50
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 197,
    "ingredients": "",
    "name": "Franciacorta Bellavista Teatro alla Scala",
    "price": 70
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 198,
    "ingredients": "",
    "name": "Champagne Taittinger Brut Prestige",
    "price": 80
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 199,
    "ingredients": "",
    "name": "Champagne Ruinart",
    "price": 100
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 200,
    "ingredients": "",
    "name": "Champagne Don Perignon Vintage 2013",
    "price": 310
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 201,
    "ingredients": "",
    "name": "Champagne Krug Grand Cuvée",
    "price": 350
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 202,
    "ingredients": "",
    "name": "Ferrari",
    "price": 45
  },
  {
    "active": true,
    "category": "Bollicine",
    "id": 203,
    "ingredients": "",
    "name": "Magnum Luis Rosè",
    "price": 70
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 204,
    "ingredients": "",
    "name": "Bianco vivace 1/4",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 205,
    "ingredients": "",
    "name": "Bianco vivace 1/2",
    "price": 6.5
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 206,
    "ingredients": "",
    "name": "Bianco vivace 1 litro",
    "price": 11
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 207,
    "ingredients": "",
    "name": "Rosso della casa 1/4",
    "price": 3.5
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 208,
    "ingredients": "",
    "name": "Rosso della casa 1/2",
    "price": 6.5
  },
  {
    "active": true,
    "category": "Vini alla spina",
    "id": 209,
    "ingredients": "",
    "name": "Rosso della casa 1 litro",
    "price": 11
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 210,
    "ingredients": "",
    "name": "Barbera d'Asti - Carlin de Paolo",
    "price": 24
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 211,
    "ingredients": "",
    "name": "Barolo - Carlin de Paolo",
    "price": 50
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 212,
    "ingredients": "",
    "name": "Nebbiolo Superiore - Carlin de Paolo",
    "price": 30
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 213,
    "ingredients": "",
    "name": "Cabernet Sauvignon - Don Simone",
    "price": 20
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 214,
    "ingredients": "",
    "name": "Amarone Valpolicella - Arco dei Giovi",
    "price": 45
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 215,
    "ingredients": "",
    "name": "Il Giullare - Carlin de Paolo",
    "price": 30
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 216,
    "ingredients": "",
    "name": "Barbaresco - Carlin de Paolo",
    "price": 45
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 217,
    "ingredients": "",
    "name": "Dolcetto - Carlin de Paolo",
    "price": 26
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 218,
    "ingredients": "",
    "name": "Bonarda - Carlin de Paolo",
    "price": 26
  },
  {
    "active": true,
    "category": "Vini rossi",
    "id": 219,
    "ingredients": "",
    "name": "Barbera d'Asti Superiore",
    "price": 32
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 220,
    "ingredients": "",
    "name": "Martini Rossi",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 221,
    "ingredients": "",
    "name": "Martini Bianco",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 222,
    "ingredients": "",
    "name": "Porto",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 223,
    "ingredients": "",
    "name": "Cointreau",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 224,
    "ingredients": "",
    "name": "Grand Marnier",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 225,
    "ingredients": "",
    "name": "San Simone",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 226,
    "ingredients": "",
    "name": "Montenegro",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 227,
    "ingredients": "",
    "name": "Averna",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 228,
    "ingredients": "",
    "name": "Jagermeister",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 229,
    "ingredients": "",
    "name": "Mirto",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 230,
    "ingredients": "",
    "name": "Limoncello",
    "price": 3
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 231,
    "ingredients": "",
    "name": "Sambuca",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 232,
    "ingredients": "",
    "name": "Amaro del Capo",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 233,
    "ingredients": "",
    "name": "Lucano",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 234,
    "ingredients": "",
    "name": "Fernet",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 235,
    "ingredients": "",
    "name": "Disaronno",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 236,
    "ingredients": "",
    "name": "Ramazzotti",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 237,
    "ingredients": "",
    "name": "Courvoisier",
    "price": 5
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 238,
    "ingredients": "",
    "name": "Glent Grant",
    "price": 5
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 239,
    "ingredients": "",
    "name": "Jack Daniels",
    "price": 5
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 240,
    "ingredients": "",
    "name": "Baileys",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 241,
    "ingredients": "",
    "name": "Sheridan",
    "price": 4
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 242,
    "ingredients": "",
    "name": "Zacapa",
    "price": 8
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 243,
    "ingredients": "",
    "name": "Pampero",
    "price": 5
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 244,
    "ingredients": "",
    "name": "Havana 7 anni",
    "price": 6
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 245,
    "ingredients": "",
    "name": "Zacapa XO con cioccolato fondente",
    "price": 12
  },
  {
    "active": true,
    "category": "Alcolici",
    "id": 246,
    "ingredients": "",
    "name": "Oban",
    "price": 8
  }
].map(item => {
                const ingredientsMap = {
                            'Marinara al tegamino': 'Pomodoro, aglio, origano, basilico',
                            'Margherita al tegamino': 'Pomodoro, mozzarella, basilico',
                            'Napoli al tegamino': 'Pomodoro, mozzarella, acciughe, origano',
                            'La Greca al tegamino': 'Pomodoro, mozzarella, olive',
                            'Diavola al tegamino': 'Pomodoro, mozzarella, salamino piccante, basilico',
                            'Prosciutto al tegamino': 'Pomodoro, mozzarella, prosciutto, basilico',
                            'Prosciutto e funghi al tegamino': 'Pomodoro, mozzarella, prosciutto, funghi, basilico',
                            'Gorgonzola e salamino': 'Pomodoro, mozzarella, gorgonzola, salamino piccante, basilico',
                            'Capricciosa': 'Pomodoro, mozzarella, champignon, carciofini, olive, prosciutto cotto, salamino, basilico',
                            'Funghi': 'Pomodoro, mozzarella, champignon, basilico',
                            'Mary Samuel': 'Pomodoro, mozzarella, champignon, salamino piccante, basilico',
                            'Del Gaizo': 'Pomodoro, mozzarella, champignon, salsiccia, basilico',
                            'Vizzari': 'Pomodoro, mozzarella, melanzane fritte, cacio ricotta, basilico',
                            'Monteparma': 'Pomodoro, mozzarella, prosciutto crudo di Parma, pomodorini, basilico',
                            'Siamo Fritti Rossa': 'Pomodoro, gorgo, patate al forno, salsiccia, olive taggiasche',
                            '4 Stagioni': 'Pomodoro, mozzarella, champignon, prosciutto cotto, olive, carciofi, basilico',
                            'Vegetariana': 'Pomodoro, mozzarella, peperoni, melanzane, zucchine, rucola, pomodorini',
                            'Don Vittorio': 'Pomodoro, mozzarella, acciughe del Cantabrico, origano',
                            'Tirolese': 'Pomodoro, mozzarella, speck, brie, basilico',
                            'Salsiccia': 'Pomodoro, mozzarella, salsiccia, origano, basilico',
                            'Salsiccia e burrata': 'Pomodoro, mozzarella, salsiccia, burrata, basilico',
                            'Chicco': 'Pomodoro, mozzarella, salsiccia, peperoni arrostiti, basilico',
                            'Sporcacciona': 'Pomodoro, mozzarella, salsiccia, gorgonzola, cipolla, origano',
                            'Gorgo': 'Pomodoro, mozzarella, gorgonzola, basilico',
                            'Gorgo e cipolla': 'Pomodoro, mozzarella, cipolla rossa, gorgonzola, basilico',
                            'Vincentony': 'Pomodoro, gorgonzola, salamino, burrata, basilico',
                            'Margherita Bianca': 'Mozzarella, basilico',
                            'Bufalina': 'Mozzarella, bufala a crudo, pomodorini, basilico',
                            'Salsiccia e friarielli': 'Mozzarella, salsiccia, friarielli, basilico',
                            'Salsiccia e patate': 'Mozzarella, salsiccia, patate al forno, basilico',
                            'Crudo': 'Mozzarella, prosciutto crudo di Parma, basilico',
                            'Crudo e burrata': 'Mozzarella, crudo di Parma, burrata, basilico',
                            'Pistacchiosa': 'Mozzarella, pesto di pistacchio, mortadella, grana, granella di pistacchio',
                            'Scugnizza': 'Mozzarella, bufala in cottura, acciughe, basilico',
                            'Noci': 'Mozzarella, gorgo, speck in cottura, noci',
                            'Cacio e pepe': 'Mozzarella, cacio ricotta, pepe',
                            'Rosa': 'Mozzarella, stracciatella, pomodorini, pistacchio',
                            'Carbonara': 'Mozzarella, guanciale, pecorino, tuorlo d\'uovo, pepe nero',
                            'Zucchine': 'Mozzarella, crema di zucchine, pancetta, provola affumicata, basilico',
                            'Ligure': 'Mozzarella, pesto di basilico, patate, fagiolini, pinoli',
                            'Radicchio': 'Mozzarella, radicchio, gorgonzola, noci',
                            'Funghi porcini': 'Mozzarella, funghi porcini, scaglie di grana, prezzemolo',
                            'Tartufo': 'Mozzarella, crema di tartufo, funghi porcini, salsiccia, scaglie di tartufo',
                            'Baby Margherita': 'Pomodoro, mozzarella, basilico',
                            'Baby Prosciutto': 'Pomodoro, mozzarella, prosciutto cotto',
                            'Baby Wurstel': 'Pomodoro, mozzarella, wurstel',
                            'Focaccia liscia': 'Olio evo, sale, origano',
                            'Focaccia al lardo': 'Lardo d\'Arnad, rosmarino',
                            'Focaccia crudo': 'Prosciutto crudo di Parma, burrata',
                            'Focaccia mortadella': 'Mortadella, stracciatella, granella di pistacchio',
                            'Panuozzo classico': 'Mozzarella, prosciutto cotto, funghi, maionese',
                            'Panuozzo bufalino': 'Bufala, prosciutto crudo, pomodorini, rucola',
                            'Panuozzo del sud': 'Mozzarella, salsiccia, friarielli, provola',
                            'Panuozzo vegetariano': 'Mozzarella, melanzane, zucchine, peperoni, scaglie di grana',
                            'Calzone Zio Mario': 'Pomodoro, mozzarella, prosciutto cotto, funghi',
                            'Calzone Nonno Beppe': 'Pomodoro, mozzarella, ricotta, salamino, pepe',
                            'Calzone Nonno Mimmo': 'Pomodoro, mozzarella, ciccioli, ricotta, pepe',
                            'Siamo Fritti Calzone': 'Mozzarella, scarola, olive, capperi, acciughe'
                        };
                return {
                    ...item,
                    active: true,
                    ingredients: ingredientsMap[item.name] || ''
                };
            })
        };
        if (!this.isLocalFallback) {
            await this.dbRef.set(defaultData);
        } else {
            localStorage.setItem('restaurant_db', JSON.stringify(defaultData));
            if (this.localCallback) this.localCallback(defaultData);
        }
    }

    generateUniverseTables() {
        const tables = [];
        // Sala Grande: 1-25
        for (let i = 1; i <= 25; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_GRANDE', status: 'LIBERO', isActive: true });
        }
        // Sala Grande: 100-120
        for (let i = 100; i <= 120; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_GRANDE', status: 'LIBERO', isActive: true });
        }
        // Sala Piccola: 50-56
        for (let i = 50; i <= 56; i++) {
            tables.push({ id: i, number: i, zone: 'SALA_PICCOLA', status: 'LIBERO', isActive: true });
        }
        // Dehor: 57-70
        for (let i = 57; i <= 70; i++) {
            tables.push({ id: i, number: i, zone: 'DEHOR', status: 'LIBERO', isActive: true });
        }
        return tables;
    }

    set(newData) {
        if (!this.isLocalFallback) {
            this.dbRef.set(newData);
        } else {
            localStorage.setItem('restaurant_db', JSON.stringify(newData));
            if (this.localCallback) this.localCallback(newData);
        }
    }

    onDataChange(callback) {
        if (!this.isLocalFallback) {
            this.dbRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                }
            });
        } else {
            this.localCallback = callback;
            const data = localStorage.getItem('restaurant_db');
            if (data) {
                callback(JSON.parse(data));
            }
        }
    }
}

window.db = new RealtimeDB();
