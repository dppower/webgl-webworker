import {GameObject} from "./game-object";

export class GameState {

    private gameObjects_: GameObject[] = [];

    addNewObject(object: GameObject) {
        this.gameObjects_.push(object);
    };

    removeObject(index: number) {
    };

    updateObjects(dt: number) {
        let nextState = new GameState();

        for (let i in this.gameObjects_) {
            let updatedObject = this.gameObjects_[i].update(dt);
            nextState.addNewObject(updatedObject);
        };

        return nextState;
    };
}