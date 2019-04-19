export const Uo = {
  math: {
    scale(
      numbers, 
      targetMin = 0, 
      targetMax = 100, 
      numbersMin = Math.min(...(numbers || [])), 
      numbersMax = Math.max(...(numbers || []))) 
    {
      if (!numbers.length)
        return [];
    
      const nDiff = numbersMax - numbersMin;
      const diff = targetMax - targetMin;
    
      return numbers.map(n => ((n - numbersMin) / nDiff) * diff + targetMin);
    },
    average(
      numbers)
    {
      if (!numbers.length)
        return null;

      return numbers.reduce((p, c) => p + c) / numbers.length;
    }
  }
};

export function dateString(d) {
  const date = new Date(d);
  return (isNaN(date)
    ? ''
    : `${date
      .getFullYear()}-${(date
      .getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}`);
}

export function dateTimeString(d) {
    const date = new Date(d);
    return (isNaN(date)
      ? ''
      : `${date
        .getFullYear()}-${(date
        .getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`);
}

export function timeTodayOrDateString(d)
{
    const date = new Date(d);
    return (isNaN(date)
      ? ''
      : date.toDateString() == new Date().toDateString()
        ? `${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        : `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`);
}

export function percentString(d) {
  const double = parseFloat(d);
  return isNaN(double)
    ? ""
    : double.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + "%";
}

export function decimalString(d) {
  return d && d.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  });
}

export function valueOrNull(accessor) {
  try
  {
    return accessor();
  }
  catch
  {
    return null;
  }
}

export function request(verb, uri, { body, bearerToken, contentType } = {} ) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(verb, uri, true);
    if (bearerToken)
      request.setRequestHeader('authorization', `Bearer ${bearerToken}`);
    if (contentType)
      request.setRequestHeader('content-type', contentType);
    request.onerror = reject;
    request.onload = function () {
      if (this.status >= 200 && this.status < 400)
        resolve(this.response);
      else
        reject(new Error(this.response));
    };
    request.send(body);
  });
}

export async function requestJson(verb, uri, { body, bearerToken, contentType } = {} ) {
  const response = await request(verb, uri, { body, bearerToken, contentType });
  return JSON.parse(response);
}
