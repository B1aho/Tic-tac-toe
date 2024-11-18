// Game field with the grid of cells. Object represent all logic about manipulations on the field and private field
import { Cell } from "./gameCell";

export const defaultSymbol = '*'

export const createField = (size) => {
    const field = []

    for (let i = 0; i <= size; i++) {
        field[i] = []
        for (let j = 0; j <= size; j++) {
            field[i].push(Cell())
        }
    }
}

export const resetField = (field) => {
    field.forEach(el => el.forEach(cell => cell.setValue(defaultSymbol)))
}
