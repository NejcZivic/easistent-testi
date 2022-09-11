// ==UserScript==
// @name TAssistant
// @name:sk TAsistent
// @namespace TAssistant
// @version 1.0
// @description An assistant for E-asistent exams
// @description:sk Asistent za E-asistent teste.
// @author Nejc Živic
// @grant none
// @match https://www.easistent.com/urniki/*
// @license MIT
// ==/UserScript==

(function () {
    function GetExam(subject) {
        let exam;
        switch (subject) {
            case "M": {
                exam = "MAT"
                break;
            }
            case "F": {
                exam = "FIZ"
                break;
            }
            case "K": {
                exam = "KEM"
                break;
            }
            case "B": {
                exam = "BIO"
                break;
            }
            case "Z": {
                exam = "ZGO"
                break;
            }
            case "S": {
                exam = "SLO"
                break;
            }
            case "N": {
                exam = "NEM"
                break;
            }
            case "A": {
                exam = "ANG"
                break;
            }
            case "P": {
                exam = "PSH"
                break;
            }
            case "Š": {
                exam = "ŠVZ"
                break;
            }
            case "G": {
                exam = "GEO"
                break;
            }
        }
        console.log(exam)
        return exam;
    }

    function MarkRed(date, subject) {
        const elements = [];

        for (let i = 0; i <= 12; i++) {
            elements.push(document.getElementById(`ednevnik-seznam_ur_teden-td-${i}-${date}`));
        }

        elements.forEach(el => {
            if (el) {
                if (el.innerText.includes(subject)) {
                    const child1 = el.children.item(0).children.item(0);
                    const child2 = el.children.item(0).children.item(1);
                    child1.style.color = "red";
                    child2.style.color = "red";
                }
            }
        })
    }

    const tabs = document.getElementsByClassName("horizontal_tabs");

    const subject = document.createElement("input");
    subject.placeholder = "Predmet";
    subject.classList.add("horizontal_tab");
    subject.classList.add("subject");
    subject.hidden = true;

    const date = document.createElement("input");
    date.type = "date";
    date.classList.add("horizontal_tab");
    date.classList.add("date");
    date.hidden = true;

    const confirm = document.createElement("button");
    confirm.classList.add("horizontal_tab");
    confirm.classList.add("confirm");
    confirm.innerText = "Potrdi";
    confirm.hidden = true;
    confirm.onclick = () => {
        if (subject.value && date.value) {
            const predmet = subject.value.substring(0, 1).toUpperCase();
            const exams = localStorage.getItem("exams");
            if (exams) {
                const ex = JSON.parse(exams);
                ex.push({
                    subject: predmet,
                    date: date.value
                });
                localStorage.setItem("exams", JSON.stringify(ex));
            } else {
                const ex = [
                    {
                        subject: predmet,
                        date: date.value
                    }
                ];
                localStorage.setItem("exams", JSON.stringify(ex));
            }
            MarkRed(date.value, GetExam(subject.value));

            alert("Uspešno dodano!");
        }
        else {
            alert("Vnesite predmet in datum!");
        }
    }

    const button = document.createElement("a");
    button.innerText = "Dodaj Test";
    button.classList.add("horizontal_tab");
    button.onclick = () => {
        const subject = document.getElementsByClassName("subject")[0];
        const date = document.getElementsByClassName("date")[0];

        if (subject.hidden) {
            subject.hidden = false;
            date.hidden = false;
            confirm.hidden = false;
        }
        else {
            subject.hidden = true;
            date.hidden = true;
            confirm.hidden = true;
        }
    }

    const delExam = document.createElement("a");
    delExam.innerText = "Izbriši Teste";
    delExam.classList.add("horizontal_tab");
    delExam.onclick = () => {
        localStorage.removeItem("exams");
        alert("Uspešno izbrisano!");
    }

    tabs[0].appendChild(button);
    tabs[0].appendChild(subject);
    tabs[0].appendChild(date);
    tabs[0].appendChild(confirm);
    tabs[0].appendChild(delExam);

    const exams = localStorage.getItem("exams");

    if (exams) {
        for (const exam of JSON.parse(exams)) {
            const date = new Date();
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate() + 1;
            let week = date.getDate() + 7;
            let weeks = date.getDate() + 14;

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;
            if (week < 10) week = "0" + week;

            if (exam.date == `${year}-${month}-${weeks}`) {
                alert(`Čez 2 tedna imate test za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${week}`) {
                alert(`Čez 1 teden imate test za ${GetExam(exam.subject)}!`);
            }

            else if (exam.date == `${year}-${month}-${day}`) {
                alert(`Jutri imate test za ${GetExam(exam.subject)}!`);
            }
        }
    }

    setInterval(() => {
        const exams = localStorage.getItem("exams");

        if (exams) {
            for (const exam of JSON.parse(exams)) {
                const subject = GetExam(exam.subject);
                console.log(exam.date, subject);
                MarkRed(exam.date, subject);
            };
        }
    }, 1000);
})();
