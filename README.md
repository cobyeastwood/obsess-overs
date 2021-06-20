# Obsess Overs

### Description
Obsess Overs is a side project to help others better organize, sort, and manage favorite leftover home ingredients. I built this as a cool idea to work with leftover ingredients at home. Works when you fully upload [Food.com Recipes and Interactions](https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions) a free Kaggle Dataset into Postgres.

### Preview
<br/>
<img width="1414" alt="obsessovers" src="https://user-images.githubusercontent.com/61709523/122663386-e552df80-d14e-11eb-8946-3026fd54ab90.png">
<br/>

### Folder Structure
[ui](https://github.com/cobyeastwood/ObsessOvers/tree/main/ui) - React redux, routing, hocs, components, pages, and styles
<br/>
[api](https://github.com/cobyeastwood/ObsessOvers/tree/main/api) - Go routes
<br/>
[postgres](https://github.com/cobyeastwood/ObsessOvers/tree/main/postgres) - SQL tables
<br/>
[types](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - Go structs, methods, and DB Drivers
<br/>
[utility](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - SMS and JSON retrieval

### Overview
As a brief overview the project includes:

- React and Go routing
- Password hashing / login / logout
- File uploading / SMS
- SQL database querying and storing

In addition, I added a cool ORC feature with [gosseract](https://github.com/otiai10/gosseract) for allowing users to extract food items from uploaded receipts to add to a fridge allowing you to store all of your ingredients then selectively pick some to search recipes.

### Technologies
Frontend includes React, and Redux. Backend was built with Go libraries gin-gonic, gosseract, and Redis/Postgres as a database.
