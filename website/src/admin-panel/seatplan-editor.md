# Seat plan editor
The seat plan editor is a graphical editor where you can create and modify the seat plan of virtually any room. We recommend that you start in the top left corner of the seat plan and then move down diagonally, as it is the easiest to do. Each so-called component can be either a stand area, a stage area or a seating area, with each of them featuring different layouts. You can change everything in the properties-panel.

## Adding more components
You may add more components by simply clicking the plus icon in the toolbar of the editor. The component will spawn in the top left corner of the seat plan and the view will automatically be moved towards it. 

## Removing components
You may remove components by clicking the trash icon or by hitting 'delete' on your keyboard.

## Editing history
The editor features undo and redo functions such that you can undo your mistakes and accidental undo can be reverted. Just hit the corresponding button in the toolbar or use the keyboard shortcuts Ctrl + Z for Undo and Ctrl + Y for Redo.

## Component number property
This property can be used to tell the system in which order to number seats in. You can start at one for every time the numbering should start at 1 again. Just keep in mind that for optimal results, you should use a different sector whenever setting the component number to 1 again as otherwise there might be two seats 1 in a sector which can lead to confusion for the customer.

**Example:**
You've got a seat plan which has 4 seat components. These 4 components are grouped into two different sectors. Now, for the component where the seat numbering should start for each sector, set the component number property to 1. This will tell the system to start numbering the seats from this component. You may also choose the numbering direction with the option right below called 'Numbering direction'.

## Saving
The editor does auto-save a draft every minute. Pressing Ctrl + S or hitting the Save button in the toolbar will immediately save the seat plan as a draft. Click the "deploy" button to save the seat plan permanently, irreversibly overwriting any potentially existing old seat plan of that location, except you change the location name after the fact. 