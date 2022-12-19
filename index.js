// index.js
// where your node app starts

var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
	res.json({ greeting: 'hello API' });
});

//* GET /api/:date?
app.get('/api/:date', (req, res) => {
	let inputDate = req.params.date;

	if (isValidDate(inputDate)) {
		let unixDate = Math.floor(new Date(inputDate));
		let utcDate = parseDateToUTC(inputDate);

		res.json({ unix: unixDate, utc: utcDate });
	}

	res.json({ error: 'Invalid Date' });
});

// Validates that the input string is a valid date formatted as "YYYY-MM-DD"
function isValidDate(dateString) {
	// First check for the pattern
	if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) return false;

	// Separate the date parts
	let parts = dateString.split('-');

	const year = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	const day = parseInt(parts[2]);

	// Check the ranges of MONTH and YEAR
	if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

	const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Adjust for leap years
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29;

	// Check the range of DAY
	return day > 0 && day <= monthLength[month - 1];
}

/**
 * Parses dates from Unix format to UTC format
 * @param dateString
 * @returns the UTC equivalent of @param
 */
function parseDateToUTC(dateString) {
	let parts = dateString.split('-');

	const year = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	const date = parseInt(parts[2]);
	const time = '00:00:00 GMT';

	let day = parseDay(new Date(dateString).getDay());

	return day + date + parseMonth(month) + year + ' ' + time;
}

/**
 * Parses days input from Number to readable text format
 * @param dayInput
 * @returns the short and readable version of @param
 */
function parseDay(dayInput) {
	switch (dayInput) {
		case 1:
			return 'Mon, ';
		case 2:
			return 'Tue, ';
		case 3:
			return 'Wed, ';
		case 4:
			return 'Thu, ';
		case 5:
			return 'Fri, ';
		case 6:
			return 'Sat, ';
		case 7:
			return 'Sun, ';
	}
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
