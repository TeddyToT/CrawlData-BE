create table CATEGORY(
id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
name varchar(100) NOT NULL,
url text NOT NULL,


)

create table ARTICLE(
id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
categoryId uuid REFERENCES CATEGORY(id),
date timestamp,
title varchar(100),
author varchar(100),
sapo text,
img text,
photoCaption text,
content text[]

)
