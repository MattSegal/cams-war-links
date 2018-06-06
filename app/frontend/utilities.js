// Lets us use pipe syntax eg. pipe(f,g,h)(x)
const _pipe = (f, g) => (...args) => g(f(...args))
const pipe = (...fns) => fns.reduce(_pipe)


const debounce = delay => {
  let timer = null
  return func => {
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => func( ...args), delay)
      }
  }
}


const titleCase = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1)


const getTimeSince = (date) =>
{
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) { return interval + " years" }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) { return interval + " months" }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) { return interval + " days" }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) { return interval + " hours" }
    interval = Math.floor(seconds / 60);
    if (interval > 1) { return interval + " minutes" }
    return Math.floor(seconds) + " seconds";
}

const TODAY = new Date()
const YESTERDAY = new Date(
    TODAY.getFullYear(),
    TODAY.getMonth(),
    TODAY.getDate() - 1
)
const LAST_WEEK = new Date(
    TODAY.getFullYear(),
    TODAY.getMonth(),
    TODAY.getDate() - 7
)

module.exports = {
    pipe,
    debounce,
    getTimeSince,
    titleCase,
    LAST_WEEK,
}
