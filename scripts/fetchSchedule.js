import csvToArray from "./csvToArray.js";
import {today, moment} from "./time.js";

export default function fetchSchedule (url) {
  return window.fetch(url, {mode: "cors"})
    .then(data => data.text())
    .then(csvToArray)
    .then(removeEmpty)
    .then(sortSchedule)
    .then(groupByTense);

  function removeEmpty (objList) {
    return objList.filter(obj => {
      return !Object.values(obj).includes("");
    });
  }

  function sortSchedule (items) {
    const itemMomentMap = new Map();

    return items.sort(byMoment);

    function byMoment (a, b) {
      return getMoment(a) > getMoment(b) ? 1 : -1;
    }

    function getMoment(item) {
      const map = itemMomentMap;
      let value = map.get(item.queue);
      if (value) return value;

      value =  moment(today, item.queue);
      map.set(item, value);

      return value;
    }
  }

  function groupByTense (items) {
    const now = Date.now();
    const nextIndex = Math.max(0, items.findIndex(findNext));

    return {
      passed: items.slice(0, nextIndex),
      upcoming: items.slice(nextIndex),
    };

    function findNext (item) {
      return item.queue > now;
    }
  }
}