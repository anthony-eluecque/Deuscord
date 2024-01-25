-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 18 fév. 2021 à 10:04
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `deuscord`
--

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creation_date` datetime NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT '0',
  `banned` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `pseudo`, `email`, `password`, `creation_date`, `picture`, `text`, `admin`, `banned`) VALUES
(26, 'lejoueur50', 'paradigm@laldo.com', '$2b$12$GXzVpwfvCa1HbN0j19Xq..nnxnNSF8X7VaoA5kvL.qQSIiQQ10ZyO', '2021-02-16 17:29:55', NULL, NULL, 0, 0);





--
-- Structure de la table `chanel`
--

DROP TABLE IF EXISTS `chanel`;
CREATE TABLE IF NOT EXISTS `chanel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` text,
  `owner` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `chanel_ban`
--

DROP TABLE IF EXISTS `chanel_ban`;
CREATE TABLE IF NOT EXISTS `chanel_ban` (
  `chanel` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  KEY `chanel` (`chanel`),
  KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `chanel_group`
--

DROP TABLE IF EXISTS `chanel_group`;
CREATE TABLE IF NOT EXISTS `chanel_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chanel` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT '#000001',
  `permission` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chanel` (`chanel`),
  KEY `permission` (`permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `chanel_permission`
--

DROP TABLE IF EXISTS `chanel_permission`;
CREATE TABLE IF NOT EXISTS `chanel_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chanel` int(11) NOT NULL,
  `see_messages` tinyint(1) DEFAULT NULL,
  `send_messages` tinyint(1) DEFAULT NULL,
  `send_media` tinyint(1) DEFAULT NULL,
  `delete_messages` tinyint(1) DEFAULT NULL,
  `pin_message` tinyint(1) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chanel` (`chanel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `friend`
--

DROP TABLE IF EXISTS `friend`;
CREATE TABLE IF NOT EXISTS `friend` (
  `friend1` int(11) NOT NULL,
  `friend2` int(11) NOT NULL,
  KEY `friend1` (`friend1`),
  KEY `friend2` (`friend2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `global_group`
--

DROP TABLE IF EXISTS `global_group`;
CREATE TABLE IF NOT EXISTS `global_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT '#000001',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `text` text,
  `chanel` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `chanel` (`chanel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `pinned_message`
--

DROP TABLE IF EXISTS `pinned_message`;
CREATE TABLE IF NOT EXISTS `pinned_message` (
  `message` int(11) NOT NULL,
  `chanel` int(11) NOT NULL,
  KEY `message` (`message`),
  KEY `chanel` (`chanel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------



-- --------------------------------------------------------

--
-- Structure de la table `user_chanel_group`
--

DROP TABLE IF EXISTS `user_chanel_group`;
CREATE TABLE IF NOT EXISTS `user_chanel_group` (
  `user` int(11) NOT NULL,
  `group` int(11) NOT NULL,
  KEY `user` (`user`),
  KEY `group` (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user_chanel_permissions`
--

DROP TABLE IF EXISTS `user_chanel_permissions`;
CREATE TABLE IF NOT EXISTS `user_chanel_permissions` (
  `user` int(11) NOT NULL,
  `permission` int(11) NOT NULL,
  KEY `user` (`user`),
  KEY `permission` (`permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user_global_group`
--

DROP TABLE IF EXISTS `user_global_group`;
CREATE TABLE IF NOT EXISTS `user_global_group` (
  `user` int(11) NOT NULL,
  `group` int(11) NOT NULL,
  KEY `user` (`user`),
  KEY `group` (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chanel`
--
ALTER TABLE `chanel`
  ADD CONSTRAINT `chanel_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `chanel_ban`
--
ALTER TABLE `chanel_ban`
  ADD CONSTRAINT `chanel_ban_ibfk_1` FOREIGN KEY (`chanel`) REFERENCES `chanel` (`id`),
  ADD CONSTRAINT `chanel_ban_ibfk_2` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `chanel_group`
--
ALTER TABLE `chanel_group`
  ADD CONSTRAINT `chanel_group_ibfk_1` FOREIGN KEY (`chanel`) REFERENCES `chanel` (`id`),
  ADD CONSTRAINT `chanel_group_ibfk_2` FOREIGN KEY (`permission`) REFERENCES `chanel_permission` (`id`);

--
-- Contraintes pour la table `chanel_permission`
--
ALTER TABLE `chanel_permission`
  ADD CONSTRAINT `chanel_permission_ibfk_1` FOREIGN KEY (`chanel`) REFERENCES `chanel` (`id`);

--
-- Contraintes pour la table `friend`
--
ALTER TABLE `friend`
  ADD CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`friend1`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `friend_ibfk_2` FOREIGN KEY (`friend2`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`chanel`) REFERENCES `chanel` (`id`);

--
-- Contraintes pour la table `pinned_message`
--
ALTER TABLE `pinned_message`
  ADD CONSTRAINT `pinned_message_ibfk_1` FOREIGN KEY (`message`) REFERENCES `message` (`id`),
  ADD CONSTRAINT `pinned_message_ibfk_2` FOREIGN KEY (`chanel`) REFERENCES `chanel` (`id`);

--
-- Contraintes pour la table `user_chanel_group`
--
ALTER TABLE `user_chanel_group`
  ADD CONSTRAINT `user_chanel_group_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_chanel_group_ibfk_2` FOREIGN KEY (`group`) REFERENCES `chanel_group` (`id`);

--
-- Contraintes pour la table `user_chanel_permissions`
--
ALTER TABLE `user_chanel_permissions`
  ADD CONSTRAINT `user_chanel_permissions_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_chanel_permissions_ibfk_2` FOREIGN KEY (`permission`) REFERENCES `chanel_permission` (`id`);

--
-- Contraintes pour la table `user_global_group`
--
ALTER TABLE `user_global_group`
  ADD CONSTRAINT `user_global_group_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_global_group_ibfk_2` FOREIGN KEY (`group`) REFERENCES `global_group` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
