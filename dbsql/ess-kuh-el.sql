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