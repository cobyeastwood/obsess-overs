# Obsess Overs
### Description
Obsess Overs is a side project to help others better organize, sort, and manage favorite leftover home ingredients. I built this as a cool idea to work with leftover ingredients at home.

### Folder Structure
[ui](https://github.com/cobyeastwood/ObsessOvers/tree/main/ui) - frontend logic, with React components, pages, styles and hocs
[api](https://github.com/cobyeastwood/ObsessOvers/tree/main/api) - backend routes
[postgres](https://github.com/cobyeastwood/ObsessOvers/tree/main/postgres) - SQL tables
[types](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - Go structs, methods, and DB Drivers
[utility](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - SMS and JSON retrieval

### Overview
As a brief overview the project includes:

- React and Go routing
- Password hashing / login / logout
- File uploading / SMS
- SQL database querying and storing

I also added a cool ORC feature for allowing users to extract food items from uploaded receipts to add to a fridge allowing you to store all of your ingredients then selectively pick some to search recipes.

### Technologies
Frontend includes React, and Redux. Backend was built with Go libraries like gin-gonic, gosseract, and Redis/Postgres as a database.
