import csvToArray from './csvToArray.js';

export default function fetchSchedule (url, today, tonight) {
  return window.fetch(url, {mode: 'cors'})
    .then(data => data.text())
    .then(csvToArray)
    .catch(err => {
      console.warn('Error fetching schedule', err); // eslint-disable-line no-console
      return [];
    })
    .then(removeEmpty)
    .then(renderItemQueues)
    .then(groupByTense);

  function removeEmpty (items) {
    return items.filter(item => {
      return !Object.values(item).includes('');
    });
  }

  function renderItemQueues(items) {
    let firstItemQueue;
    let date = today;
    return items.map(render);

    function render (item, index) {
      const queueString = item.queue;
      let queue = dateFromString(queueString);

      if (index === 0) {
        firstItemQueue = queue;
      }
      else if (queue < firstItemQueue) {
        date = tonight;
        queue = dateFromString(queueString);
      }

      return Object.assign({}, item, {queue, queueString});
    }

    function dateFromString (queueString) {
      const moment = queueString.split(':').map(Number);
      const queue = new Date(date);
      queue.setHours(...moment);
      return queue;
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
