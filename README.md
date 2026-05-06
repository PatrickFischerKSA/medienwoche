# Die vierte Gewalt | Interaktive Lerneinheit

Statische, GitHub-fähige Lerneinheit zum Dokumentarfilm **Die vierte Gewalt** von Dieter Fahrer.

## Inhalt

- eingebetteter SharePoint-Film mit Direktlink als Fallback
- 21 Fragen aus dem bereitgestellten PDF, in sechs Filmabschnitte gegliedert
- lokale Speicherung von Antworten im Browser
- Fortschrittsanzeige pro Abschnitt und für die gesamte Einheit
- Zeitmarkenfeld für Filmbeobachtungen
- Abschlussreflexion mit drei Leitfragen
- Export der Antworten als Textdatei

## Dateien

- `index.html` enthält die Seitenstruktur
- `styles.css` definiert das responsive Layout
- `data.js` enthält Film-Link, Abschnitte und Fragen
- `app.js` rendert Aufgaben, speichert Fortschritt und exportiert Notizen
- `.github/workflows/pages.yml` kann die Einheit über GitHub Pages veröffentlichen

## Nutzung

Die Einheit ist ohne Build-Schritt lauffähig. Lokal kann `index.html` direkt im Browser geöffnet werden. Für GitHub Pages genügt ein Repository mit diesen Dateien.

Der Film liegt nicht im Repository, sondern wird über den bereitgestellten SharePoint-Link eingebunden. Je nach Rechteverwaltung müssen Lernende beim Öffnen im Browser mit dem Schul-Account angemeldet sein.

## GitHub Pages

Nach dem Push auf `main` kann GitHub Pages über den enthaltenen Workflow deployed werden. In den Repository-Einstellungen muss GitHub Pages auf **GitHub Actions** gestellt sein.

## Materialgrundlage

Die Fragen stammen aus der bereitgestellten Datei `Fragen zum Film Die vierte Gewalt.pdf` und wurden didaktisch in Filmabschnitte, Hilfetexte und Reflexionsschritte übertragen.
