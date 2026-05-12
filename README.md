# Medienwoche: Filme, Fake News und Videoreportage | Interaktive Lerneinheit

Statische, GitHub-fähige Lerneinheit zu **Die vierte Gewalt**, **Tausend Zeilen**, Fake News, journalistischer Medienkritik und einer eigenen kurzen Videoreportage.

## Inhalt

- zwei Filmzugänge über den SharePoint-/Mediaserver-Login
- drei YouTube-Videos als Einstieg in die ganze Einheit
- standardmäßig geöffnete Inspirationsfilme zu Schulalltag, Schulklima, Digitalisierung, Schulporträt und Pandemie-Erfahrung
- standardmäßig geöffneter Ressourcenbereich mit Fake-News-Materialien, SRF/RTS, News-on-Video, e-teaching.org, Uni Halle, Dokumentarfilm-PDF, Großprojekt «Die perfekte Schule» und eingebetteten Rainer-Wolf-Lernfilmen
- 21 Fragen zu **Die vierte Gewalt**, in sechs Filmabschnitte gegliedert
- 11 Fragen zu **Tausend Zeilen**, in drei Filmabschnitte gegliedert
- eigenständige Selbstlerneinheit für eine eigene Videoreportage von ca. 5 Minuten mit Wissensankern, Reflexionsstationen und Feedback-Checklisten
- eingebettetes SRF-Impact-Beispielvideo und fokussierte Tutorials zu Smartphone-Filmen, Interview, Storytelling und Bildgestaltung
- lokale Speicherung von Antworten im Browser
- Fortschrittsanzeige pro Abschnitt und für die gesamte Einheit
- Zeitmarkenfeld für Filmbeobachtungen
- Abschlussreflexion mit drei Leitfragen
- Export der Antworten als Textdatei

## Dateien

- `index.html` enthält die Seitenstruktur
- `styles.css` definiert das responsive Layout
- `data.js` enthält Film-Links, Einstiegsclips, Ressourcen, Abschnitte, Wissensanker und Aufgaben
- `app.js` rendert Aufgaben, speichert Fortschritt und exportiert Notizen
- `assets/images/tagesschau_trailer.gif` ist der animierte Hintergrund
- `assets/docs/dokumentarfilm-im-unterricht-modul-3.pdf` ist die lokal eingebundene Projektressource
- `assets/docs/Dokumentarfilm-im-Unterricht.pdf` ist das zusätzliche Methodenheft für dokumentarisches Arbeiten
- `assets/docs/Videoreportage_Schule_im_Fokus.docx` ist der Originalauftrag zur Videoreportage

## Nutzung

Die Einheit ist ohne Build-Schritt lauffähig. Lokal kann `index.html` direkt im Browser geöffnet werden. Für GitHub Pages genügt ein Repository mit diesen Dateien.

Die Filme liegen nicht im Repository, sondern werden über die bereitgestellten SharePoint-/Mediaserver-Links geöffnet. Je nach Rechteverwaltung müssen Lernende beim Öffnen im Browser mit dem Schul-Account angemeldet sein.

## GitHub Pages

Nach dem Push auf `main` kann GitHub Pages direkt aus dem Branch veröffentlicht werden. In den Repository-Einstellungen genügt **Deploy from a branch**, Branch `main`, Ordner `/root`.

## Materialgrundlage

Die Fragen stammen aus den bereitgestellten Dateien `Fragen zum Film Die vierte Gewalt.pdf` und `Fragen zum Film «Tausend Zeilen».docx`. Die Praxiseinheit stützt sich zusätzlich auf `Dokumentarfilm-im-Unterricht_Modul-3_Wie-ein-Dokumentarfilm-entsteht.pdf` sowie die verlinkten Produktions- und Storytelling-Ressourcen.
