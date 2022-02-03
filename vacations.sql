-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2021 at 03:27 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--
CREATE DATABASE IF NOT EXISTS `vacations` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `vacations`;

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `destinationId` int(11) NOT NULL,
  `destinationName` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`destinationId`, `destinationName`) VALUES
(16, 'Bangkok'),
(11, 'Chicago'),
(4, 'Eilat'),
(3, 'Haifa'),
(1, 'Jerusalem'),
(6, 'Las Vegas'),
(5, 'Los Angeles'),
(17, 'Madrid'),
(15, 'Mexico City'),
(10, 'Miami'),
(14, 'Milano'),
(9, 'New York'),
(12, 'Rome'),
(7, 'San Diego'),
(8, 'San Francisco'),
(2, 'Tel Aviv');

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`userId`, `vacationId`) VALUES
(42, 111),
(42, 109),
(2, 102),
(2, 109),
(2, 111),
(3, 102),
(3, 105),
(3, 103),
(43, 108),
(43, 102);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `permission` varchar(5) NOT NULL DEFAULT 'user',
  `fName` varchar(25) NOT NULL,
  `lName` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userName`, `password`, `permission`, `fName`, `lName`) VALUES
(1, 'admin', 'admin', 'admin', 'Admin', 'Admin'),
(2, 'user1', '1111', 'user', 'user1', 'user1'),
(3, 'user2', '1234', 'user', 'user2 fname', 'user2 lname'),
(42, 'user#3', '33333', 'user', 'user numbr 3 name', 'user number 3 last name'),
(43, 'mosh', '0000', 'user', 'Moshiko', 'Levi');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `destinationId` int(11) NOT NULL,
  `image` varchar(30) NOT NULL,
  `dateStart` date NOT NULL,
  `dateEnd` date NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `followers` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `description`, `destinationId`, `image`, `dateStart`, `dateEnd`, `price`, `followers`) VALUES
(99, 'Explore Las Vegas!', 6, 'vacation.jpg', '2021-10-03', '2021-10-30', '4500', 0),
(102, 'Spend the Jewish holidays in the holy city of Jerusalem!', 1, 'jerusalem.jpg', '2021-09-04', '2021-09-25', '2855', 3),
(103, 'Scuba diving in the red sea!', 4, 'vacation.jpg', '2021-12-05', '2021-12-09', '111', 1),
(104, 'Go travel and explore Rome. Travel all around the city and see all the nice places Rome has to offer!', 12, 'grass.jpg', '2021-10-09', '2021-10-13', '999', 0),
(105, 'Mexico City', 15, 'vacation.jpg', '2021-09-08', '2021-09-15', '7000', 1),
(108, 'Visit Haifa, Israel', 3, 'vacation.jpg', '2021-09-01', '2021-09-08', '1200', 1),
(109, 'Visit Madrid for an unforgettable vacation! Get a free ticket to the Real Madrid game, a tour in the stadium and meet the players', 17, 'grass.jpg', '2021-09-07', '2021-09-08', '1799', 2),
(110, 'A week in Miami beach!', 10, 'batumi.png', '2021-10-02', '2021-10-08', '5555', 0),
(111, 'Vacation in Bangkok', 16, 'brazil.jpg', '2021-08-30', '2021-09-17', '1250', 2),
(114, 'Visit the Sea World in Sad Diego, California!', 7, 'batumi.png', '2021-09-26', '2021-10-17', '5000', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`destinationId`),
  ADD UNIQUE KEY `destinationName` (`destinationName`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`),
  ADD KEY `destination` (`destinationId`),
  ADD KEY `destinationId` (`destinationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `destinationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vacations`
--
ALTER TABLE `vacations`
  ADD CONSTRAINT `vacations_ibfk_1` FOREIGN KEY (`destinationId`) REFERENCES `destinations` (`destinationId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
