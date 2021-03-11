//date formats mapping

/*

%a - abbreviated weekday name.*
%A - full weekday name.*
%b - abbreviated month name.*
%B - full month name.*
%c - the locale’s date and time, such as %x, %X.*
%d - zero-padded day of the month as a decimal number [01,31].
%e - space-padded day of the month as a decimal number [ 1,31]; equivalent to %_d.
%f - microseconds as a decimal number [000000, 999999].
%g - ISO 8601 week-based year without century as a decimal number [00,99].
%G - ISO 8601 week-based year with century as a decimal number.
%H - hour (24-hour clock) as a decimal number [00,23].
%I - hour (12-hour clock) as a decimal number [01,12].
%j - day of the year as a decimal number [001,366].
%m - month as a decimal number [01,12].
%M - minute as a decimal number [00,59].
%L - milliseconds as a decimal number [000, 999].
%p - either AM or PM.*
%q - quarter of the year as a decimal number [1,4].
%Q - milliseconds since UNIX epoch.
%s - seconds since UNIX epoch.
%S - second as a decimal number [00,61].
%u - Monday-based (ISO 8601) weekday as a decimal number [1,7].
%U - Sunday-based week of the year as a decimal number [00,53].
%V - ISO 8601 week of the year as a decimal number [01, 53].
%w - Sunday-based weekday as a decimal number [0,6].
%W - Monday-based week of the year as a decimal number [00,53].
%x - the locale’s date, such as %-m/%-d/%Y.*
%X - the locale’s time, such as %-I:%M:%S %p.*
%y - year without century as a decimal number [00,99].
%Y - year with century as a decimal number, such as 1999.
%Z - time zone offset, such as -0700, -07:00, -07, or Z.
%% - a literal percent sign (%).

*/

/* 

Input	Example	Description
YY	18	Two-digit year
YYYY	2018	Four-digit year
M	1-12	Month, beginning at 1
MM	01-12	Month, 2-digits
MMM	Jan-Dec	The abbreviated month name
MMMM	January-December	The full month name
D	1-31	Day of month
DD	01-31	Day of month, 2-digits
H	0-23	Hours
HH	00-23	Hours, 2-digits
h	1-12	Hours, 12-hour clock
hh	01-12	Hours, 12-hour clock, 2-digits
m	0-59	Minutes
mm	00-59	Minutes, 2-digits
s	0-59	Seconds
ss	00-59	Seconds, 2-digits
S	0-9	Hundreds of milliseconds, 1-digit
SS	00-99	Tens of milliseconds, 2-digits
SSS	000-999	Milliseconds, 3-digits
Z	-05:00	Offset from UTC
ZZ	-0500	Compact offset from UTC, 2-digits
A	AM PM	Post or ante meridiem, upper-case
a	am pm	Post or ante meridiem, lower-case
Do	1st... 31st	Day of Month with ordinal

*/

//#TODO: HANDLE DATEFORMATS WITH REGISTRATION APPROACH + DEFAULT

const dateTokensMap = {
  YYYY: "%Y",
  MM: "%m",
  DD: "%d",
  YY: "%y",
  Month: "%B",
  HH: "%H",
  mm: "%M",
  ss: "%S",
}

export const translateDateFormat = function (df) {
  let out = new String(df)
  Object.keys(dateTokensMap).forEach((token) => {
    const reg = new RegExp(token, "g")
    out = out.replace(reg, dateTokensMap[token])
  })
  return out
}

// actual dateFormats export
const formatsLabels = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "YYYY-MM",
  "YY-MM",
  "MM/YY",
  "MM/YYYY",
  "DD Month YYYY",
  "YYYY",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss",
]

export const dateFormats = {}
formatsLabels.forEach((label) => {
  dateFormats[label] = translateDateFormat(label)
})
