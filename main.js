const $INPUT = document.getElementById("inputText");
const $FIRST_ROTOR = document.getElementById("firstRotor");
const $SECOND_ROTOR = document.getElementById("secondRotor");
const $THIRD_ROTOR = document.getElementById("thirdRotor");
const $ORIGINAL_TEXT = document.getElementById("originalText");
const $ENCRYPTED_TEXT = document.getElementById("encryptedText");

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".toLocaleLowerCase();
const FIRST_ROTOR_ALPHABET = "cbgahiefjqrskmlnyopxuvtzwd".toLocaleLowerCase();
const SECOND_ROTOR_ALPHABET = "efcdklghijpzqrsytuvxwamnob".toLocaleLowerCase();
const THIRD_ROTOR_ALPHABET = "hgdefolcnpamuqrswtyzvijkxb".toLocaleLowerCase();

const rotorPositions = {
  first: $FIRST_ROTOR.value,
  second: $SECOND_ROTOR.value,
  third: $THIRD_ROTOR.value,
};

function createReflector() {
  const reflectorAlphabet = "DEABFGKHCOLMPYZQRSTUVXWIJN".toLowerCase(); // It can be any random alphabet there
  const reflectorInstance = {};

  for (let i = 0; i < reflectorAlphabet.length; i = i + 2) {
    const slicedString = reflectorAlphabet.substring(i, i + 2);
    reflectorInstance[slicedString[0]] = slicedString[1];
    reflectorInstance[slicedString[1]] = slicedString[0];
  }
  return reflectorInstance;
}

function createRotor(rotorAlphabet, position) {
  const letterToSplit = rotorAlphabet[position - 1];
  const splittedAlphabet = rotorAlphabet.split(letterToSplit);
  const resultedAlphabet = `${letterToSplit}${splittedAlphabet[0]}${splittedAlphabet[1]}`;

  const rotor = {};

  for (let i = 0; i < ALPHABET.length; i++) {
    rotor[ALPHABET[i]] = resultedAlphabet[i];
  }

  return rotor;
}

function reverseRotor(rotor) {
  const newObj = {};
  for (let key in rotor) {
    newObj[rotor[key]] = key;
  }
  return newObj;
}

function rotateRotors() {
  const { first, second, third } = rotorPositions;
  if (first >= ALPHABET.length) {
    rotorPositions.first = 1;
    if (second >= ALPHABET.length) {
      rotorPositions.second = 1;
      if (third >= ALPHABET.length) {
        rotorPositions.third = 1;
      } else {
        rotorPositions.third++;
        $THIRD_ROTOR.value = rotorPositions.third;
      }
    } else {
      rotorPositions.second++;
      $SECOND_ROTOR.value = rotorPositions.second;
    }
  } else {
    rotorPositions.first++;
    $FIRST_ROTOR.value = rotorPositions.first;
  }
}

function runEncryption(letter, reflector) {
  const firstRotor = createRotor(FIRST_ROTOR_ALPHABET, $FIRST_ROTOR.value);
  const secondRotor = createRotor(SECOND_ROTOR_ALPHABET, $SECOND_ROTOR.value);
  const thridRotor = createRotor(THIRD_ROTOR_ALPHABET, $THIRD_ROTOR.value);
  const firstRotorReversed = reverseRotor(firstRotor);
  const secondRotorReversed = reverseRotor(secondRotor);
  const thirdRotorReversed = reverseRotor(thridRotor);

  const firstLetter = firstRotor[letter];
  const secondLetter = secondRotor[firstLetter];
  const thirdLetter = thridRotor[secondLetter];
  const reflectedLetter = reflector[thirdLetter];
  const thirdLetterReversed = thirdRotorReversed[reflectedLetter];
  const secondLetterReversed = secondRotorReversed[thirdLetterReversed];
  return firstRotorReversed[secondLetterReversed];
}

function init() {
  const reflector = createReflector();
  $INPUT.addEventListener("keypress", (event) => {
    const letter = event.key.toLowerCase();
    if (letter === " ") {
      $ENCRYPTED_TEXT.innerHTML += "ss";
      $ORIGINAL_TEXT.innerHTML += " ";
      return;
    }
    if (!ALPHABET.includes(letter)) return;
    $ENCRYPTED_TEXT.innerHTML += runEncryption(letter, reflector);
    $ORIGINAL_TEXT.innerHTML += letter;
    rotateRotors();
  });
}

init();
