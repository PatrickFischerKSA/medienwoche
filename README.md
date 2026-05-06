# Journalismus, Fake News und Medienkritik | Interaktive Lerneinheit

Statische, GitHub-fähige Lerneinheit zu **Die vierte Gewalt**, **Tausend Zeilen**, Fake News, journalistischer Medienkritik und einer eigenen kurzen Videoreportage.

## Inhalt

- zwei Filmzugänge über den SharePoint-/Mediaserver-Login
- drei YouTube-Videos als Einstieg in die ganze Einheit
- SRF-School-Link und `teilenoderloeschen.ch` als Ressourcenbereich
- 21 Fragen zu **Die vierte Gewalt**, in sechs Filmabschnitte gegliedert
- 11 Fragen zu **Tausend Zeilen**, in drei Filmabschnitte gegliedert
- Selbstlerneinheit für eine eigene Videoreportage von ca. 5 Minuten
- lokale Speicherung von Antworten im Browser
- Fortschrittsanzeige pro Abschnitt und für die gesamte Einheit
- Zeitmarkenfeld für Filmbeobachtungen
- Abschlussreflexion mit drei Leitfragen
- Export der Antworten als Textdatei

## Dateien

- `index.html` enthält die Seitenstruktur
- `styles.css` definiert das responsive Layout
- `data.js` enthält Film-Links, Einstiegsclips, Ressourcen, Abschnitte und Fragen
- `app.js` rendert Aufgaben, speichert Fortschritt und exportiert Notizen
- `.github/workflows/pages.yml` kann die Einheit über GitHub Pages veröffentlichen

## Nutzung

Die Einheit ist ohne Build-Schritt lauffähig. Lokal kann `index.html` direkt im Browser geöffnet werden. Für GitHub Pages genügt ein Repository mit diesen Dateien.

Die Filme liegen nicht im Repository, sondern werden über die bereitgestellten SharePoint-/Mediaserver-Links geöffnet. Je nach Rechteverwaltung müssen Lernende beim Öffnen im Browser mit dem Schul-Account angemeldet sein.

## GitHub Pages

Nach dem Push auf `main` kann GitHub Pages über den enthaltenen Workflow deployed werden. In den Repository-Einstellungen muss GitHub Pages auf **GitHub Actions** gestellt sein.

## Materialgrundlage

Die Fragen stammen aus den bereitgestellten Dateien `Fragen zum Film Die vierte Gewalt.pdf` und `Fragen zum Film «Tausend Zeilen».docx` und wurden didaktisch in Filmabschnitte, Hilfetexte und Reflexionsschritte übertragen.
