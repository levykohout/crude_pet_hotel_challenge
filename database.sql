--create owner table
CREATE TABLE owner (id SERIAL PRIMARY KEY, first_name varchar(80) NOT NULL, last_name varchar(80) NOT NULL);

CREATE TABLE pet (id SERIAL PRIMARY KEY, name varchar(80) NOT NULL, breed varchar(80) NOT NULL, color varchar(80) NOT NULL);

CREATE TABLE owner_pets (owner_id INT REFERENCES owner, pet_id INT REFERENCES pet, PRIMARY KEY(owner_id,pet_id));


SELECT visits.id, pet_id, pet.name, pet.breed, pet.color,pet.owner_id,owner.first_name,owner.last_name FROM visits JOIN pet ON visits.pet_id=pet.id LEFT JOIN owner ON pet.owner_id=owner.id
