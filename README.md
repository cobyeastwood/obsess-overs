# Obsess Overs

### Description

Obsess Overs is a side project to help others best <em>organize, sort, and manage favorite leftover home ingredients</em>. I built this as a cool idea to work with leftover ingredients at home.
<br/>

For testing you will need to upload two large Kaggle datasets <strong>RAW_recipes.csv</strong> and <strong>RAW_interactions.csv</strong> from [Food.com Recipes and Interactions](https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions) into Postgres.

### Preview - About Page

<br/>
<img width="1414" alt="obsessovers" src="https://user-images.githubusercontent.com/61709523/122663386-e552df80-d14e-11eb-8946-3026fd54ab90.png">
<br/>

### Preview - Pantry Page

<br/>
<img width="1411" alt="obsessoverslogin" src="https://user-images.githubusercontent.com/61709523/122663737-85116d00-d151-11eb-8958-6d12cc890696.png">
<br/>

### Folder Structure

- [api](https://github.com/cobyeastwood/ObsessOvers/tree/main/api) - Go routes
- [postgres](https://github.com/cobyeastwood/ObsessOvers/tree/main/postgres) - SQL tables
- [types](https://github.com/cobyeastwood/ObsessOvers/tree/main/types) - Go structs, methods and DB drivers / connectors
- [ui](https://github.com/cobyeastwood/ObsessOvers/tree/main/ui) - React, Redux, routing, hocs, components, pages and styles
- [utility](https://github.com/cobyeastwood/ObsessOvers/tree/main/utility) - SMS and JSON

<br/>

### Overview

As a brief overview, this project includes:

- React and Go routing
- Password hashing / login / logout
- File uploading / image processing / SMS
- Postgres and Redis drivers
- SQL queries, insertions and deletions

In addition, I added a cool ORC feature for allowing users to extract food items from uploaded receipts to their pantry to store new ingredients and manage their existing leftovers to pick the best-suited recipes.

In the future, I would like to add expiring date notifications and tags for food items as they are placed in the users' pantry. I also, want to allow users to upload new recipes both privately and publicly.

<br/>

### Technologies

Frontend includes React and Redux. Backend was built with Go libraries [gin-gonic](https://github.com/gin-gonic/gin), [gosseract](https://github.com/otiai10/gosseract) and Redis/Postgres as databases.

<br/>
