CREATE TABLE user_pantry (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  user_id BIGSERIAL NOT NULL, 
  ingredient_name VARCHAR(255) NOT NULL,
  quantity INT,
  cost INT
)