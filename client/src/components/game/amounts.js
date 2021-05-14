
// The threshold above which resources are grouped
// by a dot. This helps readability.
const dotSeparatorThreshold = 1000;

// The threshold above which resources do not use
// the full display anymore.
const shortNotationThreshold = 1000000;

function toFixedDigits(val, digits) {
  // Error case somehow.
  if (digits < 2) {
    return val;
  }

  let dCount = 1;
  if (val > 0) {
    dCount = Math.ceil(Math.log10(val));
  }

  let out = "";
  for (let i = 0 ; i < digits - dCount ; i++) {
    out += "0";
  }

  out += val;

  return out;
}

export function shortenAmount(amount) {
  if (amount < dotSeparatorThreshold) {
    return "" + amount;
  }

  if (amount < shortNotationThreshold) {
    // Insert dot separator in the amount to make
    // it more readable.
    const lead = Math.floor(amount / dotSeparatorThreshold);
    const trailing = amount - lead * dotSeparatorThreshold;

    if (trailing === 0) {
      return lead + "k";
    }

    return lead + "." + toFixedDigits(trailing, 3) + "k";
  }

  const lead = Math.floor(amount / shortNotationThreshold);
  const trailing = Math.floor((amount - lead * shortNotationThreshold) / dotSeparatorThreshold);

  if (trailing === 0) {
    return "" + lead + "M";
  }

  return lead + "," + toFixedDigits(trailing, 3) + "M";
};

export function formatAmount(amount) {
  let out = "";

  // Remove fractional part.
  amount = Math.floor(amount);

  // In case the amount is negative, negate it and
  // add a minus at the end.
  let neg = (amount < 0);
  if (neg) {
    amount = -amount;
  }

  while (amount > 0) {
    // Keep a fixed amount of digits at each step.
    const prefix = amount % dotSeparatorThreshold;

    // Add this at the beginning of the string.
    if (out !== "") {
      out = "." + toFixedDigits(out, 3);
    }
    out = prefix + out;

    // Move to the next group of digits.
    amount = Math.floor(amount / dotSeparatorThreshold);
  }

  if (neg) {
    out = "-" + out;
  }
  else if (out !== "") {
    out = "+" + out;
  }
  else {
    out = "0";
  }

  return out;
};
