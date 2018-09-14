-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 11-11-2016 a las 16:02:01
-- Versión del servidor: 5.7.15
-- Versión de PHP: 5.5.9-1ubuntu4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `CaixaDB`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `cognom` text NOT NULL,
  `nom` text NOT NULL,
  `user_id` int(255) NOT NULL,
  `DNI` int(255) NOT NULL,
  `num_cuenta1` int(255) NOT NULL,
  `saldo1` int(255) NOT NULL,
  `num_cuenta2` int(255) NOT NULL,
  `saldo2` int(11) NOT NULL,
  `Password` text NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_id` (`user_id`),
  KEY `user_id_2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`cognom`, `nom`, `user_id`, `DNI`, `num_cuenta1`, `saldo1`, `num_cuenta2`, `saldo2`, `Password`) VALUES
('Armenter Hierro', 'Marc', 1, 47923996, 243558779, 0, 245558779, 0, '*00A51F3F48415C7D4E8908980D443C29C69B60C9'),
('Maynés', 'Gerard', 2, 12345678, 968443277, 0, 114409904, 0, '*F6F18558EC9D3E842A3B4D8478F7DE2427F3C4DF'),
('Tec', 'Elvis', 3, 12312323, 339565457, 0, 123439766, 0, '*1651469B2D424408C8D5660A6EFA691168449EEE'),
('de Calcuta', 'Mª Teresa', 4, 4578357, 843661221, 0, 546765098, 0, '*128768A31ED32B28C7C66B659BBCDA5E661480AB'),
('Mas', 'Sergi', 5, 12345679, 543534666, 0, 987876754, 0, '*166B2E276B0CD455FAA0C5E67990DE4B9B9178DE'),
('Estebanell', 'Arnau', 6, 47865538, 234567895, 0, 453543544, 0, '*6D0ECD4069E5AEE3F3842BBA717F1F938C5C2B28'),
('Puigpelat', 'Iciar', 7, 43557712, 907712235, 0, 42539687, 0, '*1EC2F178C418A3238172245BE1AC39BD0F9281DB'),
('Bastida', 'Judit', 8, 24567338, 959504099, 0, 545433949, 0, '*93436E0E2B1FFFF92671E7836919878A7EAB3707'),
('Tarres', 'Claudia', 9, 43221789, 324234234, 0, 987768874, 0, '*E58F12253ADB0EED79AC6229EA53F30E707F7182'),
('Nito del Bosque', 'Helena', 10, 47987215, 532123456, 0, 966547656, 0, '*6063C78456BB048BAF36BE1104D12D547834DFEA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factures`
--

CREATE TABLE IF NOT EXISTS `factures` (
  `id_f` int(255) DEFAULT NULL,
  `id_c` int(255) NOT NULL,
  `fecha` date NOT NULL,
  `nom_f` text NOT NULL,
  `movimiento` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `factures`
--

INSERT INTO `factures` (`id_f`, `id_c`, `fecha`, `nom_f`, `movimiento`) VALUES
(1, 3, '2016-10-01', 'orange', -200),
(2, 2, '2016-10-01', 'endesa', -250),
(3, 7, '2016-10-03', 'el corte inglés', -80),
(4, 1, '2016-10-03', 'telefónica', -300),
(5, 5, '2016-10-03', 'zara', -30),
(6, 8, '2016-10-04', 'unity', -15),
(7, 3, '2016-10-04', 'ingreso', 500),
(8, 6, '2016-10-05', 'apple', -1200),
(9, 8, '2016-10-06', 'airbnb', -800),
(10, 2, '2016-10-06', 'bershka', -30),
(11, 7, '2016-10-06', 'ingreso', 1500),
(12, 1, '2016-10-07', 'la tagliatela', -25),
(13, 8, '2016-10-07', 'mercadona', -100),
(14, 5, '2016-10-07', 'ingreso', 450),
(15, 4, '2016-10-07', 'opium', -120),
(16, 3, '2016-10-08', 'tmb', -11),
(17, 6, '2016-10-08', 'tmb', -15),
(18, 2, '2016-10-08', 'repsol', -50),
(19, 8, '2016-10-08', 'caprabo', -60),
(20, 1, '2016-10-08', 'bon area', -32),
(21, 1, '2015-10-01', 'orange', -150),
(22, 1, '2015-10-01', 'endesa', -300),
(23, 1, '2015-10-03', 'el corte inglés', -50),
(24, 1, '2015-10-03', 'telefónica', -150),
(25, 1, '2015-10-03', 'zara', -50),
(26, 1, '2015-10-04', 'unity', -15),
(27, 1, '2015-10-04', 'ingreso', 3000),
(28, 1, '2015-10-05', 'apple', -1500),
(29, 1, '2015-10-06', 'airbnb', -600),
(30, 2, '2015-10-06', 'bershka', -30),
(31, 2, '2015-10-06', 'ingreso', 1700),
(32, 2, '2015-10-07', 'la tagliatela', -25),
(33, 2, '2015-10-07', 'mercadona', -100),
(34, 2, '2015-10-07', 'ingreso', 450),
(35, 2, '2015-10-07', 'opium', -120),
(36, 2, '2015-10-08', 'tmb', -11),
(37, 1, '2015-10-08', 'tmb', -15),
(38, 2, '2015-10-08', 'repsol', -50),
(39, 2, '2015-10-08', 'caprabo', -60),
(40, 1, '2015-10-08', 'bon area', -32),
(41, 1, '2015-10-01', 'spotify', -15),
(41, 1, '2015-03-01', 'spotify', -15),
(42, 1, '2015-04-01', 'spotify', -15),
(43, 1, '2015-05-01', 'spotify', -15),
(44, 1, '2015-06-01', 'spotify', -15),
(45, 1, '2015-07-01', 'spotify', -15),
(46, 1, '2015-08-01', 'spotify', -15),
(47, 1, '2015-09-01', 'spotify', -15),
(48, 1, '2015-10-01', 'spotify', -15),
(49, 1, '2015-11-01', 'spotify', -15),
(50, 1, '2015-12-01', 'spotify', -15),
(51, 1, '2016-01-01', 'spotify', -15),
(52, 1, '2016-02-01', 'spotify', -15),
(53, 1, '2016-03-01', 'spotify', -15),
(54, 1, '2016-04-01', 'spotify', -15),
(55, 1, '2016-05-01', 'spotify', -15),
(56, 1, '2016-06-01', 'spotify', -15),
(57, 1, '2016-07-01', 'spotify', -15),
(58, 1, '2016-08-01', 'spotify', -15),
(59, 1, '2016-09-01', 'spotify', -15),
(60, 1, '2016-10-01', 'spotify', -15),
(61, 1, '2016-11-01', 'spotify', -15),
(62, 1, '2015-01-01', 'endesa', -80),
(63, 1, '2015-04-01', 'endesa', -150),
(64, 1, '2015-07-01', 'endesa', -95),
(65, 1, '2015-10-01', 'endesa', -80),
(66, 1, '2016-01-01', 'endesa', -110),
(67, 1, '2015-01-01', 'movistar', -85),
(68, 1, '2015-04-01', 'movistar', -50),
(69, 1, '2015-07-01', 'movistar', -65),
(70, 1, '2015-07-01', 'movistar', -50),
(71, 1, '2015-10-01', 'movistar', -50),
(72, 1, '2016-01-01', 'movistar', -75),
(73, 1, '2016-04-01', 'movistar', -100),
(74, 1, '2016-07-01', 'movistar', -50),
(75, 1, '2016-10-01', 'movistar', -45),
(76, 1, '2015-01-01', 'ingreso_salario', 2000),
(77, 1, '2015-02-01', 'ingreso_salario', 2000),
(78, 1, '2015-03-01', 'ingreso_salario', 2000),
(79, 1, '2015-04-01', 'ingreso_salario', 2000),
(80, 1, '2015-05-01', 'ingreso_salario', 2000),
(81, 1, '2015-06-01', 'ingreso_salario', 2000),
(82, 1, '2015-07-01', 'ingreso_salario', 2000),
(83, 1, '2015-08-01', 'ingreso_salario', 2000),
(84, 1, '2015-09-01', 'ingreso_salario', 2000),
(85, 1, '2015-10-01', 'ingreso_salario', 2000),
(86, 1, '2015-11-01', 'ingreso_salario', 2000),
(87, 1, '2015-12-01', 'ingreso_salario', 2000),
(88, 1, '2016-01-01', 'ingreso_salario', 2000),
(89, 1, '2016-02-01', 'ingreso_salario', 2000),
(90, 1, '2016-03-01', 'ingreso_salario', 2000),
(91, 1, '2016-04-01', 'ingreso_salario', 2000),
(92, 1, '2016-05-01', 'ingreso_salario', 2000),
(93, 1, '2016-06-01', 'ingreso_salario', 2000),
(94, 1, '2016-07-01', 'ingreso_salario', 2000),
(95, 1, '2016-08-01', 'ingreso_salario', 2000),
(96, 1, '2016-09-01', 'ingreso_salario', 2000),
(97, 1, '2016-10-01', 'ingreso_salario', 2000),
(98, 1, '2016-11-01', 'ingreso_salario', 2000),
(99, 1, '2016-12-01', 'ingreso_salario', 2000);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
