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
  `last_update` bigint(14) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash_id` (`hash_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

DROP TABLE IF EXISTS `high_scores`;
CREATE TABLE IF NOT EXISTS `high_scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mode` tinyint(6) NOT NULL,
  `player` varchar(50) CHARACTER SET utf8 NOT NULL,
  `score` int(11) NOT NULL,
  `timestamp` bigint(14) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

INSERT INTO `high_scores` (`id`, `mode`, `player`, `score`, `timestamp`) VALUES
(1, 0, 'Test player 1', 800, 13142641340000),
(2, 0, 'Test player 2', 700, 13142641340000),
(3, 0, 'Test player 3', 600, 13142641340000),
(4, 0, 'Test player 4', 500, 13142641340000),
(5, 0, 'Test player 5', 400, 13142641340000),
(6, 0, 'Test player 6', 300, 13142641340000),
(7, 0, 'Test player 7', 200, 13142641340000),
(8, 0, 'Test player 8', 1, 13142641340000),
(9, 1, 'Test player 1', 800, 13142641340000),
(10, 1, 'Test player 2', 700, 13142641340000),
(11, 1, 'Test player 3', 600, 13142641340000),
(12, 1, 'Test player 4', 500, 13142641340000),
(13, 1, 'Test player 5', 400, 13142641340000),
(14, 1, 'Test player 6', 300, 13142641340000),
(15, 1, 'Test player 7', 200, 13142641340000),
(16, 1, 'Test player 8', 100, 13142641340000),
(17, 2, 'Test player 1', 800, 13142641340000),
(18, 2, 'Test player 2', 700, 13142641340000),
(19, 2, 'Test player 3', 600, 13142641340000),
(20, 2, 'Test player 4', 500, 13142641340000),
(21, 2, 'Test player 5', 400, 13142641340000),
(22, 2, 'Test player 6', 300, 13142641340000),
(23, 2, 'Test player 7', 200, 13142641340000),
(24, 2, 'Test player 8', 100, 13142641340000),
(25, 3, 'Test player 1', 800, 13142641340000),
(26, 3, 'Test player 2', 700, 13142641340000),
(27, 3, 'Test player 3', 600, 13142641340000),
(28, 3, 'Test player 4', 500, 13142641340000),
(29, 3, 'Test player 5', 400, 13142641340000),
(30, 3, 'Test player 6', 300, 13142641340000),
(31, 3, 'Test player 7', 200, 13142641340000),
(32, 3, 'Test player 8', 100, 13142641340000),
(33, 4, 'Test player 1', 800, 13142641340000),
(34, 4, 'Test player 2', 700, 13142641340000),
(35, 4, 'Test player 3', 600, 13142641340000),
(36, 4, 'Test player 4', 500, 13142641340000),
(37, 4, 'Test player 5', 400, 13142641340000),
(38, 4, 'Test player 6', 300, 13142641340000),
(39, 4, 'Test player 7', 200, 13142641340000),
(40, 4, 'Test player 8', 100, 13142641340000),
(41, 6, 'Test player 1', 800, 13142641340000),
(42, 6, 'Test player 2', 700, 13142641340000),
(43, 6, 'Test player 3', 600, 13142641340000),
(44, 6, 'Test player 4', 500, 13142641340000),
(45, 6, 'Test player 5', 400, 13142641340000),
(46, 6, 'Test player 6', 300, 13142641340000),
(47, 6, 'Test player 7', 200, 13142641340000),
(48, 6, 'Test player 8', 100, 13142641340000),
(49, 7, 'Test player 1', 800, 13142641340000),
(50, 7, 'Test player 2', 700, 13142641340000),
(51, 7, 'Test player 3', 600, 13142641340000),
(52, 7, 'Test player 4', 500, 13142641340000),
(53, 7, 'Test player 5', 400, 13142641340000),
(54, 7, 'Test player 6', 300, 13142641340000),
(55, 7, 'Test player 7', 200, 13142641340000),
(56, 7, 'Test player 8', 100, 13142641340000),
(57, 8, 'Test player 1', 800, 13142641340000),
(58, 8, 'Test player 2', 700, 13142641340000),
(59, 8, 'Test player 3', 600, 13142641340000),
(60, 8, 'Test player 4', 500, 13142641340000),
(61, 8, 'Test player 5', 400, 13142641340000),
(62, 8, 'Test player 6', 300, 13142641340000),
(63, 8, 'Test player 7', 200, 13142641340000),
(64, 8, 'Test player 8', 100, 13142641340000);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
