INSERT INTO `destination` (`destination`, `description`, `image`) VALUES
('Zoo', 'Singapore Zoo - Best Zoo in South East Asia', NULL);

INSERT INTO `role` (`role`) VALUES
('admin'),
('gop'),
('user');

INSERT INTO `user` (`emp_id`, `email`, `name`, `username`, `phone_no`, `fine`) VALUES
('woonhao1999', 'woonhao1999@gmail.com', 'Ng Shen Jie', 'sjng12345', '99990000', 0.0),
('woonhao', 'woonhao@gmail.com', 'Ng Shen Jie', 'woonhao', '99990001', 0.0);


INSERT INTO `pass` (`pass_id`, `admission_details`, `destination`, `replacement_fee`, `status`) VALUES
('122', '1 employee and 3 accompanying guests', 'Marina Barrage', 1.5, 'active');

INSERT INTO `loan` (`loan_id`, `booking_date`, `borrower_id`, `collected`, `loan_date`, `pass_ids`, `returned`, `return_date`) VALUES
(2, '2022-11-19 00:00:00.000000', 'woonhao1999', b'1', '2022-11-23 00:00:00.000000', 0xaced0005737200136a6176612e7574696c2e41727261794c6973747881d21d99c7619d03000149000473697a6578700000000177040000000174000331323278, b'1', '2022-10-24'),
(3, '2022-10-24 00:00:00.000000', 'woonhao1999@gmail.com', b'1', '2021-10-29 00:00:00.000000', 0xaced0005737200136a6176612e7574696c2e41727261794c6973747881d21d99c7619d03000149000473697a6578700000000177040000000174000331323278, b'0', '2021-10-30');


INSERT INTO `password_hash` (`hash`, `emp_id`) VALUES
('$2a$10$B3dOaTfruKii0cpi.d/YD.TcFBrxrmqmxc4SPlbsYVxfanrAn7rlK', 'woonhao1999'),
('$2a$10$Z3FDbbzc1wWdjJ/wd/WlIuTMEPRhp8aWRXDDaFfFbsveDH9GiIZ0q', 'woonhao');


INSERT INTO `user_roles` (`user_emp_id`, `roles_role`) VALUES
('woonhao1999', 'user'),
('woonhao1999', 'gop'),
('woonhao1999', 'admin'),
('woonhao', 'user');

INSERT INTO `wait_list` (`wait_list_id`, `date`, `destination`, `email`) VALUES
(4, '2024-04-12', 'Zoo', 'woonhao1999@gmail.com'),
(7, '2022-04-12', 'Bird Park', 'woonhao1999@gmail.com'),
(8, '2022-04-12', 'Bird Park', 'woonhao1999@gmail.com');