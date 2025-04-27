// ==UserScript==
// @name         ChrCode
// @namespace    http://tampermonkey.net/
// @version      2025-04-16
// @description  try to take over the world!
// @author       cherr
// @match        https://*.catwar.net/*
// @icon         https://i.ibb.co/wm9y1QM/41441dbde58b.png
// @grant        none
// ==/UserScript==
'use strict';

const mydefaultsettings = {
    colorText: "#000000",
    volume: 5,
}
let settings;

function saveS(){
    try {
        localStorage.setItem("mysettings", JSON.stringify(settings));
        window.console.error('Говнокод: ', settings);
    }
    catch(err){
        window.console.error('Говнокод: ', err);
    }
}
function loadS(){
    const storedSettings = localStorage.getItem("mysettings");
    if (storedSettings && typeof storedSettings === "string") {
        const loadedSettings = JSON.parse(storedSettings);
        settings = { ...mydefaultsettings, ...loadedSettings };
        window.console.log(settings);
    } else {
        settings = { ...mydefaultsettings };
        window.console.log("Нет настроек");
    }
}

const pageis = window.location.href;
const CW3 = (/^https:\/\/\w?\.?catwar.net\/cw3(?!(\/kns|\/jagd))/.test(pageis));
const confPage = (/^https:\/\/\w?\.?catwar.net\/settings/.test(pageis));

function soundPlayer() {
    const allSounds = {};
    function addSound(id, url) {
        const audio = new Audio(url);
        allSounds[id] = audio;
    }
    function soundPlay(id, volume) {
        if(allSounds[id]){
            allSounds[id].currentTime = 0;
            allSounds[id].volume = volume / 10;
            allSounds[id].play()
        }
    }
    return {
        addSound,
        soundPlay,
    };
}

const music = soundPlayer();
music.addSound(
  "blockSound",
  "https://github.com/kto-to111/test/raw/refs/heads/main/zvuk1.mp3"
);
music.addSound(
  "unblockSound",
  "https://github.com/kto-to111/test/raw/refs/heads/main/zvuk2.mp3"
);

try {
    if(CW3){
    UploadPageCW3()
    }
    if(confPage){
    UploadPageConf()
    }
}
catch (err) {
  window.console.error('Говнокод: ', err);
}

function UploadPageConf() {

}

function UploadPageCW3() {
    loadS();
    const fightLog = document.getElementById('fightLog');
    let uwuFightLog = document.getElementById('uwu-Compacted-Fight-Log');

    if (uwuFightLog){
    //   console.warn('uwu есть')
        uwuFightLog.style.color = settings.colorText;

        const observer = new MutationObserver((mutations, observer) => {
            const element = document.getElementById('uwu-team-settings'); // тут твой селектор
            if (element) {
                element.style.color = settings.colorText; // пример изменения стиля
                observer.disconnect(); // как только нашли - отключаем слежение
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    else {
    //    console.warn('uwu нет')
        fightLog.style.color = settings.colorText;
    }
    // ====================================================================================================================
    //             ЗВУК БЛОКА афигеть идите нахй
    // ====================================================================================================================

    let blockKey = false;
    function setupImageChangeSound(imgElement, soundElement, targetSrc) {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    if (imgElement.src.includes(targetSrc)) {
                        blockKey = true;
                        music.soundPlay( soundElement, settings.volume);
                    }
                }
            }
        });

        observer.observe(imgElement, {
            attributes: true,
            attributeFilter: ['src']
        });
    }

    const block = document.getElementById('block');
    setupImageChangeSound(block, "blockSound", 'symbole/lock.png');
    document.addEventListener(
        "keyup",
        (event) => {
            if (event.key == 'k' || 'л') {
                setTimeout(() => {
                    const block = document.getElementById("block");
                    if (blockKey) {
                        blockKey = false;
                        music.soundPlay("unblockSound", settings.volume);
                    }
                }, 100);
            }
        },
        false,
    );

    const errorElement = document.getElementById('error');

    // Список фраз, при которых нужно скрывать элемент
    const forbiddenTexts = [
        "перехода с одного места в другое",
        "Я слышу",
        "передвижение возможно",
    ];
    function checkText() {
        const currentText = errorElement.textContent.trim();

        // Проверяем: содержит ли текст хоть одну запрещённую фразу
        const isForbidden = forbiddenTexts.some(forbidden => currentText.includes(forbidden));

        if (isForbidden) {
            errorElement.style.display = 'none'; // если найден запрещённый текст, скрываем
        } else {
            errorElement.style.display = 'block'; // если всё ок, показываем
        }
    }
    const observer = new MutationObserver(checkText);
    observer.observe(errorElement, { childList: true, subtree: true });


}
