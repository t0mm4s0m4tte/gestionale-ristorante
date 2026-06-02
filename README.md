# RestaurantApp 🍽️

RestaurantApp è un'applicazione Android moderna progettata per semplificare e ottimizzare la gestione di un ristorante. Sviluppata in Kotlin utilizzando Jetpack Compose, l'app offre un'interfaccia utente fluida e reattiva per il personale di sala, i gestori e gli amministratori.

## ✨ Funzionalità Principali

- **Gestione Assegnazione Tavoli**: Visualizza e gestisci le assegnazioni dei tavoli. Il sistema distingue intelligentemente tra i servizi di pranzo e cena, consentendo una pianificazione precisa per ogni turno.
- **Sistema di Prenotazione (Reservation)**: Registra le prenotazioni dei clienti, assegna i tavoli in anticipo e tieni traccia delle disponibilità per data e per servizio (pranzo/cena).
- **Gestione Ordini (Order)**: Inserisci e gestisci le comande direttamente dai tavoli, migliorando la velocità del servizio e riducendo gli errori.
- **Dashboard Intuitiva**: Una visione d'insieme dello stato del ristorante in tempo reale.
- **Pannello di Amministrazione (Admin)**: Area riservata per la configurazione del ristorante, la gestione del menu e delle impostazioni generali.
- **Sincronizzazione in Tempo Reale**: Grazie all'integrazione con Firebase Realtime Database, tutti i dispositivi del personale sono sempre aggiornati in tempo reale.
- **Supporto Offline**: Utilizzo di Room Database per garantire che l'app continui a funzionare e mantenere i dati accessibili anche in caso di problemi di connettività.

## 🛠️ Stack Tecnologico

Il progetto è costruito seguendo le best practice dello sviluppo Android moderno e un'architettura **MVVM** (Model-View-ViewModel):

- **Linguaggio**: [Kotlin](https://kotlinlang.org/)
- **UI Toolkit**: [Jetpack Compose](https://developer.android.com/jetpack/compose) con Material 3 per un design moderno e reattivo.
- **Navigazione**: Compose Navigation.
- **Database Locale**: [Room](https://developer.android.com/training/data-storage/room) per la persistenza dei dati offline e la cache.
- **Backend / Cloud**: [Firebase Realtime Database](https://firebase.google.com/docs/database) per la sincronizzazione dei dati in tempo reale.
- **Asincronia**: Kotlin Coroutines & Flow.

## 📁 Struttura del Progetto

Il codice sorgente principale si trova sotto `app/src/main/java/com/example/restaurantapp/` ed è suddiviso nei seguenti package:

- `ui/screens`: Contiene le schermate principali (Dashboard, Order, Reservation, Admin) sviluppate interamente in Compose.
- `ui/viewmodel`: I ViewModel che gestiscono la logica di business e preparano i dati per la UI.
- `repository`: Pattern Repository per astrarre le fonti di dati (Room e Firebase) e fornire una singola fonte di verità ai ViewModel.
- `data`: Entity di Room, DAO (Data Access Object) e configurazione del database locale.
- `theme`: Configurazione dei colori, tipografia e forme (Material 3) per l'intera app.

## 🚀 Requisiti e Installazione

1. **Prerequisiti**:
   - [Android Studio](https://developer.android.com/studio) (versione compatibile con l'ultimo plugin Gradle).
   - JDK 17.

2. **Clona il repository**:
   ```bash
   git clone <URL_DEL_REPO>
   ```

3. **Configurazione Firebase**:
   - Assicurati di avere il file `google-services.json` (fornito dal progetto Firebase) all'interno della cartella `app/`.
   - Il progetto Firebase deve avere il Realtime Database abilitato.

4. **Compilazione ed Esecuzione**:
   - Apri il progetto in Android Studio.
   - Attendi il completamento del Gradle Sync.
   - Avvia l'app su un emulatore (API livello 24 o superiore) o su un dispositivo fisico.

## 📝 Licenza

[Inserire qui il tipo di licenza, es. MIT License]
