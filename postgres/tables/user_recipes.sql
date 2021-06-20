CREATE TABLE user_recipes (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  food_name VARCHAR(50) NOT NULL,
  cost INT,
  quantity INT
);
