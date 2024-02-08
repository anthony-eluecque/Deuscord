# Deuscord

*Une copie éclatée d'un célèbre logiciel de communication !*

## Installation

Afin de lancer ce logiciel, il est **fortement** recommandé d'utiliser `docker-compose`. Téléchargez les fichiers du projet, puis mettez-les dans un dossier dédié. Une fois le dossier prêt avec les fichiers de Deuscord, ouvrez un terminal dans le dossier puis lancez `docker-compose up --build`. Cela va construire l'image de Deuscord, et la lancer avec le serveur Redis et la base de données Mysql associés. Les tables de la BDD sont automatiquement créées au lencement.

Le serveur nodejs de Deuscord a besoin que le serveur Mysql soit prêt pour démarrer. Si vous voyez que Deuscord plante au démarrage, *ne paniquez pas*, et laissez la BDD finir son lancement.

## Fonctionnalités

Cette application permet à des utilisateurs d'envoyer des messages à d'autres utilisateurs, et ce, en temps réel via `socket.io`et `Redis`

Une interface de connexion et d'inscription est disponible
![Capture](https://user-images.githubusercontent.com/75009579/138721637-94fce2be-8a57-45b3-885c-c9703e9829c5.PNG)
![Capture7](https://user-images.githubusercontent.com/75009579/138721682-49609637-e150-4182-8846-02804a032c7f.PNG)

L'envoi des messages peut se faire dans des "channels", et leur récéption par les autres clients connectés est instantanée
![Capture2](https://user-images.githubusercontent.com/75009579/138722115-7b0e0913-eb7d-4ea3-9d92-04194996594c.PNG)

Une interface mobile a aussi été réalisée :

![Capture4](https://user-images.githubusercontent.com/75009579/138722294-9055be36-e5ad-4004-9bc9-6f5c8c941405.PNG)
![Capture5](https://user-images.githubusercontent.com/75009579/138722298-cc5ab28c-f587-4036-8ff1-2f5bcabd5cb3.PNG)

La gestion des channels se fait directement sur une page dédiée :
![Capture6](https://user-images.githubusercontent.com/75009579/138722727-4d45d371-ed3b-414a-8963-3fbe44121a29.PNG)

## Documentation

La documentation est disponible en format PDF à la racine du projet, dans le fichier nommé `documentation.pdf`

## TODO-List

Vous pouvez trouver le Trello [ici](https://trello.com/b/4jhfpepF/deuscord)

-----

Bon courage !
