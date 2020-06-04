use cashare;
drop database cashare;
create database cashare;
show tables from cashare;

select * from user_table;
select * from category_table;
select * from goal_table;
select * from group_table;
select * from message_table;
select * from transaction_table;
select * from user_category_table;
select * from user_group_table;
select * from user_table;
select * from alert_table;

Update user_group_table SET user_role = 3 WHERE user_id = 1 AND group_id = 2;

insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 1, '2020-05-03 10:23:23', 'success','this is a success', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 1, '2020-05-03 10:23:57', 'primary', 'this is a primary', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 1, '2020-05-03 10:25:23', 'success', 'this should not be visible', 1);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 1, '2020-05-03 10:28:23', 'warning', 'this is a warning', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 1, '2020-05-03 10:28:23', 'danger', 'this is a danger', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 2, '2020-05-03 10:28:23', 'warning', 'this is a warning', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (1, 2, '2020-05-03 10:28:23', 'success', 'this shoudl not be visible', 1);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (2, 1, '2020-05-03 10:28:23', 'warning', 'this is a warning', 0);
insert into alert_table (user_id, group_id, timestamp, alert_class, alert_msg, status) VALUES (2, 3, '2020-05-03 10:28:23', 'warning', 'this is a warning', 1);
drop table alert_table;

insert into user_group_table (user_id, group_id, user_role) VALUES (4, 1, 2);