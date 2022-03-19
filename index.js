const enterDate = document.getElementById("date");
const separator = document.getElementById("separator");
const inputFormat = document.getElementById("input_format");
const outputFormat = document.getElementById("output_format");
const resultButton = document.getElementById("result_button");
const fromNowButton = document.getElementById("from_now_button");
const resultDateForm = document.getElementById("result_date_form");

const inputFormats = [
  "DDMMYYYY",
  "MMDDYYYY",
  "YYYYMMDD",
  "YYYYDDMM",
  "DDYYYYMM",
  "MMYYYYDD",
  "MMYYYY",
  "YYYYMM",
];

inputFormats.forEach((el) => {
  const optionInput = document.createElement("option");
  const optionOutput = document.createElement("option");
  optionInput.value = el;
  optionOutput.value = el;
  optionInput.textContent = el;
  optionOutput.textContent = el;
  inputFormat.appendChild(optionInput);
  outputFormat.appendChild(optionOutput);
});

class OneMoment {
  getDate(pointerStr, dateFormat, dateStr) {
    let beginIndex = dateFormat.indexOf(pointerStr),
      lastIndex = dateFormat.lastIndexOf(pointerStr),
      resultVal = "";
    for (let i = beginIndex; i < lastIndex + 1; i++) {
      resultVal += dateStr[i];
    }
    return resultVal;
  }

  pushDate(objectDate, outputFormat, separator) {
    const resultDateIndexes = [];
    const resultDateValues = [];
    for (let key in objectDate) {
      resultDateIndexes.push(objectDate[key].indexInOutput);
      resultDateValues.push(objectDate[key].value);
    }
    for (let i = 1; i < resultDateValues.length; i++)
      for (
        let j = i;
        j > 0 && resultDateIndexes[j - 1] > resultDateIndexes[j];
        j--
      ) {
        [resultDateValues[j - 1], resultDateValues[j]] = [
          resultDateValues[j],
          resultDateValues[j - 1],
        ];
      }
    return resultDateValues.join(separator);
  }

  dateFormatter(enterDate, inputFormat, outputFormat, separator) {
    for (let i = 0; i < enterDate.length; i++) {
      if (!/\d/g.test(enterDate[i])) {
        enterDate = enterDate.replace(enterDate[i], "");
      }
    }
    if (enterDate.length < 6 || enterDate.length>8){
      return "Incorrect date!";
    }
    let dateObj = {};
    if (enterDate.length === 8) {
      dateObj = {
        day: {
          value: "",
          indexInOutput: 0,
        },
        month: {
          value: "",
          indexInOutput: 0,
        },
        year: {
          value: "",
          indexInOutput: 0,
        },
      };
    }
    if (enterDate.length === 6) {
      dateObj = {
        month: {
          value: "",
          indexInOutput: 0,
        },
        year: {
          value: "",
          indexInOutput: 0,
        },
      };
    }
    for (let key in dateObj) {
      dateObj[key].value = this.getDate(
        key[0].toUpperCase(),
        inputFormat,
        enterDate
      );
      dateObj[key].indexInOutput = outputFormat.indexOf(key[0].toUpperCase());
    }
    if (dateObj.day && dateObj.day.value > 31) {
      return "Wrong number of days!";
    }
    if (dateObj.month.value > 12) {
      return "Wrong number of months!";
    }
    return this.pushDate(dateObj, outputFormat, separator);
  }

  fromNow(enterDate, inputFormat) {
    for (let i = 0; i < enterDate.length; i++) {
      if (!/\d/g.test(enterDate[i])) {
        enterDate = enterDate.replace(enterDate[i], "");
      }
    }
    if (enterDate.length < 6 || enterDate.length>8){
      return "Incorrect date!";
    }
    const dateObj = {
      day: "",
      month: "",
      year: "",
    };
    const dateNow = new Date();
    const dateObjNow = {
      day: dateNow.getDate(),
      month: dateNow.getMonth() + 1,
      year: dateNow.getFullYear(),
    };
    for (let key in dateObj) {
      dateObj[key] = this.getDate(key[0].toUpperCase(), inputFormat, enterDate);
    }
    if (dateObj.day > 31) {
      return "Wrong number of days!";
    }
    if (dateObj.month > 12) {
      return "Wrong number of months!";
    }

    let a = {};
    let b = {};
    let str = "ago";
    if (
      enterDate.length === 6 &&
      new Date(`${dateObj.year}-${dateObj.month}`) >
        new Date(`${dateObjNow.year}-${dateObjNow.month}`)
    ) {
      a = { ...dateObj };
      b = { ...dateObjNow };
      str = "ahead";
    } else if (
      new Date(`${dateObj.year}-${dateObj.month}-${dateObj.day}`) >
      new Date(`${dateObjNow.year}-${dateObjNow.month}-${dateObjNow.day}`)
    ) {
      a = { ...dateObj };
      b = { ...dateObjNow };
      str = "ahead";
    } else {
      a = { ...dateObjNow };
      b = { ...dateObj };
    }

    for (let key in b) {
      b[key] = a[key] - b[key];
      if (key === "day") {
        if (b.day < 0) {
          a.month--;
          if ([1, 3, 5, 7, 8, 10, 12].includes(a.month)) {
            b.day += 31;
          } else if ([4, 6, 9, 11].includes(a.month)) {
            b.day += 30;
          } else if (a.month === 2) {
            if (a.year % 4) {
              a.day += 29;
            } else {
              a.day += 28;
            }
          }
        }
      } else if (key === "month") {
        if (b.month < 0) {
          a.year--;
          b.month += 12;
        }
      }
    }
    if (b.day)
      return `${b.day} day(s), ${b.month} month(s), ${b.year} year(s) ${str}`;
    return `${b.month} month(s), ${b.year} year(s) ${str}`;
  }
}

let now = new OneMoment();

resultButton.onclick = () =>
  (resultDateForm.textContent = now.dateFormatter(
    enterDate.value,
    inputFormat.value,
    outputFormat.value,
    separator.value
  ));

fromNowButton.onclick = () => {
  resultDateForm.textContent = now.fromNow(enterDate.value, inputFormat.value);
};
