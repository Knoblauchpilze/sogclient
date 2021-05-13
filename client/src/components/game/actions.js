
export function millisecondsFromDuration(duration) {
  // This topic helped a bit:
  // https://stackoverflow.com/questions/11909457/how-to-parse-a-duration-string-into-seconds-with-javascript
  // And then the regexp was modified to be both more
  // readable and include fractional seconds from this:
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_Expressions
  const days = duration.match(/([0-9.]+)d/);
  const hours = duration.match(/([0-9.]+)h/);
  const minutes = duration.match(/([0-9.]+)m/);
  const seconds = duration.match(/([0-9.]+)s/);

  let out = 0.0;

  if (days) {
    out += parseInt(days[1]) * 86400;
  }
  if (hours) {
    out += parseInt(hours[1]) * 3600;
  }
  if (minutes) {
    out += parseInt(minutes[1]) * 60;
  }
  if (seconds) {
    out += parseFloat(seconds[1]);
  }

  return out * 1000.0;
}

export function computeActionCompletionTime(action) {
  // Parse creation time and duration of a single action.
  const creation = Date.parse(action.created_at);
  const duration = millisecondsFromDuration(action.completion_time);

  // Compute the end time by adding as many action as needed
  // to reach the current time.
  const now = Date.now();

  let end = creation + duration;
  let count = action.amount - 1;
  while (end < now && count > 0) {
    end += duration;
    --count;
  }

  // `end` now contains the epoch of the time where the
  // next completed item will reach beyong the current
  // time which is exactly what we want.
  const completion = new Date(end);

  return completion - now;
}
