-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Wrz 24, 2023 at 11:51 AM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurant`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `ingredients` text NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `price`, `ingredients`, `type`) VALUES
(1, ' Bruschetta', 22.50, 'Pieczone pomidory, czosnek, tymianek, pieczywo', 'Przystawka'),
(2, 'Focaccia', 15.24, 'Oliwa z oliwek, rozmaryn, sól morska', 'Przystawka'),
(3, 'Sałatka wiosenna', 23.00, 'Rukola, orzechy włoskie, gruszka, pomidorki cherry, parmezan', 'Przystawka'),
(8, 'Krewetki w sosie pomidorowym', 30.00, 'Krewetki (7.szt), pomidory z chorizo, czosnek', 'Przystawka'),
(10, 'Żurek w chlebie', 28.00, 'Żurek na domowym zakwasie, podawany z białą kiełbasą i jajkiem w świeżym pieczywie', 'Zupa'),
(11, 'Rosół', 22.00, 'Rosół podawany z ręcznie robionym makaronem, dużą ilością warzyw oraz mięsem z bulionu', 'Zupa'),
(12, 'Krem z pomidorów', 18.00, 'Krem ze świeżych pomidorów z dodatkiem czosnku i grzankami', 'Zupa'),
(13, 'Kotlet schabowy z kością', 44.00, 'Tradycyjny kotlet schabowy podawany z tłuczonymi ziemniakami z cebulką oraz sezonową surówką', 'Danie główne'),
(14, 'Filet z kurczaka', 40.00, 'Filet z kurczaka podawany z pieczonymi ziemniakami z rozmarynem i sałatką ze świeżych warzyw', 'Danie główne'),
(15, 'Gołąbek z kaszą gryczaną', 38.00, 'Podawany z plastrami karmelizowanego buraka i sosem grzybowym', 'Danie główne'),
(16, 'Stek z polędwicy wołowej', 120.00, 'Stek z polędwicy podawany w sosie pieprzowym,  podawany z pieczonymi ziemniakami i grillowanymi warzywami', 'Danie główne'),
(17, 'Zupa borowikowa', 24.00, 'Zupa z borowików podawana z kwaśną śmietaną i grzankami', 'Zupa'),
(18, 'Pieczona kaczka', 52.00, 'Kawałek pieczonej kaczki podawany z modrą kapustą i ziemniakami z sosem pieczeniowym', 'Danie główne'),
(19, 'Pierogi z mięsem', 30.00, 'Podsmażane pierogi (7 szt.) podawane z cebulką i okrasą', 'Danie główne'),
(20, 'Golonka Pieczona', 50.00, 'Golonka w sosie śliwkowym, podawana z zasmażaną kapustą i tłuczonymi ziemniakami', 'Danie główne'),
(21, 'Pieczone żeberka', 48.00, 'Żeberka w sosie śliwkowym, podawane z kopytkami i zasmażaną kapustą', 'Danie główne'),
(22, 'Rolada wołowa', 49.00, 'Rolada podawana z kaszą, sosem i zasmażanymi buraczkami', 'Danie główne'),
(23, 'Wątróbka drobiowa', 36.00, 'Wątróbka drobiowa z jabłkiem, cebulą i ogórkiem podawana z tłuczonymi ziemniakami', 'Danie główne');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `register`
--

CREATE TABLE `register` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1, 'admin@example.com', '1234', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `guests` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'NIEPOTWIERDZONE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `name`, `surname`, `guests`, `email`, `phone`, `date`, `time`, `status`) VALUES
(1, 'Jan', 'Nowak', 3, 'example@gmail.com', '123456789', '2023-09-24', '11:30', 'POTWIERDZONA'),
(2, 'Marek', 'Tuchel', 3, 'testowymail@wp.pl', '123456789', '2023-09-22', '10:30', 'POTWIERDZONA'),
(3, 'Darek', 'Nowak', 3, 'darek23@gmail.com', '987654321', '2023-09-22', '12:00', 'POTWIERDZONA'),
(4, 'Radosław', 'Nowaczyk', 3, 'radek1235@gmail.com', '605423712', '2023-09-29', '14:30', 'POTWIERDZONA'),
(5, 'Jurek', 'Kowalski', 3, 'kowalskijerzy@wp.com', '123456789', '2023-09-29', '16:30', 'NIEPOTWIERDZONE'),
(6, 'Mikołaj Zachaś', 'Zachaś', 4, 'mikolaj26032000@gmail.com', '605423981', '2023-09-23', '14:00', 'POTWIERDZONA'),
(8, 'Mikołaj Zachaś', 'Zachaś', 5, 'mikolaj26032000@gmail.com', '123456789123', '2023-09-24', '19:30', 'NIEPOTWIERDZONE');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
