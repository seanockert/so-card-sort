# SO Card Sort 
A tool for doing UX card sorting. Create Trello-like boards, then add cards and drag/drop them into categories. 

App written in Vue.js and the entire thing loads in less than 60KB (when gzipped).

## Demo
http://so-card-sort.surge.sh

## Installation
Install the dependencies:
``` js
 npm install
```
Then run the dev server:
``` js
 npm run dev
```

## Usage
- Type in some content and press enter to add a new card to the board
- Drag the cards around the board to different categories
- Double-click on the card's contents to edit it
- Add new categories or double-click on an existing one to edit it
- Remove a category by leaving it blank. Its cards will be moved to the 'All' column
- Create new board simply by adding whatever you want it to be called to the URL eg. [/some-cool-board](http://so-card-sort.surge.sh/some-cool-board). 'Some Cool Board' will then show up in the Boards dropdown menu
- Double-click on a board name to edit it. Remove a board by leaving the board name blank
- All changes are saved to localstorage

## TODO

- Allow saving to Firebase database
- Improve browser compatibility (flexbox etc.)
- Squash them bugs
