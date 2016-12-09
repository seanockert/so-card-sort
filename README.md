# SO Card Sort 
A tool for doing UX card sorting. Gives you Trello-like board where you can create new cards and drag/drop them into categories.

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
- Drag them around the board
- Double-click on the card's contents to edit it
- Add new categories or double-click on an existing one to edit it
- Remove a category by leaving it blank. Its cards will be moved to the 'All' column
- Create new board simply by going to its URL eg. /my-new-board. It will show up in the 'Boards' menu (not in demo)
- All changes are saved to localstorage.

## TODO

- Fix router in demo (LAMP server - redirect with htaccess instead of Vue router)
- Allow saving to Firebase database
- Improve browser compatibility (flexbox etc.)
- Squash them bugs
