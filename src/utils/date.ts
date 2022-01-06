import moment = require("moment");

const toString = (n: number) => {
  return n < 10 ? `0${n}` : `${n}`;
};

// tslint:disable-next-line:variable-name
export const yyyy_mm_dd_hh_mi = (date: Date) => {
  const hour = date.getHours();
  const min = date.getMinutes();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${toString(month)}-${toString(day)}-${toString(hour)}-${toString(min)}`;
};

// tslint:disable-next-line:variable-name
export const yyyy_mm_dd_hh_mi_ss = (date: Date) => {
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${toString(month)}-${toString(day)}-${toString(hour)}-${toString(min)}-${toString(sec)}`;
};

const filterWeek = (start, end, listDate) => {
  if (moment(start).endOf("week") > moment(end)) {
    listDate.push(moment(end));
  } else {
    listDate.push(moment(start).endOf("week"));
    const newDateWeek = moment(moment(start).endOf("week").add(10, "s"));
    listDate.push(newDateWeek);
    filterWeek(newDateWeek, end, listDate);
  }
};

export const getWeekFromDateRange = (start, end) => {
  let listDate = [];
  filterWeek(start, end, listDate);
  listDate = [moment(start), ...listDate];
  const listWeek = [];
  for (let i = 0; i < listDate.length;) {
    listWeek.push([listDate[i], listDate[i + 1]]);
    i += 2;
  }
  return listWeek;
};

const filterMonth = (start, end, listDate) => {
  if (moment(start).endOf("month") > moment(end)) {
    listDate.push(moment(end));
  } else {
    listDate.push(moment(start).endOf("month"));
    const newDateMonth = moment(moment(start).endOf("month").add(10, "s"));
    listDate.push(newDateMonth);
    filterMonth(newDateMonth, end, listDate);
  }
};

export const getMonthFromDateRange = (start, end) => {
  let listDate = [];
  filterMonth(start, end, listDate);
  listDate = [moment(start), ...listDate];
  const listMonth = [];
  for (let i = 0; i < listDate.length;) {
    listMonth.push([listDate[i], listDate[i + 1]]);
    i += 2;
  }
  return listMonth;
};

const filterYear = (start, end, listDate) => {
  if (moment(start).endOf("year") > moment(end)) {
    listDate.push(moment(end));
  } else {
    listDate.push(moment(start).endOf("year"));
    const newDateYear = moment(moment(start).endOf("year").add(10, "s"));
    listDate.push(newDateYear);
    filterYear(newDateYear, end, listDate);
  }
};

export const getYearFromDateRange = (start, end) => {
  let listDate = [];
  filterYear(start, end, listDate);
  listDate = [moment(start), ...listDate];
  const listYear = [];
  for (let i = 0; i < listDate.length;) {
    listYear.push([listDate[i], listDate[i + 1]]);
    i += 2;
  }
  return listYear;
};
