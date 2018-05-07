//@author Македон Егор Александрович
//@group 521702
//@year 2018
//@subject ЛОИС
//@title Лабораторная работа N1-2
/*@task B3. B: Проверить является ли строка формулой логики высказываний.
            3: Проверить является ли формула невыполнимой (противоречивой).*/

//Включение строгого стандарта написания js скриптов
"use strict";

//Опредеоение константных перепенных
const FORMULA = "formula";
const ANSWER = "answer1";
const VALID_FORMULA = "Введенная строка является формулой логики высказываний";
const NOT_VALID_FORMULA = "Введенная строка не является формулой логики высказываний";
const FORMULA_REGEXP = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])','g');

//Стартовая фунция запуска скрипта
function run() {
    let formula = document.getElementById(FORMULA).value;
    if (validateFormula(formula)) {
        printAnswer(VALID_FORMULA);
    } else {
        printAnswer(NOT_VALID_FORMULA);
    }
}

//Функция печати ответа в элемент answer на html документе
function printAnswer(answer) {
    let answerElement = document.getElementById(ANSWER);
    answerElement.innerHTML = answer;
}

//Функция валидации входящей строки
function validateFormula(formula) {
    const R = "R";

    let t;
    do {
        t = formula;
        formula = formula.replace(FORMULA_REGEXP, R);
    } while (formula != t);

    return formula == R;
}