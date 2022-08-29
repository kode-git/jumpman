# Jumpman
<p>
        <img src="https://img.shields.io/static/v1?label=build&message=passing&color=%3CCOLOR%3E" alt="alternatetext">
	<img src="https://img.shields.io/badge/state-closed-red" alt="alternatetext">
	<img src="https://img.shields.io/badge/version-1.0%20-blue" alt="alternatetext">
  <img src="https://img.shields.io/badge/WebGL-1.0-yellow" alt="alternatetext">
</p>
Il gioco ha come base logica quello di Fall Guy che, nel 2021, ha riscosso un gran
                            successo anche su piattaforme di streaming come Twitch o Youtube. Il progetto
                            consisterà nella sperimentazione delle tecniche di computer graphics applicate in un
                            contesto WebGL, andando a definire un modello poligonale tridimensionale che
                            rappresenta il "Jump Man" in grado di muoversi e navigare con i comandi da tastiera
                            (o con le dita per poter adattarlo ai dispositivi mobile).

## Documentazione
La documentazione del progetto è disponibile all'interno della pagina index.html. 

## Composizione del Progetto
Questa tabella specifica il contenuto del codice definito dentro la cartella <i>src</i>. La grafica CSS è disponibile esternamente andando nella cartella [style](https://github.com/kode-git/Jumpman/tree/main/style) nella directory corrente.

| Directory | Description |
|-|-|
| [assets](https://github.com/kode-git/Jumpman/tree/main/src/assets) | Immagini, video, gif e sfondi utilizzati nel gioco. Non vi sono componenti legate al contesto WebGL. |
| [models](https://github.com/kode-git/Jumpman/tree/main/src/models) | Contiene le texture, i file MTL e wavefront OBJ delle componenti del gioco caricate nel contesto WebGL. |
| [resources](https://github.com/kode-git/Jumpman/tree/main/src/resources) | Definisce le librerie WebGL utilizzate per l'implementazione delle funzionalità grafiche |
| [scripts](https://github.com/kode-git/Jumpman/tree/main/src/script) | Definisce gli script per la definizione geometriche delle componenti, i controlli dell'interfaccia, mouse e tasti, implementazione delle scene e funzioni matematiche di utilità per la gestione geometrica e temporale (FPS) del gioco. |

## Come Eseguire
Per poter eseguire il gioco localmente, è consigliato scaricarsi l'estensione "Live Server" su Visual Studio Code e, una volta riavviato l'editor, cliccare con il tasto destro sullo script game.html o index.html e selezionare tra le opzioni "Apri con Live Server".

## Licenza
MIT License
Copyright (c) 2022 Mario Sessa
