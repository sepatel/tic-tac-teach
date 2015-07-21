Tic-tac
=======
Tic-tac-toe game to help with education

DB Model
---
word = {
  _id: string,
  labels: [string]
}

profile = {
  _id: string,
  words: {
    <words._id>: {attempts: number, correct: number, partial: number, missed: number}
  }
}

game = {
  _id: objectId,
  players: {X: <profile._id>, O: <profile._id>},
  rules: {
    capture: 3,
    size: <3, 4, 5>,
    type: <word|math|other>
  },
  winner: <profile._id>,
  board: [
    [{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>}],
    [{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>}],
    [{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>},{word: <word._id>, owner: <X|O|null>}],
  ]
}

