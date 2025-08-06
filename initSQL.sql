
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS CATEGORY(
id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
name varchar(100) NOT NULL,
url text NOT NULL,
slug TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ARTICLE(
id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
categoryId uuid REFERENCES CATEGORY(id),
date timestamp,
title varchar(100),
author varchar(100),
thumbnail text,
sapo text,
img text,
photoCaption text,
url text,
content text[]
);




