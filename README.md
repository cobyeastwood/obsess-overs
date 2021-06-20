# Obsess Overs

### Description
Obsess Overs is a side project to help others best <em>organize, sort, and manage favorite leftover home ingredients</em>. I built this as a cool idea to work with leftover ingredients at home. <br/> <br/>For testing you will need to upload two large Kaggle datasets <strong>RAW_recipes.csv</strong> and <strong>RAW_interactions.csv</strong> from [Food.com Recipes and Interactions](https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions) into Postgres.

### Preview - About

<br/>
<img width="1414" alt="obsessovers" src="https://user-images.githubusercontent.com/61709523/122663386-e552df80-d14e-11eb-8946-3026fd54ab90.png">
<br/>

### Preview - Pantry

<br/>
<img width="1411" alt="obsessoverslogin" src="https://user-images.githubusercontent.com/61709523/122663737-85116d00-d151-11eb-8958-6d12cc890696.png">
<br/>

### Folder Structure
* [api](https://github.com/cobyeastwood/ObsessOvers/tree/main/api) - Go routes
* [postgres](https://github.com/cobyeastwood/ObsessOvers/tree/main/postgres) - SQL tables
* [types](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - Go structs, methods and DB drivers/connectors
* [ui](https://github.com/cobyeastwood/ObsessOvers/tree/main/ui) - React redux, routing, hocs, components, pages and styles
* [utility](https://github.com/cobyeastwood/ObsessOvers/tree/main/utility) - SMS and JSON

### Overview
As a brief overview, this project includes:

- React and Go routing
- Password hashing / login / logout
- File uploading / image processing / SMS
- SQL database querying and storing

In addition, I added a cool ORC feature for allowing users to extract food items from uploaded receipts to add to a pantry allowing you to store all of your ingredients then selectively pick some to search recipes.

### Technologies
Frontend includes React, and Redux. Backend was built with Go libraries [gin-gonic](https://github.com/gin-gonic/gin), [gosseract](https://github.com/otiai10/gosseract), and Redis/Postgres as a database.
