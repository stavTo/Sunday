function makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomName() {
  const names = [
    'Jhon',
    'Wick',
    'Strong',
    'Dude',
    'Yep',
    'Hello',
    'World',
    'Power',
    'Goku',
    'Super',
    'Hi',
    'You',
    'Are',
    'Awesome',
  ]
  const famName = [
    'star',
    'kamikaza',
    'family',
    'eat',
    'some',
    'banana',
    'brock',
    'david',
    'gun',
    'walk',
    'talk',
    'board',
    'wing',
    'yang',
    'snow',
    'fire'
  ]
  return (
    names[Math.floor(Math.random() * names.length)] +
    famName[Math.floor(Math.random() * names.length)]
  )
}

function generateRandomImg() {
  //try to get diff img every time
  return 'pro' + Math.floor(Math.random() * 17 + 1) + '.png'
}

function timeAgo(ms = new Date()) {
  const date = ms instanceof Date ? ms : new Date(ms)
  const formatter = new Intl.RelativeTimeFormat('en')
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  }
  const secondsElapsed = (date.getTime() - Date.now()) / 1000
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key]
      let time = formatter.format(Math.round(delta), key)
      if (time.includes('in')) {
        time = time.replace('in ', '')
        time = time.replace('ago', '')
        time += ' ago'
      }
      return time //? time : 'Just now'
    }
  }
}


function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

function getRandomColor() {
	const colors = ['#037f4c', '#00c875', '#9cd326', '#cab641', '#ffcb00', '#784bd1', '#a25ddc', '#0086c0', '#66ccff',
		'#bb3354', '#e2445c', '#ff158a', '#ff5ac4', '#ff642e', '#fdab3d',
		'#7f5347', '#c4c4c4', '#808080']
	return colors[getRandomIntInclusive(0, colors.length - 1)]
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export const utilService = {
  makeId,
  getRandomInt,
  debounce,
  generateRandomName,
  timeAgo,
  generateRandomImg,
  randomPastTime,
  getRandomColor,
  getRandomIntInclusive
}
