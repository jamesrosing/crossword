"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var puppeteer_1 = require("puppeteer");
var fs = require("fs");
var path = require("path");
var openai_1 = require("openai");
// Check if the API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
}
// Initialize OpenAI API client
var openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Paths for output
var wordListPath = path.join(process.cwd(), 'crossword-master', 'data', 'nyt_wordlist.txt');
// NYT Credentials
var NYT_USERNAME = 'mollierosing@gmail.com';
var NYT_PASSWORD = 'Willow2020*';
// Function to log in to New York Times Crossword and scrape data
function scrapeNYTCrossword() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, crosswordUrl, crosswordData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    // Go to the NYT login page
                    return [4 /*yield*/, page.goto('https://myaccount.nytimes.com/auth/login', { waitUntil: 'networkidle0' })];
                case 3:
                    // Go to the NYT login page
                    _a.sent();
                    // Enter the login credentials
                    return [4 /*yield*/, page.type('#username', NYT_USERNAME)];
                case 4:
                    // Enter the login credentials
                    _a.sent();
                    return [4 /*yield*/, page.type('#password', NYT_PASSWORD)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.click('button[type="submit"]')];
                case 6:
                    _a.sent();
                    // Wait for the login to complete and the page to load
                    return [4 /*yield*/, page.waitForNavigation({ waitUntil: 'networkidle0' })];
                case 7:
                    // Wait for the login to complete and the page to load
                    _a.sent();
                    // Navigate to the crossword puzzle page
                    return [4 /*yield*/, page.goto('https://www.nytimes.com/crosswords', { waitUntil: 'networkidle0' })];
                case 8:
                    // Navigate to the crossword puzzle page
                    _a.sent();
                    crosswordUrl = 'https://www.nytimes.com/crosswords/game/mini';
                    return [4 /*yield*/, page.goto(crosswordUrl, { waitUntil: 'networkidle0' })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            var wordCluePairs = [];
                            var clues = document.querySelectorAll('.ClueList-list--2dD5F .Clue-text--3lZl7');
                            var words = document.querySelectorAll('.Cell-letter--3ofWz');
                            clues.forEach(function (clueElem, index) {
                                var _a, _b, _c;
                                var clue = ((_a = clueElem.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                                var word = ((_c = (_b = words[index]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                                if (word && clue) {
                                    wordCluePairs.push({ word: word, clue: clue });
                                }
                            });
                            return wordCluePairs;
                        })];
                case 10:
                    crosswordData = _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 11:
                    _a.sent();
                    return [2 /*return*/, crosswordData];
            }
        });
    });
}
// Function to categorize words and clues into difficulty levels
function categorizeByDifficulty(wordCluePairs) {
    var easy = [];
    var medium = [];
    var hard = [];
    wordCluePairs.forEach(function (_a) {
        var word = _a.word, clue = _a.clue;
        if (word.length <= 4) {
            easy.push({ word: word, clue: clue });
        }
        else if (word.length > 4 && word.length <= 7) {
            medium.push({ word: word, clue: clue });
        }
        else {
            hard.push({ word: word, clue: clue });
        }
    });
    return { easy: easy, medium: medium, hard: hard };
}
// Function to generate novel puzzles based on difficulty level
function generatePuzzlesByDifficulty(wordCluePairs, difficulty) {
    return __awaiter(this, void 0, void 0, function () {
        var words, clues, outputPath, outputStream, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    words = wordCluePairs.map(function (pair) { return pair.word; });
                    return [4 /*yield*/, generateClues(words)];
                case 1:
                    clues = _a.sent();
                    outputPath = path.join(process.cwd(), 'crossword-master', 'data', "wordlist_".concat(difficulty, ".txt"));
                    outputStream = fs.createWriteStream(outputPath);
                    for (i = 0; i < words.length; i++) {
                        outputStream.write("".concat(words[i], "|").concat(clues[i], "\n"));
                    }
                    outputStream.end();
                    console.log("Generated wordlist for ".concat(difficulty, " level at ").concat(outputPath));
                    return [2 /*return*/];
            }
        });
    });
}
// Function to generate clues using OpenAI
function generateClues(words) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, response, clues;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prompt = "Generate short, cryptic crossword clues for the following words. Each clue should be concise and challenging, suitable for a crossword puzzle:\n\n".concat(words.join('\n'), "\n\nProvide the clues in the same order as the words, one per line.");
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: "gpt-3.5-turbo",
                            messages: [{ role: "user", content: prompt }],
                            temperature: 0.7,
                            max_tokens: 1000,
                        })];
                case 1:
                    response = _b.sent();
                    clues = ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.split('\n')) || [];
                    return [2 /*return*/, clues.map(function (clue) { return clue.replace(/^\d+\.\s*/, '').trim(); })];
            }
        });
    });
}
// Main function to scrape and generate puzzles
function generateCrosswordPuzzles() {
    return __awaiter(this, void 0, void 0, function () {
        var wordCluePairs, categorizedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scrapeNYTCrossword()];
                case 1:
                    wordCluePairs = _a.sent();
                    console.log("Scraped ".concat(wordCluePairs.length, " words and clues from NYT."));
                    categorizedData = categorizeByDifficulty(wordCluePairs);
                    // Step 3: Generate and save puzzles for each difficulty level
                    return [4 /*yield*/, generatePuzzlesByDifficulty(categorizedData.easy, 'easy')];
                case 2:
                    // Step 3: Generate and save puzzles for each difficulty level
                    _a.sent();
                    return [4 /*yield*/, generatePuzzlesByDifficulty(categorizedData.medium, 'medium')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, generatePuzzlesByDifficulty(categorizedData.hard, 'hard')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
generateCrosswordPuzzles().catch(console.error);
