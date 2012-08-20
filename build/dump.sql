SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash_id` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `last_update` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash_id` (`hash_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `high_scores`;
CREATE TABLE IF NOT EXISTS `high_scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mode` tinyint(6) NOT NULL,
  `player` varchar(50) CHARACTER SET utf8 NOT NULL,
  `score` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=73 ;

INSERT INTO `high_scores` (`id`, `mode`, `player`, `score`, `timestamp`) VALUES
(1, 0, 'Test player 1', 800, 1314264134),
(2, 0, 'Test player 2', 700, 1314264134),
(3, 0, 'Test player 3', 600, 1314264134),
(4, 0, 'Test player 4', 500, 1314264134),
(5, 0, 'Test player 5', 400, 1314264134),
(6, 0, 'Test player 6', 300, 1314264134),
(7, 0, 'Test player 7', 200, 1314264134),
(8, 0, 'Test player 8', 1, 1314264134),
(9, 1, 'Test player 1', 800, 1314264134),
(10, 1, 'Test player 2', 700, 1314264134),
(11, 1, 'Test player 3', 600, 1314264134),
(12, 1, 'Test player 4', 500, 1314264134),
(13, 1, 'Test player 5', 400, 1314264134),
(14, 1, 'Test player 6', 300, 1314264134),
(15, 1, 'Test player 7', 200, 1314264134),
(16, 1, 'Test player 8', 100, 1314264134),
(17, 2, 'Test player 1', 800, 1314264134),
(18, 2, 'Test player 2', 700, 1314264134),
(19, 2, 'Test player 3', 600, 1314264134),
(20, 2, 'Test player 4', 500, 1314264134),
(21, 2, 'Test player 5', 400, 1314264134),
(22, 2, 'Test player 6', 300, 1314264134),
(23, 2, 'Test player 7', 200, 1314264134),
(24, 2, 'Test player 8', 100, 1314264134),
(25, 3, 'Test player 1', 800, 1314264134),
(26, 3, 'Test player 2', 700, 1314264134),
(27, 3, 'Test player 3', 600, 1314264134),
(28, 3, 'Test player 4', 500, 1314264134),
(29, 3, 'Test player 5', 400, 1314264134),
(30, 3, 'Test player 6', 300, 1314264134),
(31, 3, 'Test player 7', 200, 1314264134),
(32, 3, 'Test player 8', 100, 1314264134),
(33, 4, 'Test player 1', 800, 1314264134),
(34, 4, 'Test player 2', 700, 1314264134),
(35, 4, 'Test player 3', 600, 1314264134),
(36, 4, 'Test player 4', 500, 1314264134),
(37, 4, 'Test player 5', 400, 1314264134),
(38, 4, 'Test player 6', 300, 1314264134),
(39, 4, 'Test player 7', 200, 1314264134),
(40, 4, 'Test player 8', 100, 1314264134),
(41, 6, 'Test player 1', 800, 1314264134),
(42, 6, 'Test player 2', 700, 1314264134),
(43, 6, 'Test player 3', 600, 1314264134),
(44, 6, 'Test player 4', 500, 1314264134),
(45, 6, 'Test player 5', 400, 1314264134),
(46, 6, 'Test player 6', 300, 1314264134),
(47, 6, 'Test player 7', 200, 1314264134),
(48, 6, 'Test player 8', 100, 1314264134),
(49, 7, 'Test player 1', 800, 1314264134),
(50, 7, 'Test player 2', 700, 1314264134),
(51, 7, 'Test player 3', 600, 1314264134),
(52, 7, 'Test player 4', 500, 1314264134),
(53, 7, 'Test player 5', 400, 1314264134),
(54, 7, 'Test player 6', 300, 1314264134),
(55, 7, 'Test player 7', 200, 1314264134),
(56, 7, 'Test player 8', 100, 1314264134),
(57, 8, 'Test player 1', 800, 1314264134),
(58, 8, 'Test player 2', 700, 1314264134),
(59, 8, 'Test player 3', 600, 1314264134),
(60, 8, 'Test player 4', 500, 1314264134),
(61, 8, 'Test player 5', 400, 1314264134),
(62, 8, 'Test player 6', 300, 1314264134),
(63, 8, 'Test player 7', 200, 1314264134),
(64, 8, 'Test player 8', 100, 1314264134);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
