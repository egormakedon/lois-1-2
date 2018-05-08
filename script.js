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
const FORMULA_ID = "formula";
const ANSWER_1_ID = "answer1";
const VALID_FORMULA = "Введенная строка является формулой логики высказываний";
const NOT_VALID_FORMULA = "Введенная строка не является формулой логики высказываний";
const FORMULA_REGEXP = new RegExp('([(]([A-Z]|[0-1])((->)|(&)|(\\|)|(~))([A-Z]|[0-1])[)])|([(][!]([A-Z]|[0-1])[)])|([A-Z])|([0-1])','g');
const CONTAINER_ID = "container";
const FORMULA_LABEL_ID = "formulaLabel";
const TABLE_ID = "table";
const ANSWER_2_ID = "answer2";
const FORMULA_PROTIVORECHIVAYA = "Формула является противоречивой";
const FORMULA_NON_PROTIVORECHIVAYA = "Формула не является противоречивой";
const R = "R";

const NEGATION = "!";
const CONJUNCTION = "&";
const DISJUNCTION = "|";
const IMPLICATION = "->";
const EQUIVALENCE = "~";

//Переменные, используемые для расчета таблицы истинности
let countAnswer = 0;
let n = 1;

//Стартовая фунция запуска скрипта
function run() {
    let formula = document.getElementById(FORMULA_ID).value;
    if (!validateFormula(formula)) {
        printAnswer(NOT_VALID_FORMULA);
        document.getElementById(CONTAINER_ID).hidden = true;
        return;
    }

    printAnswer(VALID_FORMULA);
    document.getElementById(CONTAINER_ID).hidden = false;
    document.getElementById(FORMULA_LABEL_ID).innerHTML = formula;

    let obj = calculateTableTruth(formula);

    let answer2 = document.getElementById(ANSWER_2_ID);
    if (countAnswer == n) {
        answer2.innerHTML = FORMULA_PROTIVORECHIVAYA;
    } else {
        answer2.innerHTML = FORMULA_NON_PROTIVORECHIVAYA;
    }

    if (obj != null) {
        printTableTruth(obj.table, obj.symbolSize);
    }
}

//Функция печати ответа в элемент answer на html документе
function printAnswer(answer) {
    let answerElement = document.getElementById(ANSWER_1_ID);
    answerElement.innerHTML = answer;
}

//Функция валидации входящей строки
function validateFormula(formula) {
    let t;
    do {
        t = formula;
        formula = formula.replace(FORMULA_REGEXP, R);
    } while (formula != t);

    return formula == R;
}

//@author Artem Trushkov
//Функция рассчитывания таблицы истинности
function calculateTableTruth(formula) {
    countAnswer = 0;
    n = 1;

    if(formula == '0') {
        countAnswer = 1;
        return null;
    }

    if(formula == '1') {
        return null;
    }

    let answer = formula;
    let symbolInFormula = calculateFormulaSymbols(formula).sort();
    let sizeSymbolInFormula = symbolInFormula.length;
    n = Math.pow(2, sizeSymbolInFormula);

    let table = {};
    for (let index = 0; index < n; index++) {
        let inputParameters = calculateInputFormulaParameters(index, sizeSymbolInFormula);
        let obj = createFormulaWithPatameters(symbolInFormula, inputParameters);

        obj[answer] = getAnswer(formula, obj);
        table[index] = obj;

        if (obj[answer] == 0) {
            countAnswer++;
        }
    }

    return  {
        table: table,
        symbolSize: sizeSymbolInFormula
    };
}

//Функция нахождения количества символов в формуле
function calculateFormulaSymbols(formula) {
    const SYMBOL_REGEXP = new RegExp('([A-Z])', "g");
    let results = formula.match(SYMBOL_REGEXP);

    for(let i = 0; i < results.length; i++) {
        for(let j = i + 1; j < results.length; j++) {
            if (results[i] == results[j]) {
                results.splice(j, 1);
                j--;
            }
        }
    }
    return results;
}

//Функция печати таблицы истинности
function printTableTruth(table, symbolSize) {
    let tableSize = Math.pow(2, symbolSize);
    let html = "";

    html += "<tr>";

    for (let key of Object.keys(table[0])) {
        html += "<td>" + key + "</td>"
    }

    html += "</tr>";

    for (let index = 0; index < tableSize; index++) {
        let object = table[index];
        html += "<tr>";

        for (let key of Object.keys(object)) {
            html += "<td>" + object[key] + "</td>"
        }
        html += "</tr>";
    }

    let tableElement = document.getElementById(TABLE_ID);
    tableElement.innerHTML = html;
}

//@author Artem Trushkov
//Функция расчета входных параметров для формулы
function calculateInputFormulaParameters(index, symbolSize) {
    let res = (index >>> 0).toString(2);
    for (let index = res.length; index < symbolSize; index++) {
        res = "0" + res;
    }

    return res;
}

//Создания объекта формулы со входными параметрами
function createFormulaWithPatameters(symbolInFormula, inputParameters) {
    let object = {};
    for (let index = 0; index < symbolInFormula.length; index++) {
        let symbol = symbolInFormula[index];
        object[symbol] = inputParameters[index];
    }

    return object;
}

//Функция получения результата логической формулы
function getAnswer(formula, obj){
    let constFormula = formula;
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        constFormula = constFormula.replace(new RegExp(key, 'g'), value);
    }
    return calculateFormula(constFormula);
}

//Функция высчитывания результата логической формулы
function calculateFormula(formula) {
    const REGEXP = new RegExp("([(][" + NEGATION + "][0-1][)])|" + "([(][0-1]((" + CONJUNCTION + ")|("+ "\\" + DISJUNCTION + ")|(" + IMPLICATION + ")|(" + EQUIVALENCE + "))[0-1][)])");
    while (REGEXP.exec(formula) != null) {
        let subFormula = REGEXP.exec(formula)[0];
        let result = calculateSimpleFormula(subFormula);
        formula = formula.replace(subFormula, result);
    }

    return formula;
}

//Высчитывание простой формулы
function calculateSimpleFormula(subFormula) {
    if (subFormula.indexOf(NEGATION) > -1) {
        return calculateNegation(subFormula);
    }

    if (subFormula.indexOf(CONJUNCTION) > -1) {
        return calculateConjunction(subFormula);
    }

    if (subFormula.indexOf(DISJUNCTION) > -1) {
        return calculationDisjunction(subFormula);
    }

    if (subFormula.indexOf(IMPLICATION) > -1) {
        return calculateImplication(subFormula);
    }

    if (subFormula.indexOf(EQUIVALENCE) > -1) {
        return calculateEquivalence(subFormula);
    }
}

//Функция высчитывания отрицания
function calculateNegation(subFormula) {
    if (parseInt(subFormula[2]) == 1) {
        return 0;
    }
    return 1;
}

//Функция высчитывания конъюнкции
function calculateConjunction(subFormula) {
    if (parseInt(subFormula[1]) && parseInt(subFormula[3])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания дизъюнкции
function calculationDisjunction(subFormula) {
    if (parseInt(subFormula[1]) || parseInt(subFormula[3])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания импликации
function calculateImplication(subFormula) {
    if ((!parseInt(subFormula[1])) || parseInt(subFormula[4])) {
        return 1;
    } else {
        return 0;
    }
}

//Функция высчитывания эквиваленции
function calculateEquivalence(subFormula) {
    if (parseInt(subFormula[1]) == parseInt(subFormula[3])) {
        return 1;
    } else {
        return 0;
    }
}