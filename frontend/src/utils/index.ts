export const today = () => new Date().toISOString().slice(0, 10)

export const currentTime = () => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export const to12Hour = (time: string) => {
  let [h, m] = time.split(':').map(Number)
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export const to24Hour = (time: string) => {
  if (!time.includes('AM') && !time.includes('PM')) return time
  let [clock, ampm] = time.split(' ')
  let [h, m] = clock.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m}`
}

export const formatDate = (date: string) => {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const formatMoney = (amount: number) =>
  '₹' + Number(amount).toLocaleString('en-IN')
