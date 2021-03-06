module.exports = {
  mongo: 'mongodb://silverwind/tictac',
  version: new Date(),
  sightWords: {
    letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
      'V', 'W', 'X', 'Y', 'Z' ],
    cvc: ['at', 'bat', 'cat', 'fat', 'hat', 'mat', 'nat', 'pat', 'rat', 'sat', 'cap', 'gap', 'hap', 'lap', 'map', 'nap',
      'pap', 'rap', 'sap', 'tap', 'yap', 'zap', 'bog', 'cog', 'dog', 'fog', 'hog', 'jog', 'log', 'bam', 'dam', 'ham',
      'jam', 'mam', 'ram', 'sam', 'yam', 'ban', 'can', 'dan', 'fan', 'man', 'pan', 'ran', 'tan', 'van'],
    cvc2: [ 'bar', 'star', 'car', 'far', 'jar', 'par', 'tar'],
    dolch1: ['and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'in',
      'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see',
      'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'],
    dolch2: ['all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came', 'did', 'do', 'eat', 'four', 'get',
      'good', 'have', 'he', 'into', 'like', 'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran',
      'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this', 'too', 'under', 'want', 'was', 'well',
      'went', 'what', 'white', 'who', 'will', 'with', 'yes'],
    dolch3: ['after', 'again', 'an', 'any', 'as', 'ask', 'by', 'could', 'every', 'fly', 'from', 'give', 'going', 'had',
      'has', 'her', 'him', 'how', 'just', 'know', 'let', 'live', 'may', 'of', 'old', 'once', 'open', 'over', 'put',
      'round', 'some', 'stop', 'take', 'thank', 'them', 'then', 'think', 'walk', 'where', 'when'],
    dolch4: ['always', 'around', 'because', 'been', 'before', 'best', 'both', 'buy', 'call', 'cold', 'does', "don't",
      'fast', 'first', 'five', 'found', 'gave', 'goes', 'green', 'its', 'made', 'many', 'off', 'or', 'pull', 'read',
      'right', 'sing', 'sit', 'sleep', 'tell', 'their', 'these', 'those', 'upon', 'us', 'use', 'very', 'wash', 'which',
      'why', 'wish', 'work', 'would', 'write', 'your'],
    dolch5: ['about', 'better', 'bring', 'carry', 'clean', 'cut', 'done', 'draw', 'drink', 'eight', 'fall', 'far',
      'full', 'got', 'grow', 'hold', 'hot', 'hurt', 'if', 'keep', 'kind', 'laugh', 'light', 'long', 'much', 'myself',
      'never', 'only', 'own', 'pick', 'seven', 'shall', 'show', 'six', 'small', 'start', 'ten', 'today', 'together',
      'try', 'warm'],
    color: ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'black', 'pink', 'gray', 'silver'],
    q1sight: ['I', 'my', 'and', 'is', 'two', 'blue', 'one', 'yellow', 'four', 'purple', 'five', 'black', 'eight',
      'pink', 'can', 'like', 'a', 'the', 'big', 'red', 'up', 'green', 'three', 'orange', 'six', 'brown', 'seven',
      'white', 'nine', 'ten', 'see']
  },
  players: {
    moksh: { name: 'Moksh Patel', level: ['dolch1', 'color', 'dolch2', 'dolch3'], clock: 10, block: 0, variance: 10,
      avatar: 'http://icons.iconarchive.com/icons/fasticon/cute-monsters/256/red-monster-happy-icon.png' },
    saarth: { name: 'Saarth Patel', level: ['cvc'], clock: 12, block: 0, variance: 3,
      avatar: 'http://www.icon100.com/up/367/128/boy.png' },
    mital: { name: 'Mital Patel', level: ['dolch4', 'dolch5'], clock: 5, block: 5, variance: 10,
      avatar: 'http://icons.iconarchive.com/icons/icons-land/vista-people/256/Office-Client-Female-Light-icon.png' },
    sejal: { name: 'Sejal Patel', level: ['dolch4', 'dolch5'], clock: 5, block: 5, variance: 10,
      avatar: 'http://iconshow.me/media/images/ui/ios7-icons/png/512/contact-outline.png' }
  }
};
