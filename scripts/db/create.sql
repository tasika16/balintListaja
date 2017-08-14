CREATE TABLE simulators(
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_number VARCHAR(255) NOT NULL,
    price INT NOT NULL
);
