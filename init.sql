create table CATEGORY(
id uuid NOT NULL DEFAULT gen_random_uuid(),
name varchar(100) not null,
url text,
CONSTRAINT pkey_category PRIMARY KEY (id)

)

create table ARTICLE(
id uuid NOT NULL DEFAULT gen_random_uuid(),
categoryId uuid REFERENCES CATEGORY(id),
date timestamp,
title varchar(100),
author varchar(100),
sapo text,
img text,
photoCaption text,
content text[]

)

drop table category

delete from category


Insert into category(name) VALUES('test') returning *
select * from category